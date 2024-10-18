<template>
  <ULink class="flex items-center gap-x-3" to="/">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      class="text-primary"
      :class="iconSize"
    >
      <g
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
      >
        <rect width="6" height="6" x="3" y="5" rx="1" />
        <path d="m3 17l2 2l4-4m4-9h8m-8 6h8m-8 6h8" />
      </g>
    </svg>
    <span class="font-bold" :class="textSize">VoDos</span>
  </ULink>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    iconSize?: string;
    textSize?: string;
  }>(),
  {
    iconSize: 'w-8 h-8',
    textSize: 'text-xl md:text-2xl',
  }
);
</script>
