<script setup lang="ts">
import { ref, watch, toRaw } from 'vue';
import type { Task } from '../db';

const props = defineProps<{
  isOpen: boolean;
  task: Task | null;
}>();

const emit = defineEmits(['close', 'save', 'delete']);

const editedTask = ref<Partial<Task>>({});

watch(() => props.task, (newTask) => {
  if (newTask) {
    editedTask.value = { ...newTask };
  }
});

const save = () => {
  if (editedTask.value.id !== undefined) {
    emit('save', toRaw(editedTask.value));
  }
};

const remove = () => {
  if (editedTask.value.id !== undefined && confirm('Are you sure you want to delete this task?')) {
    emit('delete', editedTask.value.id);
  }
};
</script>

<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Edit Task</h2>
        <button @click="emit('close')" class="close-button">×</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label>Title</label>
          <input v-model="editedTask.title" type="text" class="form-control" />
        </div>
        <div class="form-group">
          <label>Status</label>
          <select v-model="editedTask.status" class="form-control">
            <option value="todo">To Do</option>
            <option value="inprogress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div class="form-group">
          <label>Priority</label>
          <select v-model="editedTask.priority" class="form-control">
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
        <div class="form-group">
          <label>Startline</label>
          <input v-model="editedTask.startline" type="date" class="form-control" />
        </div>
        <div class="form-group">
          <label>Deadline</label>
          <input v-model="editedTask.deadline" type="date" class="form-control" />
        </div>
      </div>
      <div class="modal-footer">
        <button @click="remove" class="delete-button">Delete</button>
        <div class="right-actions">
          <button @click="emit('close')" class="cancel-button">Cancel</button>
          <button @click="save" class="save-button">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal-content {
  background-color: white;
  padding: 1.5rem;
  border-radius: 4px;
  width: 500px;
  max-width: 90%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: #172B4D;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #5E6C84;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #5E6C84;
  font-size: 0.85rem;
}

.form-control {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #DFE1E6;
  border-radius: 3px;
  font-size: 0.9rem;
  color: #172B4D;
}

.form-control:focus {
  border-color: #4C9AFF;
  outline: none;
}

.modal-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
}

.right-actions {
  display: flex;
  gap: 0.5rem;
}

.save-button {
  background-color: #0052CC;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 3px;
  cursor: pointer;
  font-weight: 500;
}

.save-button:hover {
  background-color: #0065FF;
}

.cancel-button {
  background: none;
  border: none;
  color: #42526E;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.cancel-button:hover {
  background-color: rgba(9, 30, 66, 0.08);
  border-radius: 3px;
}

.delete-button {
  background: none;
  border: none;
  color: #DE350B;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.delete-button:hover {
  background-color: #FFEBE6;
  border-radius: 3px;
}
</style>
