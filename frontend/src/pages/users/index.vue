<template>
  <div class="scroll-auto h-screen overflow-y-auto shrink-0">
    <!-- Title -->
    <div class="p-4 flex justify-between items-center shrink">
      <div>
        <h1 class="text-2xl font-semibold text-blue-950">USERS MANAGEMENT</h1>
      </div>
      <div class="flex gap-2">
        <input
          v-model="keyword"
          @keyup.enter="searchUsers"
          type="text"
          placeholder="Search name, email, phone..."
          class="border px-3 py-2 rounded-md text-sm w-64"
        />

        <button
          @click="searchUsers"
          class="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
        >
          Search
        </button>

        <button
          v-if="keyword"
          @click="clearSearch"
          class="px-3 py-2 border rounded-md text-sm"
        >
          Clear
        </button>
      </div>
      <!-- button add user -->
      <div>
        <button
          @click="openModal"
          class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Add User
        </button>

        <!-- form add user -->
        <!-- MODAL ADD USER -->
        <div
          v-if="showModal"
          class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
        >
          <div class="bg-white rounded-lg shadow-lg w-full max-w-md">
            <!-- Header -->
            <div class="flex justify-between items-center border-b px-5 py-3">
              <h2 class="text-lg font-semibold">Add New User</h2>
              <button
                @click="closeModal"
                class="text-gray-500 hover:text-red-500"
              >
                ✕
              </button>
            </div>

            <!-- Body -->
            <form @submit.prevent="submitUser" class="p-5 space-y-4">
              <!-- Full Name -->
              <div>
                <label class="block text-sm mb-1">Full Name</label>
                <input
                  v-model="form.full_name"
                  type="text"
                  class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-200"
                  required
                />
              </div>

              <!-- Email -->
              <div>
                <label class="block text-sm mb-1">Email</label>
                <input
                  v-model="form.email"
                  type="email"
                  class="w-full border rounded px-3 py-2 text-sm"
                  required
                />
              </div>

              <!-- Phone -->
              <div>
                <label class="block text-sm mb-1">Phone</label>
                <input
                  v-model="form.phone"
                  type="text"
                  class="w-full border rounded px-3 py-2 text-sm"
                />
              </div>

              <!-- Gender -->
              <div>
                <label class="block text-sm mb-1">Gender</label>
                <select
                  v-model="form.gender"
                  class="w-full border rounded px-3 py-2 text-sm"
                >
                  <option value="">-- Select --</option>
                  <option value="1">Male</option>
                  <option value="0">Female</option>
                </select>
              </div>

              <!-- Role -->
              <div>
                <label class="block text-sm mb-1">Role</label>
                <select
                  v-model="form.role_id"
                  class="w-full border rounded px-3 py-2 text-sm"
                  required
                >
                  <option value="SA">Nhân viên</option>
                  <option value="AD">Quản trị viên</option>
                </select>
              </div>

              <!-- Status -->
              <div>
                <label class="block text-sm mb-1">Status</label>
                <select
                  v-model="form.status"
                  class="w-full border rounded px-3 py-2 text-sm"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>

              <!-- Footer -->
              <div class="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  @click="closeModal"
                  class="px-4 py-2 border rounded text-sm"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  class="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  Save User
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- DATA TABLE USERS -->
    <div v-if="userData" class="m-5">
      <div
        class="relative shrink-0 bg-neutral-primary-soft shadow-xs rounded-base border border-default overflow-x-auto"
      >
        <table
          class="w-full whitespace-nowrap text-xs text-left rtl:text-right text-body"
        >
          <thead
            class="text-sm text-body bg-neutral-secondary-soft border-b rounded-base border-default"
          >
            <tr>
              <th scope="col" class="px-6 py-3 font-bold">No.</th>

              <th scope="col" class="px-6 py-3 font-bold">ID</th>
              <th scope="col" class="px-6 py-3 font-bold">Name</th>
              <th scope="col" class="px-6 py-3 font-bold">Birthday</th>
              <th scope="col" class="px-6 py-3 font-bold">Gender</th>
              <th scope="col" class="px-6 py-3 font-bold">Phone</th>
              <th scope="col" class="px-6 py-3 font-bold">Email</th>
              <th scope="col" class="px-6 py-3 font-bold">Role</th>
              <th scope="col" class="px-6 py-3 font-bold">Status</th>
              <th scope="col" class="px-6 py-3 font-bold">Updated at</th>
              <th scope="col" class="px-6 py-3 font-bold">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in userData"
              :key="item.id"
              class="bg-neutral-primary border-b border-default hover:bg-blue-50 hover:cursor-pointer transition"
            >
              <th
                scope="row"
                class="px-6 py-4 font-bold text-heading whitespace-nowrap"
              >
                {{ (currentPage - 1) * 10 + userData.indexOf(item) + 1 }}
              </th>
              <td class="px-6 py-4">{{ item.user_id }}</td>
              <td class="px-6 py-4">{{ item.full_name }}</td>
              <td class="px-6 py-4">
                <span v-if="item.birthday">{{
                  formatDateBirth(item.birthday)
                }}</span>
                <span v-if="item.birthday === null">Chưa cập nhật</span>
              </td>
              <td class="px-6 py-4">
                <span v-if="item.gender === true">Nam</span>
                <span v-if="item.gender === false">Nữ</span>
                <span v-if="item.gender === null">Chưa cập nhật</span>
              </td>
              <td class="px-6 py-4">{{ item.phone }}</td>
              <td class="px-6 py-4">{{ item.email }}</td>

              <td class="px-6 py-4">
                <span v-if="item.role_id === 'SA'">Nhân viên</span>
                <span v-if="item.role_id === 'AD'">Quản trị viên</span>
              </td>
              <td class="px-6 py-4">{{ item.status }}</td>

              <td class="px-6 py-4">{{ formatDateTime(item.updatedAt) }}</td>
              <td class="px-6 py-4 flex gap-2">
                <router-link
                  :to="{ name: 'UserDetail', params: { email: item.email } }"
                >
                  <span class="text-blue-600 underline">View</span>
                </router-link>

                <router-link
                  :to="{ name: 'UserEdit', params: { email: item.email } }"
                >
                  <span class="text-blue-600 underline">Edit</span>
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- Pagination -->
    <PaginationComponent
      :pageCount="totalPagesData"
      :currentPage="currentPage"
      @page-change="getUsers"
    />
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import formateDate from "@/helpers/format-datetime.js";
import UsersService from "../../services/user-services";
const formatDateTime = formateDate.formatDateTime;
const formatDateBirth = formateDate.formatDateBirth;
import PaginationComponent from "@/components/Pagination.vue";
const currentPage = ref(1);
const keyword = ref("");

