<template>
  <div class="p-6">
    <!-- Back -->
    <button @click="$router.back()" class="mb-4 text-blue-600 underline">
      ← Back to list
    </button>

    <!-- Card -->
    <div class="bg-white shadow rounded-lg p-6">
      <h1 class="text-2xl font-semibold mb-6">User Information</h1>

      <div v-if="user" class="grid grid-cols-2 gap-6 text-sm">
        <div>
          <p class="text-gray-500">User ID</p>
          <p class="font-medium">{{ user.user_id }}</p>
        </div>

        <div>
          <p class="text-gray-500">Full Name</p>
          <p class="font-medium">{{ user.full_name }}</p>
        </div>

        <div>
          <p class="text-gray-500">Email</p>
          <p class="font-medium">{{ user.email }}</p>
        </div>

        <div>
          <p class="text-gray-500">Password</p>
          <p
            class="font-medium text-blue-600 underline cursor-pointer"
            @click="resetPassword"
          >
            Reset password
          </p>
        </div>

        <div>
          <p class="text-gray-500">Phone</p>
          <p class="font-medium">{{ user.phone || "—" }}</p>
        </div>

        <div>
          <p class="text-gray-500">Gender</p>
          <p class="font-medium">
            <span v-if="user.gender === true">Nam</span>
            <span v-else-if="user.gender === false">Nữ</span>
            <span v-else>—</span>
          </p>
        </div>

        <div>
          <p class="text-gray-500">Address</p>
          <p class="font-medium">{{ user.address || "—" }}</p>
        </div>

        <div>
          <p class="text-gray-500">Birthday</p>
          <p class="font-medium">
            {{ user.birthday ? formatDateTime(user.birthday) : "—" }}
          </p>
        </div>

        <div>
          <p class="text-gray-500">Role</p>
          <p class="font-medium">
            {{ user.role_id === "AD" ? "Quản trị viên" : "Nhân viên" }}
          </p>
        </div>

        <div>
          <p class="text-gray-500">Status</p>
          <p
            :class="
              user.status === 'active'
                ? 'text-green-600 font-medium'
                : 'text-red-500 font-medium'
            "
          >
            {{ user.status }}
          </p>
        </div>

        <div>
          <p class="text-gray-500">Created At</p>
          <p class="font-medium">{{ formatDateTime(user.createdAt) }}</p>
        </div>

        <div>
          <p class="text-gray-500">Updated At</p>
          <p class="font-medium">{{ formatDateTime(user.updatedAt) }}</p>
        </div>
      </div>

      <div v-else class="text-gray-500">Loading...</div>
    </div>

    <div class="flex justify-center mt-5 gap-5">
      <button
        class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
      >
        Lock User
      </button>

      <button
        @click="deleteUser"
        class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Delete User
      </button>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import UsersService from "@/services/user-services";
import formateDate from "@/helpers/format-datetime.js";

const formatDateTime = formateDate.formatDateTime;

const route = useRoute();
const user = ref(null);

const getUserDetail = async () => {
  try {
    const email = route.params.email;
    const res = await UsersService.getUserByEmail(email);
    user.value = res.data.user;
  } catch (error) {
    console.error("Error fetching user:", error);
  }
};

onMounted(() => {
  getUserDetail();
});
</script>
