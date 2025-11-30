<script setup lang="ts">
import { ref } from 'vue';
import { liveQuery } from 'dexie';
import { db, type Task } from '../../db';
import { useObservable } from '@vueuse/rxjs';
import TaskEditModal from '../../components/TaskEditModal.vue';

import { from } from 'rxjs';

const tasks = useObservable(
  from(liveQuery(() => db.tasks.toArray())),
  { initialValue: [] as Task[] }
);

const isModalOpen = ref(false);
const selectedTask = ref<Task | null>(null);

const addTask = async () => {
  try {
    const id = await db.tasks.add({
      title: 'New Task',
      status: 'todo',
      priority: 'Medium',
      deadline: null,
      created_at: new Date()
    });
    // Optional: Open modal immediately after creating
    // const newTask = await db.tasks.get(id);
    // if (newTask) openModal(newTask);
  } catch (error) {
    console.error('Failed to add task:', error);
  }
};

const openModal = (task: Task) => {
  selectedTask.value = task;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedTask.value = null;
};

const saveTask = async (updatedTask: Task) => {
  try {
    await db.tasks.put(updatedTask);
    closeModal();
  } catch (error) {
    console.error('Failed to update task:', error);
  }
};

const deleteTask = async (id: number) => {
  try {
    await db.tasks.delete(id);
    closeModal();
  } catch (error) {
    console.error('Failed to delete task:', error);
  }
};
</script>

<template>
  <div class="container">
    <div class="top-row">
      <div class="column col-todo">
        <div class="header">
          <h2>TO DO <span class="count">{{ tasks?.filter(t => t.status === 'todo').length }}</span></h2>
          <button @click="addTask" class="add-button">+</button>
        </div>
        <div class="task-list">
          <div 
            v-for="task in tasks?.filter((t: Task) => t.status === 'todo')" 
            :key="task.id" 
            class="task-item"
            @click="openModal(task)"
          >
            <div class="task-content">
              <span class="task-title">{{ task.title }}</span>
            </div>
            <div class="task-footer">
              <span class="task-key">TASK-{{ task.id }}</span>
              <span class="task-priority">{{ task.priority }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="column col-inprogress">
        <div class="header">
          <h2>IN PROGRESS <span class="count">{{ tasks?.filter(t => t.status === 'inprogress').length }}</span></h2>
        </div>
        <div class="task-list">
          <div 
            v-for="task in tasks?.filter((t: Task) => t.status === 'inprogress')" 
            :key="task.id" 
            class="task-item"
            @click="openModal(task)"
          >
            <div class="task-content">
              <span class="task-title">{{ task.title }}</span>
            </div>
            <div class="task-footer">
              <span class="task-key">TASK-{{ task.id }}</span>
              <span class="task-priority">{{ task.priority }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="column col-done">
        <div class="header">
          <h2>DONE <span class="count">{{ tasks?.filter(t => t.status === 'done').length }}</span></h2>
        </div>
        <div class="task-list">
          <div 
            v-for="task in tasks?.filter((t: Task) => t.status === 'done')" 
            :key="task.id" 
            class="task-item"
            @click="openModal(task)"
          >
            <div class="task-content">
              <span class="task-title">{{ task.title }}</span>
            </div>
            <div class="task-footer">
              <span class="task-key">TASK-{{ task.id }}</span>
              <span class="task-priority">{{ task.priority }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom-row">
      <h2>Gantt Chart</h2>
    </div>

    <TaskEditModal
      :isOpen="isModalOpen"
      :task="selectedTask"
      @close="closeModal"
      @save="saveTask"
      @delete="deleteTask"
    />
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background-color: white;
  padding: 1rem;
  box-sizing: border-box;
}

.top-row {
  display: flex;
  flex: 3; /* Ratio 3 */
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 1rem;
}

.column {
  flex: 1;
  min-width: 280px;
  background-color: #F4F5F7;
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  max-height: 100%;
}

.bottom-row {
  flex: 1; /* Ratio 1 */
  border: 1px solid #eee;
  box-sizing: border-box;
  padding: 1rem;
  margin-top: 1rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1rem 0.5rem 1rem;
}

h2 {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 600;
  color: #5E6C84;
  text-transform: uppercase;
  display: flex;
  align-items: center;
}

.count {
  margin-left: 0.5rem;
  background-color: #DFE1E6;
  color: #172B4D;
  border-radius: 2em;
  padding: 0.1em 0.5em;
  font-size: 0.75rem;
}

.add-button {
  background: none;
  border: none;
  color: #42526E;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0 0.5rem;
  border-radius: 3px;
}

.add-button:hover {
  background-color: rgba(9, 30, 66, 0.08);
}

.task-list {
  flex: 1;
  overflow-y: auto;
  padding: 0 0.5rem 0.5rem 0.5rem;
}

.task-item {
  background-color: white;
  border-radius: 3px;
  box-shadow: 0 1px 2px rgba(9, 30, 66, 0.25);
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: background-color 0.1s;
}

.task-item:hover {
  background-color: #EBECF0;
}

.task-content {
  margin-bottom: 0.5rem;
}

.task-title {
  color: #172B4D;
  font-size: 0.9rem;
  line-height: 1.4;
}

.task-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: #5E6C84;
}

.task-key {
  font-weight: 500;
}

.task-priority {
  font-weight: 600;
}
</style>