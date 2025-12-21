<script setup lang="ts">
import { ref, computed } from 'vue';
import TopNav from './components/TopNav.vue';
import SideMenu from './components/SideMenu.vue';
import MainContentDisplay from './components/MainContentDisplay.vue';

const selectedCategory = ref<string | null>('Id_Home');
const selectedMenuItem = ref<string | null>('Monitor');
const isSideMenuExpanded = ref(true); // Track the state of the side menu

const mainContentMarginLeft = computed(() => {
  return isSideMenuExpanded.value ? '200px' : '50px';
});

const defaultMenuItems: { [key: string]: string } = {
  Id_Home: 'Monitor',
  Id_Report: 'Daily Report',
  Id_Setting: 'Theme',
};

const handleCategorySelect = (categoryId: string) => {
  selectedCategory.value = categoryId;
  // Automatically select the default menu item for the category
  if (defaultMenuItems[categoryId]) {
    selectedMenuItem.value = defaultMenuItems[categoryId];
  } else {
    selectedMenuItem.value = null;
  }
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
  padding: 0; /* Remove padding */
  margin-top: 4rem; /* Height of the top nav */
  height: calc(100vh - 4rem); /* Fill remaining height */
  transition: margin-left 0.3s ease; /* Smooth transition for margin */
}
</style>
