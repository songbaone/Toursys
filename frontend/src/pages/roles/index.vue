<template>
  <div class="scroll-auto h-screen overflow-y-auto">
    <div class="flex justify-between items-center p-4">
      <!-- Title -->
      <div class="p-4">
        <h1 class="text-2xl font-semibold text-blue-950">ROLES MANAGEMENT</h1>
      </div>
      <div>
        <button
          @click="openModal"
          class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Add Role
        </button>

        <!-- form add roles -->
        <!-- MODAL ADD roles -->
        <div
          v-if="showModal"
          class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
        >
          <div class="bg-white rounded-lg shadow-lg w-full max-w-md">
            <!-- Header -->
            <div class="flex justify-between items-center border-b px-5 py-3">
              <h2 class="text-lg font-semibold">Add New Role</h2>
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
                <label class="block text-sm mb-1">Role id</label>
                <input
                  v-model="form.role_id"
                  type="text"
                  class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-200"
                  required
                />
              </div>

              <!-- Email -->
              <div>
                <label class="block text-sm mb-1">Role name</label>
                <input
                  v-model="form.role_name"
                  type="text"
                  class="w-full border rounded px-3 py-2 text-sm"
                  required
                />
              </div>

              <!-- Phone -->
              <div>
                <label class="block text-sm mb-1">Description</label>
                <input
                  v-model="form.description"
                  type="text"
                  class="w-full border rounded px-3 py-2 text-sm"
                />
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
                  Save Role
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- =======================DATA TABLE USERS -->
    <div v-if="rolesData" class="m-5">
      <div
        class="relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base border border-default"
      >
        <table class="w-full text-sm text-left rtl:text-right text-body">
          <thead
            class="text-sm text-body bg-neutral-secondary-soft border-b rounded-base border-default"
          >
            <tr>
              <th scope="col" class="px-6 py-3 font-bold">No.</th>

              <th scope="col" class="px-6 py-3 font-bold">ID</th>
              <th scope="col" class="px-6 py-3 font-bold">Name</th>
              <th scope="col" class="px-6 py-3 font-bold">Description</th>
              <th scope="col" class="px-6 py-3 font-bold">Status</th>
              <th scope="col" class="px-6 py-3 font-bold">Created at</th>
              <th scope="col" class="px-6 py-3 font-bold">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in rolesData"
              :key="item.id"
              class="bg-neutral-primary border-b border-default hover:bg-blue-50 hover:cursor-pointer transition"
            >
              <td class="px-6 py-4 font-bold text-heading whitespace-nowrap">
                {{ rolesData.indexOf(item) + 1 }}
              </td>

              <th
                scope="row"
                class="px-6 py-4 font-medium text-heading whitespace-nowrap"
              >
                {{ item.role_id }}
              </th>
              <td class="px-6 py-4">{{ item.role_name }}</td>
              <td class="px-6 py-4">{{ item.description }}</td>
              <td class="px-6 py-4">{{ item.status }}</td>
              <td class="px-6 py-4">{{ formatDateTime(item.created_at) }}</td>
              <td class="px-6 py-4">
                <router-link
                  :to="{ name: 'RoleEdit', params: { role_id: item.role_id } }"
                  class="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Edit
                </router-link>
                |
                <button
                  class="text-red-600 hover:text-red-800 font-medium"
                  @click="handleDeleteRole(item.role_id)"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import formateDate from "@/helpers/format-datetime.js";
import roleService from "../../services/role-services";
import Swal from "sweetalert2";
const formatDateTime = formateDate.formatDateTime;
const rolesData = ref([]);
const fetchRoles = async () => {
  try {
    const res = await roleService.getRoles();
    rolesData.value = res.data.dataInfo;
    console.log("Fetched roles:", rolesData.value);
  } catch (error) {
    console.error("Error fetching roles:", error);
  }
};
const showModal = ref(false);
const form = ref({
  role_id: "",
  role_name: "",
  description: "",
});
const openModal = () => {
  showModal.value = true;
};
const closeModal = () => {
  showModal.value = false;
  form.value = {
    role_id: "",
    role_name: "",
    description: "",
  };
};
const submitUser = async () => {
  try {
    const res = await roleService.createRole(form.value);
    console.log("Role created successfully:", res.data);
    closeModal();
    fetchRoles(); // Refresh the list of roles after adding a new one
    alert("Role created successfully!", { type: "success" });
  } catch (error) {
    console.error("Error creating role:", error);
  }
};

const handleDeleteRole = async (id) => {
  try {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      await roleService.deleteRole(id);
      Swal.fire("Deleted!", "The role has been deleted.", "success");
      fetchRoles(); // Refresh the list of roles after deletion
    }
  } catch (error) {
    console.error("Error deleting role:", error);
    Swal.fire("Error!", "There was an issue deleting the role.", "error");
  }
};
onMounted(() => {
  fetchRoles();
});
</script>
