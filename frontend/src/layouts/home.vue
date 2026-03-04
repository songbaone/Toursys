<template>
  <div class="flex h-screen bg-violet-200/50">
    <div class="w-60 shrink-0">
      <SideBar />
    </div>

    <!-- body -->
    <div class="flex-1 h-screen">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import SideBar from "@/components/SideBar.vue";
</script>
