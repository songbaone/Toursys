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
        <h2 class="text-xl font-semibold text-gray-800">Edit Role</h2>
        <p class="text-sm text-gray-500">Update role information</p>
      </div>

      <form
        v-if="form"
        @submit.prevent="updateRole"
        class="p-6 grid md:grid-cols-2 gap-6"
      >
        <!-- Role ID -->
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-900">
            Role ID
          </label>
          <input
            v-model="form.role_id"
            type="text"
            class="flowbite-input"
            disabled
          />
        </div>

        <!-- Role name -->
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-900">
            Role name
          </label>
          <input
            v-model="form.role_name"
            type="text"
            class="flowbite-input bg-gray-100 cursor-not-allowed"
          />
        </div>

        <!-- Description -->
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-900">
            Description
          </label>
          <input
            v-model="form.description"
            type="text"
            class="flowbite-input"
          />
        </div>

        <!-- Status -->
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-900">
            Status
          </label>
          <select v-model="form.status" class="flowbite-select">
            <option value="1">Active</option>
            <option value="0">Inactive</option>
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
import RoleService from "@/services/role-services";

const route = useRoute();
const router = useRouter();

const form = ref(null);

// Load role detail -> bind vào form
const getRoleDetail = async () => {
  const role_id = route.params.role_id;
  const res = await RoleService.getRoleById(role_id);

  form.value = {
    role_id: res.data.dataInfo.role_id,
    role_name: res.data.dataInfo.role_name,
    status: res.data.dataInfo.status,
    description: res.data.dataInfo.description,
  };
};

// Update role
const updateRole = async () => {
  try {
    await RoleService.updateRole(form.value.role_id, form.value);
    alert("Update role successfully!");
    router.push({ name: "admin.roles" });
  } catch (error) {
    console.error(error);
    alert("Update failed!");
  }
};

onMounted(getRoleDetail);
</script>
