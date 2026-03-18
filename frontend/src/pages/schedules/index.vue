<template>
  <div class="scroll-auto h-screen overflow-y-auto">
    <div class="flex justify-between items-center p-4">
      <!-- Title -->
      <div class="p-4">
        <h1 class="text-2xl font-semibold text-blue-950">
          SCHEDULES MANAGEMENT
        </h1>
      </div>
      <div>
        <button
          @click="openModal"
          class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Add Schedule
        </button>

        <!-- form add schedules -->
        <!-- MODAL ADD schedules -->
        <div
          v-if="showModal"
          class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
        >
          <div class="bg-white rounded-lg shadow-lg w-full max-w-md">
            <!-- Header -->
            <div class="flex justify-between items-center border-b px-5 py-3">
              <h2 class="text-lg font-semibold">Add New Schedule</h2>
              <button
                @click="closeModal"
                class="text-gray-500 hover:text-red-500"
              >
                ✕
              </button>
            </div>

            <!-- Body -->
            <form @submit.prevent="submitSchedule" class="p-5 space-y-4">
              <!-- choose ship -->
              <div class="relative">
                <label class="block text-sm mb-1">Choose Ship</label>

                <!-- Select box -->
                <div
                  @click="openShip = !openShip"
                  class="w-full border rounded px-3 py-2 text-sm cursor-pointer bg-white"
                >
                  {{
                    selectedShip
                      ? "Tàu " +
                        selectedShip.ship_name +
                        " - " +
                        selectedShip.ship_id
                      : "-- Chọn tàu --"
                  }}
                </div>

                <!-- Dropdown -->
                <div v-if="openShip">
                  <div class="max-h-40 overflow-y-auto border rounded">
                    <div
                      v-for="ship in ships"
                      :key="ship.ship_id"
                      @click="selectShip(ship)"
                      class="px-3 py-2 hover:bg-blue-100 cursor-pointer"
                    >
                      {{ "Tàu " + ship.ship_name + " - " + ship.ship_id }}
                    </div>

                    <!-- Load more -->
                    <div
                      v-if="pageShip < totalShipPages"
                      @click="loadMoreShips"
                      class="px-3 py-2 text-center text-blue-500 cursor-pointer"
                    >
                      Load more...
                    </div>
                  </div>
                </div>
              </div>

              <!-- Choose pilot -->
              <div class="relative">
                <label class="block text-sm mb-1">Choose Pilot</label>

                <!-- Select box -->
                <div
                  @click="openPilot = !openPilot"
                  class="w-full border rounded px-3 py-2 text-sm cursor-pointer bg-white"
                >
                  {{
                    selectedPilot
                      ? selectedPilot.user_id + " - " + selectedPilot.full_name
                      : "-- Chọn thuyền viên --"
                  }}
                </div>

                <!-- Dropdown -->
                <div
                  v-if="openPilot"
                  class="absolute w-full bg-white z-10 mt-1"
                >
                  <div class="max-h-40 overflow-y-auto border rounded">
                    <div
                      v-for="pilot in pilots"
                      :key="pilot.pilot_id"
                      @click="selectPilot(pilot)"
                      class="px-3 py-2 hover:bg-blue-100 cursor-pointer"
                    >
                      {{ pilot.user_id + " - " + pilot.full_name }}
                    </div>

                    <!-- Load more -->
                    <div
                      v-if="pageUser < totalUserPages"
                      @click="loadMorePilots"
                      class="px-3 py-2 text-center text-blue-500 cursor-pointer"
                    >
                      Load more...
                    </div>
                  </div>
                </div>
              </div>

              <!-- Choose departure port -->
              <div class="relative">
                <label class="block text-sm mb-1">Choose Departure Port</label>

                <!-- Select box -->
                <div
                  @click="openPort = !openPort"
                  class="w-full border rounded px-3 py-2 text-sm cursor-pointer bg-white"
                >
                  {{
                    selectedPort
                      ? selectedPort.port_name + " - " + selectedPort.port_id
                      : "-- Chọn cảng --"
                  }}
                </div>

                <!-- Dropdown -->
                <div v-if="openPort" class="absolute w-full bg-white z-10 mt-1">
                  <div class="max-h-40 overflow-y-auto border rounded">
                    <div
                      v-for="port in ports"
                      :key="port.port_id"
                      @click="selectPort(port)"
                      class="px-3 py-2 hover:bg-blue-100 cursor-pointer"
                    >
                      {{ port.port_name + " - " + port.port_id }}
                    </div>

                    <!-- Load more -->
                    <div
                      v-if="pagePort < totalPortPages"
                      @click="loadMorePorts"
                      class="px-3 py-2 text-center text-blue-500 cursor-pointer"
                    >
                      Load more...
                    </div>
                  </div>
                </div>
              </div>

              <!-- Choose arrival port -->
              <div class="relative">
                <label class="block text-sm mb-1">Choose Arrival Port</label>

                <!-- Select box -->
                <div
                  @click="openArrivalPort = !openArrivalPort"
                  class="w-full border rounded px-3 py-2 text-sm cursor-pointer bg-white"
                >
                  {{
                    selectedArrivalPort
                      ? selectedArrivalPort.port_name +
                        " - " +
                        selectedArrivalPort.port_id
                      : "-- Chọn cảng đến --"
                  }}
                </div>

                <!-- Dropdown -->
                <div
                  v-if="openArrivalPort"
                  class="absolute w-full bg-white z-10 mt-1"
                >
                  <div class="max-h-40 overflow-y-auto border rounded">
                    <div
                      v-for="port in arrivalPorts"
                      :key="port.port_id"
                      @click="selectArrivalPort(port)"
                      class="px-3 py-2 hover:bg-blue-100 cursor-pointer"
                    >
                      {{ port.port_name + " - " + port.port_id }}
                    </div>

                    <!-- Load more -->
                    <div
                      v-if="pageArrivalPort < totalArrivalPortPages"
                      @click="loadMoreArrivalPorts"
                      class="px-3 py-2 text-center text-blue-500 cursor-pointer"
                    >
                      Load more...
                    </div>
                  </div>
                </div>
              </div>

              <!-- Choose departure time -->
              <div class="relative">
                <label class="block text-sm mb-1">Choose Departure Time</label>
                <input
                  type="datetime-local"
                  v-model="form.departure_time"
                  class="w-full border rounded px-3 py-2 text-sm"
                />
              </div>

              <!-- Choose arrival time -->
              <div class="relative">
                <label class="block text-sm mb-1">Choose Arrival Time</label>
                <input
                  type="datetime-local"
                  v-model="form.arrival_time"
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
                  Save schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- =======================DATA TABLE USERS -->
    <div v-if="schedulesData" class="m-5">
      <div
        class="relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base border border-default p-5"
      >
        <table class="w-full text-sm text-left rtl:text-right text-body">
          <thead
            class="text-sm text-body bg-neutral-secondary-soft border-b rounded-base border-default"
          >
            <tr>
              <th scope="col" class="px-1 py-3 font-bold">No.</th>

              <th scope="col" class="px-1 py-3 font-bold">ID</th>
              <th scope="col" class="px-1 py-3 font-bold">Ship name</th>
              <th scope="col" class="px-1 py-3 font-bold">Departure</th>
              <th scope="col" class="px-1 py-3 font-bold">Arrival</th>
              <th scope="col" class="px-1 py-3 font-bold">Departure time</th>
              <th scope="col" class="px-1 py-3 font-bold">Arrival time</th>
              <th scope="col" class="px-1 py-3 font-bold">Pilot</th>

              <th scope="col" class="px-6 py-3 font-bold">Status</th>
              <th scope="col" class="px-6 py-3 font-bold">Created at</th>
              <th scope="col" class="px-6 py-3 font-bold">Updated at</th>

              <th scope="col" class="px-6 py-3 font-bold">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in schedulesData"
              :key="item.id"
              class="bg-neutral-primary border-b border-default hover:bg-blue-50 hover:cursor-pointer transition"
            >
              <td class="px-1 py-4 font-bold text-heading whitespace-nowrap">
                {{ schedulesData.indexOf(item) + 1 }}
              </td>

              <th
                scope="row"
                class="px-1 py-4 font-medium text-heading whitespace-nowrap"
              >
                {{ item.schedule_id }}
              </th>
              <td class="px-1 text-xs py-4">{{ item.ship_name }}</td>
              <td class="px-1 text-xs py-4">{{ item.departure_port }}</td>
              <td class="px-1 text-xs py-4">{{ item.arrival_port }}</td>
              <td class="px-1 text-xs py-4">
                {{ formatDateTime(item.departure_time) }}
              </td>
              <td class="px-1 text-xs py-4">
                {{ formatDateTime(item.arrival_time) }}
              </td>

              <td class="px-1 text-xs py-4">
                {{ item.user_id + "_" + item.pilot_name }}
              </td>

              <td class="px-6 text-xs py-4">{{ item.status }}</td>
              <td class="px-6 text-xs py-4">
                {{ formatDateTime(item.created_at) }}
              </td>
              <td class="px-6 text-xs py-4">
                {{ formatDateTime(item.updated_at) }}
              </td>

              <td class="px-6 py-4">
                <router-link
                  class="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Edit
                </router-link>
                |
                <button
                  class="text-red-600 hover:text-red-800 font-medium"
                  @click="handleDeleteschedule(item.schedule_id)"
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
import { onMounted, ref, watch } from "vue";
import formateDate from "@/helpers/format-datetime.js";
import scheduleService from "../../services/schedule-services";
import shipService from "../../services/ship-services";
import userServices from "../../services/user-services";
import portService from "../../services/port-services";
import Swal from "sweetalert2";
const formatDateTime = formateDate.formatDateTime;
const toSqlDateTime = formateDate.toSqlDateTime;
const schedulesData = ref([]);
const fetchschedules = async () => {
  try {
    const res = await scheduleService.getSchedules();
    schedulesData.value = res.data.schedules;
    console.log("Fetched schedules:", schedulesData.value);
  } catch (error) {
    console.error("Error fetching schedules:", error);
  }
};
const showModal = ref(false);
const form = ref({
  ship_id: "",
  pilot_id: "",
  departure_port_id: "",
  arrival_port_id: "",
  departure_time: "",
  arrival_time: "",
  status: "Scheduled",
});
const openModal = () => {
  showModal.value = true;
};
const closeModal = () => {
  showModal.value = false;
  form.value = {
    ship_id: "",
    pilot_id: "",
    departure_port_id: "",
    arrival_port_id: "",
    departure_time: "",
    arrival_time: "",
    status: "Scheduled",
  };
};
const submitSchedule = async () => {
  try {
    const payload = {
      ...form.value,
      departure_time: toSqlDateTime(form.value.departure_time),
      arrival_time: toSqlDateTime(form.value.arrival_time),
    };
    const res = await scheduleService.createSchedule(payload);
    console.log("schedule created successfully:", res.data);
    closeModal();
    fetchschedules(); // Refresh the list of schedules after adding a new one
    alert("schedule created successfully!", { type: "success" });
  } catch (error) {
    console.error("Error creating schedule:", error);
  }
};

