<template>
  <div class="p-6 space-y-6">
    <!-- 🔥 FILTER -->
    <div class="flex gap-4">
      <input v-model="month" type="number" min="1" max="12" class="input" />
      <input v-model="year" type="number" class="input" />
      <button @click="fetchStats" class="btn">Thống kê</button>
    </div>

    <!-- 📊 KPI CARDS -->
    <div class="grid grid-cols-3 gap-4">
      <div class="card">
        <p class="text-gray-500">Total Trips</p>
        <h2 class="text-2xl font-bold">{{ totalTrips }}</h2>
      </div>

      <div class="card">
        <p class="text-gray-500">Active Pilots</p>
        <h2 class="text-2xl font-bold">{{ stats.length }}</h2>
      </div>

      <div class="card">
        <p class="text-gray-500">Top Pilot</p>
        <h2 class="text-xl font-bold">
          {{ stats[0]?.pilot_name || "-" }}
        </h2>
      </div>
    </div>

    <!-- 📈 CHART -->
    <div class="card">
      <Bar v-if="chartData" :data="chartData" :options="chartOptions" />
    </div>

    <!-- 🔍 SEARCH -->
    <input v-model="search" placeholder="Tìm pilot..." class="input w-full" />

    <!-- 📋 TABLE -->
    <div class="card">
      <table class="w-full border">
        <thead>
          <tr class="bg-gray-100">
            <th class="p-2 border">#</th>
            <th class="p-2 border">Pilot</th>
            <th class="p-2 border">Trips</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in paginatedStats"
            :key="item.pilot_id"
            :class="{ 'bg-yellow-100': index === 0 }"
          >
            <td class="p-2 border text-center">
              {{ (currentPage - 1) * pageSize + index + 1 }}
            </td>
            <td class="p-2 border">{{ item.pilot_name }}</td>
            <td class="p-2 border text-center">
              {{ item.total_trips }}
            </td>
          </tr>
        </tbody>
      </table>

      <!-- PAGINATION -->
      <div class="flex justify-end mt-4 gap-2">
        <button @click="currentPage--" :disabled="currentPage === 1">
          Prev
        </button>
        <span>Page {{ currentPage }}</span>
        <button @click="currentPage++" :disabled="currentPage >= totalPages">
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import ScheduleService from "@/services/schedule-services.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// state
const month = ref(new Date().getMonth() + 1);
const year = ref(new Date().getFullYear());
const stats = ref([]);
const search = ref("");
const currentPage = ref(1);
const pageSize = 10;
const chartData = ref(null);

// computed
const totalTrips = computed(() =>
  stats.value.reduce((sum, i) => sum + i.total_trips, 0),
);

const filteredStats = computed(() =>
  stats.value.filter((i) =>
    i.pilot_name.toLowerCase().includes(search.value.toLowerCase()),
  ),
);

const totalPages = computed(() =>
  Math.ceil(filteredStats.value.length / pageSize),
);

const paginatedStats = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredStats.value.slice(start, start + pageSize);
});

// chart options (bar ngang)
const chartOptions = {
  indexAxis: "y",
  responsive: true,
  plugins: {
    legend: { display: false },
  },
};

// fetch API
const fetchStats = async () => {
  try {
    const res = await ScheduleService.getPilotMonthlyStats({
      month: month.value,
      year: year.value,
    });
    console.log("month:", month.value);
    console.log("year:", year.value);
    if (!res.data.status) {
      alert(res.data.message);
      return;
    }

    stats.value = res.data.data;

    // 🔥 TOP 10 + Others
    const top = stats.value.slice(0, 10);
    const others = stats.value.slice(10);

    const othersTotal = others.reduce((sum, i) => sum + i.total_trips, 0);

    const finalData =
      others.length > 0
        ? [...top, { pilot_name: "Others", total_trips: othersTotal }]
        : top;

    chartData.value = {
      labels: finalData.map((i) => i.pilot_name),
      datasets: [
        {
          data: finalData.map((i) => i.total_trips),
        },
      ],
    };
  } catch (error) {
    console.error(error);
  }
};
</script>

<style scoped>
.input {
  border: 1cm;
  padding: 2px;
  border-radius: 14px;
}
.btn {
  background: blue;
  color: white;
  padding: 2px;

  border-radius: 14px;
}
.card {
  background: white;
  padding: 4;
  box-shadow: inset;
}
</style>
