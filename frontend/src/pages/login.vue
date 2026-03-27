<template>
  <div
    class="flex items-center justify-center h-screen bg-blue-500/50 flex-col gap-10"
  >
    <div class="shadow-xl/20">
      <div class="p-8 rounded-lg bg-white w-96 shadow-md">
        <form class="max-w-sm mx-auto" @submit.prevent="handleLogin">
          <div class="mb-5">
            <h1 class="text-center">ADMIN PAGE</h1>
          </div>
          <div class="mb-5">
            <label
              for="email"
              class="block mb-2.5 text-sm font-medium text-heading"
              >Email</label
            >
            <input
              v-model="email"
              type="text"
              id="email"
              class="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
              placeholder="Enter your email"
              required
            />
          </div>
          <div class="mb-5">
            <label
              for="password"
              class="block mb-2.5 text-sm font-medium text-heading"
              >Password</label
            >
            <input
              v-model="password"
              type="password"
              id="password"
              class="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
              placeholder="••••••••"
              required
            />
          </div>
          <div class="flex justify-center">
            <button
              type="submit"
              :disabled="loading"
              class="text-white w-full bg-brand disabled:opacity-60 rounded-2xl"
            >
              <span v-if="loading">Đang đăng nhập...</span>
              <span v-else>Submit</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import LoginService from "../services/login";
import { useRouter } from "vue-router";

const router = useRouter();
const email = ref("");
const password = ref("");
const loading = ref(false);

const handleLogin = async () => {
  if (loading.value) return;

  loading.value = true;
  try {
    const res = await LoginService.login(email.value, password.value, "SA");

    if (res.status === 200) {
      console.log("Login success:", res.data);
      setTimeout(() => {
        router.push({ name: "admin.dashboard" });
      }, 1000);
    }
  } catch (error) {
    console.error("Sai thông tin đăng nhập", error);

    setTimeout(() => {
      alert("Email hoặc mật khẩu không đúng!");
      loading.value = false;
    }, 1000);
  }
};
</script>
