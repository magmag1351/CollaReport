<script setup lang="ts">
import { ref, computed } from 'vue';
import TopNav from './components/TopNav.vue';
import SideMenu from './components/SideMenu.vue';
import MainContentDisplay from './components/MainContentDisplay.vue';

const selectedCategory = ref<string | null>(null);
const selectedMenuItem = ref<string | null>(null);
const isSideMenuExpanded = ref(true); // Track the state of the side menu

const mainContentMarginLeft = computed(() => {
  return isSideMenuExpanded.value ? '200px' : '50px';
});

const handleCategorySelect = (categoryId: string) => {
  selectedCategory.value = categoryId;
  selectedMenuItem.value = null; // Reset selected menu item when category changes
};

const handleMenuItemSelect = (item: string) => {
  selectedMenuItem.value = item;
};
</script>

<template>
  <TopNav @select-category="handleCategorySelect" />
  <SideMenu
    :selectedCategory="selectedCategory"
    @select-menu-item="handleMenuItemSelect"
    @update:menu-expanded="isSideMenuExpanded = $event"
  />

  <div class="main-content" :style="{ marginLeft: mainContentMarginLeft }">
    <MainContentDisplay :selectedMenuItem="selectedMenuItem" />
  </div>
</template>

<style scoped>
.main-content {
  padding: 1rem;
  margin-top: 4rem; /* Height of the top nav */
  transition: margin-left 0.3s ease; /* Smooth transition for margin */
}
</style>
