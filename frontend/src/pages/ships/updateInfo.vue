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
        <h2 class="text-xl font-semibold text-gray-800">Edit Ship</h2>
        <p class="text-sm text-gray-500">Update ship information</p>
      </div>

      <form
        v-if="form"
        @submit.prevent="updateship"
        class="p-6 grid md:grid-cols-2 gap-6"
      >
        <!-- Ship Code -->
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-900">
            Ship Code
          </label>
          <input
            v-model="form.ship_code"
            type="text"
            class="flowbite-input"
            required
          />
        </div>

        <!-- Ship Name -->
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-900">
            Ship Name
          </label>
          <input
            v-model="form.ship_name"
            type="text"
            class="flowbite-input"
            required
          />
        </div>

        <!-- Nationality -->
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-900">
            Nationality
          </label>
          <input
            v-model="form.nationality"
            type="text"
            class="flowbite-input"
          />
        </div>

        <!-- Length -->
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-900">
            Length (m)
          </label>
          <input
            v-model="form.length"
            type="number"
            class="flowbite-input"
            step="0.01"
          />
        </div>

        <!-- Draft -->
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-900">
            Draft (m)
          </label>
          <input
            v-model="form.draft"
            type="number"
            class="flowbite-input"
            step="0.01"
          />
        </div>

        <!-- GT -->
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-900">
            GROSS TONNAGE
          </label>
          <input
            v-model="form.gross_tonnage"
            type="number"
            class="flowbite-input"
            step="0.01"
          />
        </div>

        <!-- Agency -->
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-900">
            Agency
          </label>
          <input v-model="form.agency" type="text" class="flowbite-input" />
        </div>

        <!-- Status -->
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-900">
            Status
          </label>
          <select v-model="form.status" class="flowbite-input">
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
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
import shipsService from "@/services/ship-services";

const route = useRoute();
const router = useRouter();

const form = ref(null);

// Load ship detail -> bind vào form
const getshipDetail = async () => {
  const id = route.params.ship_id;
  const res = await shipsService.getShipById(id);

  form.value = {
    ship_code: res.data.ship.ship_code,
    ship_name: res.data.ship.ship_name,
    nationality: res.data.ship.nationality,
    length: res.data.ship.length,
    draft: res.data.ship.draft,
    gross_tonnage: res.data.ship.gross_tonnage,
    agency: res.data.ship.agency,
    status: res.data.ship.status,
  };
};

// Update ship
const updateship = async () => {
  try {
    await shipsService.updateShip(route.params.ship_id, form.value);
    alert("Update ship successfully!");
router.push({ name: "admin.ships" });
  } catch (error) {
    console.error(error);
    alert("Update failed!");
  }
};

onMounted(getshipDetail);
</script>
