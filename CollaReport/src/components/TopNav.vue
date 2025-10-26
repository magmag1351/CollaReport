<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits(['select-category']);

const categories = ref([
  { name: 'Home', id: 'Id_Home' },
  { name: 'Report', id: 'Id_Report' },
  { name: 'Setting', id: 'Id_Setting' },
]);

const selectCategory = (categoryId: string) => {
  emit('select-category', categoryId);
};
</script>

<template>
  <nav class="top-nav">
    <button
      v-for="category in categories"
      :key="category.id"
      @click="selectCategory(category.id)"
      class="top-nav-item"
    >
      {{ category.name }}
    </button>
  </nav>
</template>

<style scoped>
.top-nav {
  display: left;
  justify-content: space-around;
  padding: 1rem;
  background-color: #333;
  color: rgb(255, 255, 255);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
}

.top-nav-item {
  background: none;
  border: none;
  color: rgb(255, 255, 255);
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 1rem;
}

.top-nav-item:hover {
  background-color: #555;
}
</style>
