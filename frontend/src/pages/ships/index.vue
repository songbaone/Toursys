<template>
  <div class="scroll-auto h-screen overflow-y-auto shrink-0">
    <!-- Title -->
    <div class="p-4 flex justify-between items-center shrink">
      <div>
        <h1 class="text-2xl font-semibold text-blue-950">SHIPS MANAGEMENT</h1>
      </div>
      <div class="flex gap-2">
        <input
          v-model="keyword"
          @keyup.enter="searchShips"
          type="text"
          placeholder="Search name, code, agency..."
          class="border px-3 py-2 rounded-md text-sm w-64"
        />

        <button
          @click="searchShips"
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
      <!-- button add Ship -->
      <div>
        <button
          @click="openModal"
          class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Add Ship
        </button>

        <!-- form add Ship -->
        <!-- MODAL ADD Ship -->
        <div
          v-if="showModal"
          class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
        >
          <div class="bg-white rounded-lg shadow-lg w-full max-w-md">
            <!-- Header -->
            <div class="flex justify-between items-center border-b px-5 py-3">
              <h2 class="text-lg font-semibold">Add New Ship</h2>
              <button
                @click="closeModal"
                class="text-gray-500 hover:text-red-500"
              >
                ✕
              </button>
            </div>

            <!-- Body -->
            <form @submit.prevent="submitShip" class="p-5 space-y-4">
              <!-- Ship Code -->
              <div>
                <label class="block text-sm mb-1">Ship Code</label>
                <input
                  v-model="form.ship_code"
                  type="text"
                  class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-200"
                  required
                />
              </div>

              <!-- Ship Name -->
              <div>
                <label class="block text-sm mb-1">Ship Name</label>
                <input
                  v-model="form.ship_name"
                  type="text"
                  class="w-full border rounded px-3 py-2 text-sm"
                  required
                />
              </div>

              <!-- Nationality -->
              <div>
                <label class="block text-sm mb-1">Nationality</label>
                <input
                  v-model="form.nationality"
                  type="text"
                  class="w-full border rounded px-3 py-2 text-sm"
                />
              </div>

              <!-- Length -->
              <div>
                <label class="block text-sm mb-1">Length</label>
                <input
                  v-model="form.length"
                  type="text"
                  class="w-full border rounded px-3 py-2 text-sm"
                />
              </div>

              <!-- Draft  mớn nước-->
              <div>
                <label class="block text-sm mb-1">Draft</label>
                <input
                  v-model="form.draft"
                  type="text"
                  class="w-full border rounded px-3 py-2 text-sm"
                />
              </div>

              <!-- Gross Tonnage  thể tích không gian tàu-->
              <div>
                <label class="block text-sm mb-1">Gross Tonnage</label>
                <input
                  v-model="form.gross_tonnage"
                  type="text"
                  class="w-full border rounded px-3 py-2 text-sm"
                />
              </div>

              <!-- Agency  đại lý-->
              <div>
                <label class="block text-sm mb-1">Agency</label>
                <input
                  v-model="form.agency"
                  type="text"
                  class="w-full border rounded px-3 py-2 text-sm"
                />
              </div>

              <!-- Current Position  vị trí hiện tại-->
              <div>
                <label class="block text-sm mb-1">Current Position</label>
                <input
                  v-model="form.current_position"
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
                  Save Ship
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <!-- Note -->
    <div class="flex px-5">
      <p>GT: Gross Tonnage</p>
    </div>
    <!-- DATA TABLE Ships -->
    <div v-if="ShipData" class="m-5">
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
              <th scope="col" class="px-6 py-3 font-bold">Ship Code</th>
              <th scope="col" class="px-6 py-3 font-bold">Ship Name</th>
              <th scope="col" class="px-6 py-3 font-bold">Nationality</th>
              <th scope="col" class="px-6 py-3 font-bold">Length (m)</th>
              <th scope="col" class="px-6 py-3 font-bold">Draft (m)</th>
              <th scope="col" class="px-6 py-3 font-bold">GT</th>
              <th scope="col" class="px-6 py-3 font-bold">Agency</th>
              <th scope="col" class="px-6 py-3 font-bold">Current Position</th>
              <th scope="col" class="px-6 py-3 font-bold">Status</th>
              <th scope="col" class="px-6 py-3 font-bold">Updated at</th>
              <th scope="col" class="px-6 py-3 font-bold">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in ShipData"
              :key="item.id"
              class="bg-neutral-primary border-b border-default hover:bg-blue-50 hover:cursor-pointer transition"
            >
              <th
                scope="row"
                class="px-6 py-4 font-bold text-heading whitespace-nowrap"
              >
                {{ (currentPage - 1) * 10 + ShipData.indexOf(item) + 1 }}
              </th>
              <td class="px-6 py-4">{{ item.ship_id }}</td>
              <td class="px-6 py-4">
                <span v-if="item.ship_name">{{ item.ship_name }}</span>
                <span v-else>Chưa cập nhật</span>
              </td>
              <td class="px-6 py-4">{{ item.nationality }}</td>
              <td class="px-6 py-4">{{ item.length }}</td>
              <td class="px-6 py-4">{{ item.draft }}</td>
              <td class="px-6 py-4">{{ item.gross_tonnage }}</td>
              <td class="px-6 py-4">{{ item.agency }}</td>
              <td class="px-6 py-4">{{ item.current_port_name }}</td>
              <td class="px-6 py-4">
                <span
                  :class="{
                    'text-green-600': item.status === 'ACTIVE',
                    'text-red-600': item.status === 'INACTIVE',
                  }"
                >
                  {{ item.status }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span v-if="item.updated_at">
                  {{ formatDateTime(item.updated_at) }}</span
                >
                <span v-else>Chưa cập nhật</span>
              </td>

              <td class="px-6 py-4 flex gap-2">
                <router-link
                  :to="{
                    name: 'ShipDetail',
                    params: { ship_id: item.ship_id },
                  }"
                >
                  <span class="text-blue-600 underline">View</span>
                </router-link>

                <router-link
                  :to="{ name: 'ShipEdit', params: { ship_id: item.ship_id } }"
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
      @page-change="getShips"
    />
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import formateDate from "@/helpers/format-datetime.js";
import ShipsService from "../../services/ship-services";
const formatDateTime = formateDate.formatDateTime;
import PaginationComponent from "@/components/Pagination.vue";
const currentPage = ref(1);
const keyword = ref("");

