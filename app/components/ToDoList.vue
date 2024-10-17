<template>
  <ul class="divide-y divide-gray-200 dark:divide-gray-800">
    <li
      v-for="todo in todos"
      :key="todo.id"
      class="flex items-center justify-between py-2 group"
    >
      <UCheckbox
        :model-value="todo.completed"
        @update:model-value="$emit('update-todo', todo)"
      >
        <template #label>
          <div>
            <p
              :class="{
                'line-through text-gray-500 dark:text-gray-400': todo.completed,
              }"
            >
              {{ todo.text }}
            </p>
            <p v-if="todo.todoAt" class="text-xs text-gray-500">
              Due: {{ todo.todoAt }}
            </p>
          </div>
        </template>
      </UCheckbox>

      <div
        class="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <UButton
          color="gray"
          variant="ghost"
          icon="i-heroicons-pencil-square"
          size="xs"
          @click="$emit('update-todo', todo)"
        />
        <UButton
          color="red"
          variant="ghost"
          icon="i-heroicons-trash"
          size="xs"
          @click="$emit('delete-todo', todo)"
        />
      </div>
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { ToDo } from '~~/types';

defineProps<{ todos: ToDo[] }>();

defineEmits<{
  (e: 'update-todo' | 'delete-todo', todo: ToDo): void;
}>();
</script>