const totalPagesData = ref(1);
const getUsers = async (page) => {
  try {
    currentPage.value = page; // Cập nhật trang hiện tại
    const res = await UsersService.getUsers({
      page,
      keyword: keyword.value,
    });
    console.log("Response data:", res.data);
    userData.value = res.data.users;
    totalPagesData.value = res.data.totalPages;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

const userData = ref([]);

const showModal = ref(false);
const DEFAULT_PASSWORD = import.meta.env.VITE_PASSWORD_DEFAULT;
console.log("ENV:", import.meta.env.VITE_PASSWORD_DEFAULT);
const form = ref({
  full_name: "",
  email: "",
  password: DEFAULT_PASSWORD,
  phone: "",
  gender: "",
  role_id: "SA",
  status: "ACTIVE",
});
console.log("FORM SUBMIT:", form.value);

const openModal = () => {
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  resetForm();
};

const resetForm = () => {
  form.value = {
    full_name: "",
    email: "",
    phone: "",
    gender: "",
    password: DEFAULT_PASSWORD,
    role_id: "SA",
    status: "ACTIVE",
  };
};

const submitUser = async () => {
  try {
    const res = await UsersService.createUser(form.value);
    console.log("User created successfully:", res.data);
    closeModal();
    await getUsers(currentPage.value);
    alert("User created successfully!");
  } catch (error) {
    console.error("Error creating user:", error);
  }
};

const searchUsers = async () => {
  currentPage.value = 1;
  await getUsers(1);
};

const clearSearch = async () => {
  keyword.value = "";
  await getUsers(1);
};

onMounted(async () => {
  await getUsers(1);
});
</script>
