<script setup lang="ts">
import { computed, ref } from 'vue';

const emit = defineEmits(['select-menu-item', 'update:menu-expanded']);
const isMenuExpanded = ref(true); // State to control menu expansion
const toggleMenu = () => {
  isMenuExpanded.value = !isMenuExpanded.value;
  emit('update:menu-expanded', isMenuExpanded.value);
};

const props = defineProps<{
  selectedCategory: string | null;
}>();

interface MenuItems {
  [key: string]: string[];
}

const menuItems: MenuItems = {
  Id_Home: ['How to Use'],
  Id_Report: ['Daily Report', 'Week Report', 'Month Report'],
  Id_Setting: ['Theme', 'Language'],
};

const displayedMenuItems = computed(() => {
  if (props.selectedCategory && menuItems[props.selectedCategory]) {
    return menuItems[props.selectedCategory];
  }
  return ['Please select a category'];
});

const selectMenuItem = (item: string) => {
  emit('select-menu-item', item);
};
</script>

<template>
  <div :class="['side-menu', { 'collapsed': !isMenuExpanded }]">
    <div class="menu-header">
      <button @click="toggleMenu" class="hamburger-button">
        ☰
      </button>
      <h1 v-if="isMenuExpanded">Menu</h1>
    </div>
    <ul v-if="isMenuExpanded">
      <li v-for="(item, index) in displayedMenuItems" :key="index" @click="selectMenuItem(item)">
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.side-menu {
  position: fixed;
  top: 4rem; /* Height of the top nav */
  left: 0;
  width: 200px; /* Default expanded width */
  height: calc(100% - 4rem); /* Adjust height based on top nav */
  background-color: #282828; /* Darker background for better contrast */
  padding: 1rem;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2);
  z-index: 999;
  color: white; /* Ensure text is visible */
  transition: width 0.3s ease; /* Smooth transition for width */
}

.side-menu.collapsed {
  width: 50px; /* Collapsed width */
  padding: 1rem 0.5rem; /* Adjust padding for collapsed state */
}

.menu-header {
  display: flex;
  justify-content: start;
  align-items: center;
  margin-bottom: 1rem;
}

.hamburger-button {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
}

.side-menu h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: white;
}

.side-menu ul {
  list-style: none;
  padding: 0;
}

.side-menu li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #444; /* Lighter border for contrast */
  cursor: pointer; /* Indicate clickable items */
}

.side-menu li:hover {
  background-color: #555; /* Hover effect */
}

.side-menu li:last-child {
  border-bottom: none;
}
</style>