const totalPagesData = ref(1);
const getShips = async (page) => {
  try {
    currentPage.value = page; // Cập nhật trang hiện tại
    const res = await ShipsService.getShips({
      page,
      keyword: keyword.value,
    });
    console.log("Response data:", res.data);
    ShipData.value = res.data.ships;
    totalPagesData.value = res.data.totalPages;
  } catch (error) {
    console.error("Error fetching Ships:", error);
    return [];
  }
};

const ShipData = ref([]);

const showModal = ref(false);
const form = ref({
  ship_code: "",
  ship_name: "",
  nationality: "",
  length: "",
  draft: "",
  gross_tonnage: "",
  agency: "",
  current_position: "",
  status: "ACTIVE",
});

const openModal = () => {
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  resetForm();
};

const resetForm = () => {
  form.value = {
    ship_code: "",
    ship_name: "",
    nationality: "",
    length: "",
    draft: "",
    gross_tonnage: "",
    agency: "",
    current_position: "",
    status: "ACTIVE",
  };
};

const submitShip = async () => {
  try {
    const res = await ShipsService.createShip(form.value);
    console.log("Ship created successfully:", res.data);
    closeModal();
    await getShips(currentPage.value);
    alert("Ship created successfully!");
  } catch (error) {
    console.error("Error creating Ship:", error);
  }
};

const searchShips = async () => {
  currentPage.value = 1;
  await getShips(1);
};

const clearSearch = async () => {
  keyword.value = "";
  await getShips(1);
};

onMounted(async () => {
  await getShips(1);
});
</script>
