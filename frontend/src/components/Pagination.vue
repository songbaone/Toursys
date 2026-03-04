<template>
  <div class="pagination">
    <paginate
      :page-count="pageCount"
      :click-handler="onPageChange"
      :prev-text="'Trước'"
      :next-text="'Sau'"
      :container-class="'pagination'"
      :page-class="'page-item'"
      :page-link-class="'page-link'"
      :prev-link-class="'page-link'"
      :next-link-class="'page-link'"
    />
  </div>
</template>

<script setup>
import Paginate from "vuejs-paginate-next"; // Import paginate

// Props từ component cha
const props = defineProps({
  pageCount: {
    type: Number,
    required: true,
  },
  currentPage: {
    type: Number,
    required: true,
  },
});

// Sự kiện phát ra khi thay đổi trang
const emit = defineEmits(["page-change"]);

// Hàm xử lý khi người dùng chọn trang mới
const onPageChange = (page) => {
  emit("page-change", page); // Phát ra sự kiện và gửi trang mới về component cha
};
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  z-index: 1;
}

/* 👇 dùng deep để xuyên scoped */
:deep(.page-item) {
  margin: 0 5px;
}

:deep(.page-link) {
  padding: 8px 12px;
  border: 1px solid #007bff;
  background-color: #e0f7fa;
  color: #007bff;
  font-weight: 500;
  cursor: pointer;
  border-radius: 4px;
  transition:
    background-color 0.3s,
    color 0.3s;
}

:deep(.page-link:hover) {
  background-color: #007bff;
  color: white;
}

:deep(.page-item.active .page-link) {
  background-color: #007bff;
  color: white;
  font-weight: bold;
  border-color: #007bff;
}

:deep(.page-link:focus) {
  outline: none;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.5);
}
</style>
