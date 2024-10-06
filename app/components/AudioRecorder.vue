<template>
  <div class="flex flex-col items-center gap-8">
    <audio
      v-if="state.audio"
      :src="state.audio"
      type="audio/ogg; codecs=opus"
      controls
    />

    <div>
      <UButton
        v-if="!isRecording"
        icon="i-heroicons-microphone-solid"
        color="gray"
        class="rounded-full"
        size="xl"
        aria-label="Microphone"
        @click="startRecording"
      />

      <UButton
        v-else
        icon="i-heroicons-stop-solid"
        color="gray"
        class="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-500 rounded-full"
        size="xl"
        aria-label="Stop Recording"
        @click="stopRecording"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const isRecording = ref(false);

const state = reactive<{
  mediaRecorder: MediaRecorder | null;
  audioChunks: Blob[];
  audio: string | null;
}>({
  mediaRecorder: null,
  audioChunks: [],
  audio: null,
});

const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    state.mediaRecorder = new MediaRecorder(stream);
    isRecording.value = true;
    state.audioChunks = [];

    state.mediaRecorder.addEventListener(
      'dataavailable',
      (event: BlobEvent) => {
        if (event.data.size > 0) {
          state.audioChunks.push(event.data);
        }
      }
    );

    state.mediaRecorder.start(1000); // Collect data every second
  } catch (error) {
    console.error('Error accessing microphone:', error);
  }
};

const stopRecording = (): void => {
  if (state.mediaRecorder) {
    state.mediaRecorder.stop();
    isRecording.value = false;

    state.audio = URL.createObjectURL(
      new Blob(state.audioChunks, {
        type: 'audio/ogg; codecs=opus',
      })
    );
  }
};
</script>
