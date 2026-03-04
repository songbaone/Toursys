<template>
  <div class="flex flex-col justify-center items-center h-screen gap-10">
    <h1 class="text-xl">Question to AIILOO ADMIN PAGES</h1>
    <div class="flex flex-col">
      <label for="question" class="text-sm font-medium text-heading"
        >Ai là chủ tọa của Aiiloooooooooooooooooooooooo?</label
      ><br />
      <input
        type="text"
        id="question"
        name="question"
        class="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
        placeholder="Enter your answer"
      /><br />

      <router-link
        :to="{ name: 'admin.login' }"
        class="text-white bg-brand box-border border border-transparent text-center hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
        >GỬI</router-link
      >
    </div>
  </div>
</template>
