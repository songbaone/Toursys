<template>
  <div class="scroll-auto h-screen overflow-y-auto shrink-0">
    <!-- Title -->
    <div class="p-4 flex justify-between items-center">
      <h1 class="text-2xl font-semibold text-blue-950">PORT MANAGEMENT</h1>

      <!-- Search -->
      <div class="flex gap-2">
        <input
          v-model="keyword"
          @keyup.enter="searchPorts"
          type="text"
          placeholder="Search code, name, address..."
          class="border px-3 py-2 rounded-md text-sm w-64"
        />

        <button
          @click="searchPorts"
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

      <!-- Add -->
      <button
        @click="openModal"
        class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        Add Port
      </button>
    </div>

    <!-- TABLE -->
    <div class="m-5">
      <div class="overflow-x-auto bg-white shadow rounded">
        <table class="w-full text-sm text-left">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-6 py-3">No.</th>
              <th class="px-6 py-3">Code</th>
              <th class="px-6 py-3">Name</th>
              <th class="px-6 py-3">Address</th>
              <th class="px-6 py-3">Status</th>
              <th class="px-6 py-3">Created</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="port in portData"
              :key="port.port_id"
              class="border-b hover:bg-blue-50"
            >
              <td class="px-6 py-4">
                {{ (currentPage - 1) * 10 + portData.indexOf(port) + 1 }}
              </td>

              <td class="px-6 py-4 font-semibold">{{ port.port_code }}</td>
              <td class="px-6 py-4">{{ port.port_name }}</td>
              <td class="px-6 py-4">{{ port.address }}</td>
              <td class="px-6 py-4">{{ port.status }}</td>
              <td class="px-6 py-4">{{ formatDateTime(port.created_at) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <PaginationComponent
      :pageCount="totalPages"
      :currentPage="currentPage"
      @page-change="getPorts"
    />

    <!-- MODAL -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/40 flex items-center justify-center"
    >
      <div class="bg-white rounded-lg w-full max-w-md p-5">
        <h2 class="text-lg font-semibold mb-4">Add Port</h2>

        <form @submit.prevent="submitPort" class="space-y-4">
          <input
            v-model="form.port_code"
            placeholder="Port Code"
            class="input"
          />
          <input
            v-model="form.port_name"
            placeholder="Port Name"
            class="input"
          />
          <input v-model="form.address" placeholder="Address" class="input" />

          <select v-model="form.status" class="input">
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>

          <div class="flex justify-end gap-2">
            <button type="button" @click="closeModal" class="btn">
              Cancel
            </button>
            <button type="submit" class="btn-primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import PortService from "@/services/port-services";
import PaginationComponent from "@/components/Pagination.vue";
import formateDate from "@/helpers/format-datetime.js";

const formatDateTime = formateDate.formatDateTime;

const portData = ref([]);
const keyword = ref("");
const currentPage = ref(1);
const totalPages = ref(1);

const showModal = ref(false);

const form = ref({
  port_code: "",
  port_name: "",
  address: "",
  status: "ACTIVE",
});

const getPorts = async (page = 1) => {
  currentPage.value = page;

  const res = await PortService.getPorts({
    page,
    keyword: keyword.value,
  });

  portData.value = [...res.data.ports];
  totalPages.value = res.data.totalPages;
};

const searchPorts = async () => {
  await getPorts(1);
};

const clearSearch = async () => {
  keyword.value = "";
  await getPorts(1);
};

const openModal = () => (showModal.value = true);
const closeModal = () => (showModal.value = false);

const submitPort = async () => {
  await PortService.createPort(form.value);
  closeModal();
  await getPorts(currentPage.value);
};

onMounted(() => getPorts());
</script>
