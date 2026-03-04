<template>
  <div class="p-6">
    <!-- Back -->
    <button
      @click="$router.back()"
      class="mb-6 text-sm font-medium text-blue-600 hover:underline"
    >
      ← Back to list
    </button>

    <!-- Card -->
    <div
      class="max-w-5xl mx-auto bg-white rounded-xl shadow-md border border-gray-200"
    >
      <div class="p-6 border-b">
        <h2 class="text-xl font-semibold text-gray-800">Edit User</h2>
        <p class="text-sm text-gray-500">Update user information</p>
      </div>

      <form
        v-if="form"
        @submit.prevent="updateUser"
        class="p-6 grid md:grid-cols-2 gap-6"
      >
        <!-- Full Name -->
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-900">
            Full Name
          </label>
          <input
            v-model="form.full_name"
            type="text"
            class="flowbite-input"
            required
          />
        </div>

        <!-- Email -->
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-900">
            Email
          </label>
          <input
            v-model="form.email"
            type="email"
            readonly
            class="flowbite-input bg-gray-100 cursor-not-allowed"
          />
        </div>

        <!-- Phone -->
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-900">
            Phone
          </label>
          <input v-model="form.phone" type="text" class="flowbite-input" />
        </div>

        <!-- Gender -->
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-900">
            Gender
          </label>
          <select v-model="form.gender" class="flowbite-input">
            <option :value="true">Nam</option>
            <option :value="false">Nữ</option>
          </select>
        </div>

        <!-- Address -->
        <div class="md:col-span-2">
          <label class="block mb-2 text-sm font-medium text-gray-900">
            Address
          </label>
          <input v-model="form.address" type="text" class="flowbite-input" />
        </div>

        <!-- Birthday -->
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-900">
            Birthday
          </label>
          <input v-model="form.birthday" type="date" class="flowbite-input" />
        </div>

        <!-- Role -->
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-900">
            Role
          </label>
          <select v-model="form.role_id" class="flowbite-input">
            <option value="AD">Administrator</option>
            <option value="SA">Staff</option>
          </select>
        </div>

        <!-- Status -->
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-900">
            Status
          </label>
          <select v-model="form.status" class="flowbite-input">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <!-- Actions -->
        <div class="md:col-span-2 flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            @click="$router.back()"
            class="flowbite-btn-secondary"
          >
            Cancel
          </button>

          <button type="submit" class="flowbite-btn-primary">
            Save Changes
          </button>
        </div>
      </form>

      <div v-else class="p-6 text-gray-500">Loading...</div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import UsersService from "@/services/user-services";

const route = useRoute();
const router = useRouter();

const form = ref(null);

// Load user detail -> bind vào form
const getUserDetail = async () => {
  const email = route.params.email;
  const res = await UsersService.getUserByEmail(email);

  form.value = {
    full_name: res.data.user.full_name,
    email: res.data.user.email,
    phone: res.data.user.phone,
    gender: res.data.user.gender,
    address: res.data.user.address,
    birthday: res.data.user.birthday?.split("T")[0],
    role_id: res.data.user.role_id,
    status: res.data.user.status,
  };
};

// Update user
const updateUser = async () => {
  try {
    await UsersService.updateUser(form.value.email, form.value);
    alert("Update user successfully!");
    router.push("/users");
  } catch (error) {
    console.error(error);
    alert("Update failed!");
  }
};

onMounted(getUserDetail);
</script>