const handleDeleteschedule = async (id) => {
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
      await scheduleService.deleteschedule(id);
      Swal.fire("Deleted!", "The schedule has been deleted.", "success");
      fetchschedules(); // Refresh the list of schedules after deletion
    }
  } catch (error) {
    console.error("Error deleting schedule:", error);
    Swal.fire("Error!", "There was an issue deleting the schedule.", "error");
  }
};

// Handle ship selection
const ships = ref([]);
const pageShip = ref(1);
const totalShipPages = ref(1);
const openShip = ref(false);
const selectedShip = ref(null);

const fetchShips = async () => {
  const res = await shipService.getShips({ page: pageShip.value });

  ships.value = [...ships.value, ...res.data.ships];
  totalShipPages.value = res.data.totalPages;
};

const loadMoreShips = () => {
  if (pageShip.value < totalShipPages.value) {
    pageShip.value++;
    fetchShips();
  }
};

const selectShip = (ship) => {
  selectedShip.value = ship;
  form.value.ship_id = ship.ship_id;
  openShip.value = false;
};

// Handle pilot selection
const pilots = ref([]);
const openPilot = ref(false);
const selectedPilot = ref(null);
const pageUser = ref(1);
const totalUserPages = ref(1);
const fetchPilots = async () => {
  // Fetch pilots from API and update the pilots ref
  const res = await userServices.getUsers({ page: pageUser.value });
  pilots.value = [...pilots.value, ...res.data.users];
  totalUserPages.value = res.data.totalPages;
};
const loadMorePilots = () => {
  if (pageUser.value < totalUserPages.value) {
    pageUser.value++;
    fetchPilots();
  }
};
const selectPilot = (pilot) => {
  selectedPilot.value = pilot;
  form.value.pilot_id = pilot.user_id;
  openPilot.value = false;
};

