<template>
  <div class="p-6 space-y-6">
    <!-- 🔥 FILTER -->
    <div class="flex gap-4">
      <input
        v-model="month"
        type="number"
        min="1"
        max="12"
        class="rounded-2xl"
      />
      <input v-model="year" type="number" class="rounded-2xl" />
      <button
        @click="fetchStats"
        class="bg-blue-600 text-white pl-5 pr-5 rounded-2xl cursor-pointer hover:bg-blue-400"
      >
        Lọc
      </button>
    </div>

    <!-- 📊 KPI CARDS -->
    <div class="grid grid-cols-3 gap-4">
      <div class="p-4 bg-white rounded">
        <p class="text-gray-500">Total Trips</p>
        <h2 class="text-2xl font-bold">{{ totalTrips }}</h2>
      </div>

      <div class="p-4 bg-white rounded">
        <p class="text-gray-500">Active Pilots</p>
        <h2 class="text-2xl font-bold">{{ stats.length }}</h2>
      </div>

      <div class="p-4 bg-white rounded">
        <p class="text-gray-500">Top Pilot</p>
        <h2 class="text-xl font-bold">
          {{ stats[0]?.pilot_name || "-" }}
        </h2>
      </div>
    </div>

    <!-- 📈 CHART -->
    <div class="p-4 bg-white rounded">
      <Bar v-if="chartData" :data="chartData" :options="chartOptions" />
    </div>

    <!-- 🔍 SEARCH -->
    <input
      v-model="search"
      placeholder="Tìm pilot..."
      class="input w-full p-2 rounded-2xl border"
    />

    <!-- 📋 TABLE -->

    <div
      class="relative shrink-0 bg-neutral-primary-soft shadow-xs rounded-base border border-default overflow-x-auto"
    >
      <table class="w-full">
        <thead
          class="w-full whitespace-nowrap text-xs text-left rtl:text-right text-body"
        >
          <tr>
            <th scope="col" class="px-6 py-3 font-bold border">No.</th>
            <th scope="col" class="px-6 py-3 font-bold border">Pilot</th>
            <th scope="col" class="px-6 py-3 font-bold border">Trips</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in paginatedStats"
            :key="item.pilot_id"
            :class="{
              'bg-yellow-100 border-b border-default hover:bg-blue-50 hover:cursor-pointer transition':
                index === 0,
            }"
          >
            <th
              scope="row"
              class="px-6 py-4 font-bold text-heading whitespace-nowrap border"
            >
              {{ (currentPage - 1) * pageSize + index + 1 }}
            </th>
            <td class="px-6 py-4 border">{{ item.pilot_name }}</td>
            <td class="px-6 py-4 border">
              {{ item.total_trips }}
            </td>
          </tr>
        </tbody>
      </table>
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
  scales: {
    x: {
      beginAtZero: true,
      ticks: {
        precision: 0,
      },
    },
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
