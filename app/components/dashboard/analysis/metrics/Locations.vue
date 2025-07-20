<script setup>
import { useElementVisibility } from '@vueuse/core'
import { debounce } from 'lodash-es'

const id = inject('id')
const time = inject('time')
const filters = inject('filters')

// Reactive state
const worldMapTopoJSON = ref({})
const areaData = ref([])
const isMapDataLoading = ref(false)
const isVisible = ref(false)
const isInitialized = ref(false)

// Template ref
const containerRef = ref()
const targetIsVisible = useElementVisibility(containerRef)

// Lazy load visualization libraries only when needed
let VisSingleContainer = null
let VisTopoJSONMap = null
let VisTopoJSONMapSelectors = null
let ChartTooltip = null

async function loadVisualizationLibraries() {
  if (VisSingleContainer)
    return // Already loaded

  const [unovisVue, chartTooltip] = await Promise.all([
    import('@unovis/vue'),
    import('@/components/ui/chart'),
  ])

  VisSingleContainer = unovisVue.VisSingleContainer
  VisTopoJSONMap = unovisVue.VisTopoJSONMap
  VisTopoJSONMapSelectors = unovisVue.VisTopoJSONMapSelectors
  ChartTooltip = chartTooltip.ChartTooltip
}

// Debounced API call to prevent excessive requests
const debouncedGetMapData = debounce(async () => {
  if (!isVisible.value)
    return

  isMapDataLoading.value = true
  areaData.value = []

  const { data } = await useAPI('/api/stats/metrics', {
    query: {
      type: 'country',
      id: id.value,
      startAt: time.value.startAt,
      endAt: time.value.endAt,
      limit: 100, // Add pagination limit
      offset: 0,
      ...filters.value,
    },
  })

  if (Array.isArray(data)) {
    areaData.value = data.map((country) => {
      country.id = country.name
      return country
    })
  }
  isMapDataLoading.value = false
}, 300)

// Lazy load world map TopoJSON data
async function getWorldMapJSON() {
  if (!isVisible.value)
    return
  const data = await $fetch('/world.json')
  worldMapTopoJSON.value = data
}

// Initialize component when it becomes visible
async function initializeComponent() {
  if (isInitialized.value)
    return

  isInitialized.value = true

  // Load everything in parallel
  await Promise.all([
    loadVisualizationLibraries(),
    getWorldMapJSON(),
    debouncedGetMapData(),
  ])
}

// Watch for visibility changes
watch(targetIsVisible, (visible) => {
  if (visible && !isInitialized.value) {
    isVisible.value = true
    initializeComponent()
  }
}, { immediate: true })

// Watch for time and filter changes, but only if component is visible
watch([time, filters], () => {
  if (isVisible.value) {
    debouncedGetMapData()
  }
}, {
  deep: true,
})

// Cleanup on unmount
onBeforeUnmount(() => {
  debouncedGetMapData.cancel?.()
})

const valueFormatter = v => v
const Tooltip = {
  props: ['title', 'data'],
  setup(props) {
    const title = props.data[1]?.value?.name
    const data = [{
      name: props.title,
      value: props.data[3]?.value?.count,
      color: 'black',
    }]
    return () => h(ChartTooltip, { title, data })
  },
}
</script>

<template>
  <Card ref="containerRef" class="flex flex-col md:h-[500px]">
    <CardHeader>
      <CardTitle>{{ $t('dashboard.locations') }}</CardTitle>
    </CardHeader>
    <CardContent class="flex-1 flex [&_[data-radix-aspect-ratio-wrapper]]:flex-1">
      <AspectRatio :ratio="65 / 30">
        <!-- Loading state -->
        <div v-if="!isInitialized" class="flex items-center justify-center h-full">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          <span class="ml-2 text-sm text-muted-foreground">Loading map...</span>
        </div>

        <!-- Map visualization -->
        <component
          :is="VisSingleContainer"
          v-else-if="worldMapTopoJSON.type && VisSingleContainer"
          :data="{ areas: areaData }"
          class="h-full"
        >
          <component
            :is="VisTopoJSONMap"
            :topojson="worldMapTopoJSON"
            map-feature-name="countries"
          />
          <ChartSingleTooltip
            index="id"
            :selector="VisTopoJSONMapSelectors?.feature"
            :items="areaData"
            :value-formatter="valueFormatter"
            :custom-tooltip="Tooltip"
          />
        </component>

        <!-- Fallback if data fails to load -->
        <div v-else-if="isInitialized" class="flex items-center justify-center h-full">
          <span class="text-sm text-muted-foreground">Unable to load map data</span>
        </div>
      </AspectRatio>
    </CardContent>
  </Card>
</template>
