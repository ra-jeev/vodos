<template>
  <div class="flex flex-col items-center gap-8">
    <audio v-if="state.audio" :src="state.audio" controls />

    <div>
      <UButton
        :icon="btnAttribs.icon"
        :class="btnAttribs.class"
        :aria-label="btnAttribs.label"
        color="gray"
        size="xl"
        @click="btnAttribs.action"
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

const btnAttribs = computed(() => {
  if (isRecording.value) {
    return {
      icon: 'i-heroicons-stop-16-solid',
      label: 'Stop Recording',
      class:
        'text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-500 rounded-full',
      action: stopRecording,
    };
  } else {
    return {
      icon: 'i-heroicons-microphone-16-solid',
      label: 'Start Recording',
      class: 'rounded-full',
      action: startRecording,
    };
  }
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
    state.mediaRecorder.stream.getTracks().forEach((track) => track.stop());
    isRecording.value = false;

    const blob = new Blob(state.audioChunks);

    sendAudio(blob);

    state.audio = URL.createObjectURL(blob);
  }
};

const sendAudio = async (blob: Blob) => {
  const formData = new FormData();
  formData.append('audioData', blob, 'recorded_audio.webm');
  try {
    const res = await $fetch('/api/transcribe', {
      method: 'POST',
      body: formData,
    });

    console.log('res', res);
  } catch (error) {
    console.error('Error sending audio to server:', error);
  }
};
</script>
