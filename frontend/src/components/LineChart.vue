<template>
  <Line :data="chartData" :options="chartOptions" />
</template>

<script setup>
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

// Đăng ký chart modules
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
);

// Props nhận từ component cha
defineProps({
  chartData: Object,
  chartOptions: Object,
});
</script>
