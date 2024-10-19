<template>
  <UCard
    :ui="{
      rounded: 'rounded-lg',
      shadow: 'shadow-lg',
      body: {
        base: ' relative',
        padding: 'pt-8 sm:pt-8',
      },
    }"
  >
    <div
      :class="[
        'inline-flex items-center h-8 gap-x-3 rounded-full absolute left-1/2 -top-4 -translate-x-1/2 border px-2.5 cursor-pointer bg-white dark:bg-gray-900',
        isVoiceMode ? 'border-primary' : 'border-gray-500',
      ]"
      @click="isVoiceMode = !isVoiceMode"
    >
      <UToggle :model-value="isVoiceMode" />
      <span
        class="text-xs shrink-0"
        :class="isVoiceMode ? 'text-primary' : 'text-gray-500'"
      >
        {{ isVoiceMode ? 'Voice Mode' : 'Manual Mode' }}
      </span>
    </div>

    <VoiceInput v-if="isVoiceMode" />

    <ManualInput v-else />
  </UCard>
</template>

<script setup lang="ts">
const isVoiceMode = ref(false);
</script>
