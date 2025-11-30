<script setup lang="ts">
import { computed } from 'vue';
import HomeView from '../views/HomeView.vue';
import DailyIndex from '../views/daily/index.vue';
import DailyWeek from '../views/daily/Week.vue';
import DailyMonth from '../views/daily/Month.vue';
import SettingsTheme from '../views/Settings/Theme.vue';
import SettingsLanguage from '../views/Settings/Language.vue';

const props = defineProps<{
  selectedMenuItem: string | null;
}>();

const currentView = computed(() => {
  switch (props.selectedMenuItem) {
    case 'How to Use':
      return HomeView;
    case 'Daily Report':
      return DailyIndex;
    case 'Week Report':
      return DailyWeek;
    case 'Month Report':
      return DailyMonth;
    case 'Theme':
      return SettingsTheme;
    case 'Language':
      return SettingsLanguage;
    default:
      return null;
  }
});
</script>

<template>
  <div class="main-content-display">
    <component :is="currentView" v-if="currentView" />
    <div v-else>
      <h1>Select a menu item</h1>
    </div>
  </div>
</template>

<style scoped>
.main-content-display {
  padding: 0;
  /* text-align: center; Remove center alignment to let components handle their own layout */
  height: 100%; /* Ensure it takes full height */
}
</style>

