<template>
  <div class="p-6">
    <!-- Back -->
    <button @click="$router.back()" class="mb-4 text-blue-600 underline">
      ← Back to list
    </button>

    <!-- Card -->
    <div class="bg-white shadow rounded-lg p-6">
      <h1 class="text-2xl font-semibold mb-6">Ship Information</h1>

      <div v-if="ship" class="grid grid-cols-2 gap-6 text-sm">
        <div>
          <p class="text-gray-500">SHIP CODE</p>
          <p class="font-medium">{{ ship.ship_code }}</p>
        </div>

        <div>
          <p class="text-gray-500">SHIP NAME</p>
          <p class="font-medium">{{ ship.ship_name }}</p>
        </div>

        <div>
          <p class="text-gray-500">NATIONALITY</p>
          <p class="font-medium">{{ ship.nationality }}</p>
        </div>

        <div>
          <p class="text-gray-500">LENGTH</p>
          <p class="font-medium">{{ ship.length }}</p>
        </div>

        <div>
          <p class="text-gray-500">DRAFT</p>
          <p class="font-medium">{{ ship.draft }}</p>
        </div>

        <div>
          <p class="text-gray-500">GROSS TONNAGE</p>
          <p class="font-medium">{{ ship.gross_tonnage }}</p>
        </div>

        <div>
          <p class="text-gray-500">AGENCY</p>
          <p class="font-medium">{{ ship.agency || "—" }}</p>
        </div>

        <div>
          <p class="text-gray-500">Status</p>
          <p
            :class="
              ship.status === 'ACTIVE'
                ? 'text-green-600 font-medium'
                : 'text-red-500 font-medium'
            "
          >
            {{ ship.status }}
          </p>
        </div>

        <div>
          <p class="text-gray-500">Created At</p>
          <p class="font-medium">{{ formatDateTime(ship.created_at) }}</p>
        </div>

        <div>
          <p class="text-gray-500">Updated At</p>
          <p class="font-medium">{{ formatDateTime(ship.updated_at) }}</p>
        </div>
      </div>

      <div v-else class="text-gray-500">Loading...</div>
    </div>

    <div class="flex justify-center mt-5 gap-5">
      <button
        class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
      >
        Lock ship
      </button>

      <button
        @click="handleDeleteShip(ship.ship_id)"
        class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Delete ship
      </button>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import shipsService from "@/services/ship-services";
import formateDate from "@/helpers/format-datetime.js";
import Swal from "sweetalert2";

const formatDateTime = formateDate.formatDateTime;

const route = useRoute();
const ship = ref(null);

const getshipDetail = async () => {
  try {
    const shipId = route.params.ship_id;
    const res = await shipsService.getShipById(shipId);
    ship.value = res.data.ship;
  } catch (error) {
    console.error("Error fetching ship:", error);
  }
};

const handleDeleteShip = async (id) => {
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
      await shipsService.deleteShip(id);
      Swal.fire("Deleted!", "The ship has been deleted.", "success");
      // Redirect back to the ship list after deletion
      setTimeout(() => {
        window.history.back();
      }, 1500);
    }
  } catch (error) {
    console.error("Error deleting ship:", error);
    Swal.fire("Error!", "There was an issue deleting the ship.", "error");
  }
};
onMounted(() => {
  getshipDetail();
});
</script>
