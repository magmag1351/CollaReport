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
  Id_Home: ['Monitor'],
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
  background-color: #FAFBFC; /* JIRA Light Sidebar or #0747A6 for dark. Let's go with light for modern look, or dark if user prefers. User image shows light content, but let's stick to dark sidebar for contrast as planned. */
  background-color: #0747A6; /* Deep Blue */
  padding: 1rem 0;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  z-index: 999;
  color: #DEEBFF;
  transition: width 0.3s ease; /* Smooth transition for width */
}

.side-menu.collapsed {
  width: 50px; /* Collapsed width */
  padding: 1rem 0;
}

.menu-header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0 1rem;
  margin-bottom: 1rem;
  height: 2rem;
}

.hamburger-button {
  background: none;
  border: none;
  color: #DEEBFF;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0;
  margin-right: 1rem;
}

.side-menu h1 {
  margin: 0;
  font-size: 1rem;
  color: white;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
}

.side-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.side-menu li {
  padding: 0.75rem 1.5rem;
  border-bottom: none;
  cursor: pointer;
  font-size: 0.9rem;
  color: #DEEBFF;
  transition: background-color 0.2s, color 0.2s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.side-menu li:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}
</style>
