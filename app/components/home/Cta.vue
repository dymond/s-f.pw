<template>
  <div
    class="flex flex-col items-center max-w-4xl p-8 mx-auto my-12 text-center bg-black rounded-lg md:px-20 md:py-20"
  >
    <h2 class="text-4xl tracking-tight text-white md:text-6xl">
      {{ $t('home.cta.title') }}
    </h2>
    <p class="mt-4 text-lg text-slate-400 md:text-xl">
      With just a few simple clicks, you can create your own short version of a link that looks like this:
    </p>
    <a href="/SalarySchedule" class="block p-2 bg-grey-500 border border-grey-300 text-[2.5vw] sm:text-base mt-4"><pre>https://s-f.help/SalarySchedule</pre></a>
    <p class="mt-4 text-lg text-slate-400 md:text-xl">
      instead of this:
    </p>
    <pre class="block p-2 bg-grey-500 border border-grey-300 text-[2.5vw] sm:text-base mt-4">https://www.sfcollege.edu/hr/assets/Salary%20Schedule.pdf</pre>
    <div class="mt-4">
      <div class="flex">
        <HomeLink
          href="/dashboard"
          type="inverted"
          :title="$t('home.cta.button')"
        >
          {{ $t('home.cta.button') }}
        </HomeLink>
      </div>
    </div>
  </div>
</template>