// Handle port departure selection
const ports = ref([]);
const openPort = ref(false);
const selectedPort = ref(null);
const pagePort = ref(1);
const totalPortPages = ref(1);

const fetchPorts = async () => {
  const res = await portService.getPorts({ page: pagePort.value });
  ports.value = [...ports.value, ...res.data.ports];
  totalPortPages.value = res.data.totalPages;
};

const loadMorePorts = () => {
  if (pagePort.value < totalPortPages.value) {
    pagePort.value++;
    fetchPorts();
  }
};

const selectPort = (port) => {
  selectedPort.value = port;
  form.value.departure_port_id = port.port_id;
  openPort.value = false;
};

// Handle port arrival selection
const arrivalPorts = ref([]);
const openArrivalPort = ref(false);
const selectedArrivalPort = ref(null);
const pageArrivalPort = ref(1);
const totalArrivalPortPages = ref(1);
const fetchArrivalPorts = async () => {
  const res = await portService.getPorts({ page: pageArrivalPort.value });
  arrivalPorts.value = [...arrivalPorts.value, ...res.data.ports];
  totalArrivalPortPages.value = res.data.totalPages;
};
const loadMoreArrivalPorts = () => {
  if (pageArrivalPort.value < totalArrivalPortPages.value) {
    pageArrivalPort.value++;
    fetchArrivalPorts();
  }
};
const selectArrivalPort = (port) => {
  selectedArrivalPort.value = port;
  form.value.arrival_port_id = port.port_id;
  openArrivalPort.value = false;
};

watch([selectedPort, selectedArrivalPort], ([newPort, newArrival]) => {
  if (newPort && newArrival && newPort.port_id === newArrival.port_id) {
    Swal.fire({
      icon: "error",
      title: "Lỗi",
      text: "Cảng đến không thể trùng với cảng đi!",
    });

    selectedArrivalPort.value = null;
    form.value.arrival_port_id = "";
  }
});

let timeout = null;

watch(
  () => [form.value.departure_time, form.value.arrival_time],
  ([newDeparture, newArrival]) => {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      if (newDeparture && newArrival) {
        const dep = new Date(newDeparture);
        const arr = new Date(newArrival);

        if (dep >= arr) {
          Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: "Thời gian đến phải sau thời gian đi!",
          });

          form.value.arrival_time = "";
        }
      }
    }, 300);
  },
);

// console log all form data when it changes
watch(
  () => form.value,
  (newForm) => {
    console.log("Form data changed:", newForm);
  },
  { deep: true },
);

onMounted(() => {
  fetchShips();
  fetchschedules();
  fetchPilots();
  fetchPorts();
  fetchArrivalPorts();
});
</script>
