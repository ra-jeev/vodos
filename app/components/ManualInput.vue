<template>
  <form class="flex flex-wrap w-full gap-4" @submit.prevent="handleSubmit">
    <UInput
      v-model="newTodo"
      placeholder="Add a new todo..."
      autofocus
      class="flex-1"
    />

    <div class="flex w-full md:w-auto gap-x-4">
      <UInput v-model="todoDueDate" type="date" class="flex-1" />

      <UButton
        type="submit"
        icon="i-heroicons-plus-16-solid"
        :disabled="!newTodo"
        :loading="loading"
        aria-label="Add ToDo"
      >
        Add
      </UButton>
    </div>
  </form>
</template>

<script setup lang="ts">
const emit = defineEmits(['add-todo']);

const newTodo = ref('');
const todoDueDate = ref('');
const loading = ref(false);

const handleSubmit = () => {
  if (!newTodo.value.trim()) return;

  emit('add-todo', {
    text: newTodo.value,
    todoAt: todoDueDate.value,
  });

  newTodo.value = '';
  todoDueDate.value = '';
};
</script>
