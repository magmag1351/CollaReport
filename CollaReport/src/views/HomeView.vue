<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { liveQuery } from 'dexie';
import { db, type Task } from '../db';
import { useObservable } from '@vueuse/rxjs';
import { from } from 'rxjs';

// Clock & Date Logic
const currentTime = ref(new Date());
let timer: number;

const updateTime = () => {
  currentTime.value = new Date();
};

onMounted(() => {
  timer = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  clearInterval(timer);
});

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('ja-JP', { hour12: false });
};

const formatDate = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' };
  return date.toLocaleDateString('ja-JP', options);
};

// Task Logic
const tasks = useObservable(
  from(liveQuery(() => db.tasks.toArray())),
  { initialValue: [] as Task[] }
);

const filteredTasks = ref<Task[]>([]);

// Watch tasks and current time to filter
// Since tasks is an observable, we can use a computed or just filter in the template if list is small.
// However, for "startline <= now <= deadline", we need reactivity on 'now' as well if we want it to be super precise,
// but usually day-level or minute-level check is fine.
// Let's use a computed property that depends on tasks and a 'now' trigger if needed,
// but for simplicity, let's just filter based on the reactive tasks list and assume startline/deadline are dates.
// Note: db.ts says startline/deadline can be null. The requirement says "display if current date is within start and end".
// If null, we might assume it's always active or never active? Usually if null, maybe it means "no deadline" or "not started".
// Let's assume if startline is null -> starts from beginning? If deadline null -> no end?
// Or strictly: startline != null && deadline != null && startline <= now <= deadline.
// Let's try to be inclusive.

import { computed } from 'vue';

const activeTasks = computed(() => {
  if (!tasks.value) return [];
  const now = currentTime.value;
  return tasks.value.filter(t => {
    // If startline is null, assume it started. If deadline is null, assume it never ends.
    // Or strictly follow "within start and end".
    // Let's go with: if startline exists, must be after it. If deadline exists, must be before it.
    const isStarted = t.startline ? new Date(t.startline) <= now : true;
    const isNotEnded = t.deadline ? new Date(t.deadline) >= now : true;
    return isStarted && isNotEnded && t.status !== 'done'; // Also maybe filter out 'done'? The screenshot shows "Task 1", "Task 2".
    // Requirement: "Homeに表示するタスクは開始から終了期限の間に現在の日付が収まっている場合のもののみを表示せい"
    // Doesn't explicitly say exclude 'done', but usually Home shows active tasks. Let's include all statuses for now if they match date.
  });
});

// Timeline Logic
// We need to render hours 0-24.
const hours = Array.from({ length: 25 }, (_, i) => i);

const getCurrentTimePosition = () => {
  const now = currentTime.value;
  const totalMinutes = now.getHours() * 60 + now.getMinutes();
  const percentage = (totalMinutes / (24 * 60)) * 100;
  return `${percentage}%`;
};

</script>

<template>
  <div class="home-container">
    <div class="left-panel">
      <!-- Clock Section -->
      <div class="clock-section">
        <div class="time-display">{{ formatTime(currentTime) }}</div>
        <div class="date-display">{{ formatDate(currentTime) }}</div>
      </div>

      <!-- Task List Section -->
      <div class="task-section">
        <div v-if="activeTasks.length === 0" class="no-tasks">
          No active tasks for today.
        </div>
        <div v-else class="task-list">
          <div v-for="task in activeTasks" :key="task.id" class="task-card">
            <span class="task-title">{{ task.title }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="right-panel">
      <!-- Timeline Section -->
      <div class="timeline-container">
        <div class="current-date-badge">
            <span class="day-label">日</span>
            <span class="date-number">{{ currentTime.getDate() }}</span>
        </div>
        
        <div class="timeline-scroll">
            <div v-for="h in hours" :key="h" class="hour-marker" :style="{ top: (h / 24 * 100) + '%' }">
            <span class="hour-label" v-if="h < 24">
                {{ h < 12 ? '午前' : '午後' }}{{ h % 12 === 0 ? 12 : h % 12 }}時
            </span>
            <div class="hour-line"></div>
            </div>
            
            <!-- Current Time Indicator -->
            <div class="current-time-line" :style="{ top: getCurrentTimePosition() }">
            <div class="red-dot"></div>
            <div class="red-line"></div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

.home-container {
  display: flex;
  height: 100%;
  width: 100%;
  background-color: white;
  overflow: hidden;
}

.left-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  justify-content: center;
  align-items: center;
}

.clock-section {
  text-align: center;
  margin-bottom: 3rem;
}

.time-display {
  font-family: 'Share Tech Mono', monospace;
  font-size: 8rem;
  font-weight: bold;
  line-height: 1;
  color: #172B4D;
}

.date-display {
  font-size: 1.5rem;
  color: #5E6C84;
  margin-top: 0.5rem;
}

.task-section {
  width: 100%;
  max-width: 600px;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border: 2px solid #172B4D;
  padding: 1rem;
  border-radius: 10px;
  background-color: #f4f5f7;
}

.task-card {
  background-color: white;
  border: 2px solid #172B4D;
  border-radius: 5px;
  padding: 1rem;
  font-size: 1.5rem;
  color: #172B4D;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.no-tasks {
  text-align: center;
  color: #5E6C84;
  font-size: 1.2rem;
}

.right-panel {
  flex: 1;
  background-color: #121212; /* Dark theme for timeline */
  color: white;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.timeline-container {
  position: relative;
  height: 100%;
  width: 100%;
  padding: 1rem 0;
}

.current-date-badge {
    position: absolute;
    top: 1rem;
    right: 2rem;
    background-color: #aab8c2;
    color: #121212;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 10;
    font-weight: bold;
}

.day-label {
    font-size: 0.8rem;
}

.date-number {
    font-size: 1.5rem;
}

.timeline-scroll {
    position: relative;
    height: 100%;
    width: 100%;
}

.hour-marker {
  position: absolute;
  width: 100%;
  display: flex;
  align-items: center;
  height: 1px;
}

.hour-label {
  width: 80px;
  text-align: right;
  padding-right: 10px;
  font-size: 0.8rem;
  color: #aab8c2;
}

.hour-line {
  flex: 1;
  height: 1px;
  background-color: #333;
}

.current-time-line {
  position: absolute;
  width: 100%;
  display: flex;
  align-items: center;
  z-index: 5;
  transform: translateY(-50%); /* Center on the exact time */
}

.red-dot {
  width: 10px;
  height: 10px;
  background-color: #ff5252;
  border-radius: 50%;
  margin-left: 75px; /* Align with line start roughly */
}

.red-line {
  flex: 1;
  height: 2px;
  background-color: #ff5252;
}
</style>