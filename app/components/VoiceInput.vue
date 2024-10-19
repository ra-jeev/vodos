<template>
  <div class="flex w-full items-center justify-between gap-x-4">
    <div>
      <UProgress v-if="isProcessing" animation="carousel" class="mb-2" />
      <p class="text-sm text-gray-500 dark:text-gray-400">
        {{ statusMessage || 'What do you want to do today?' }}
      </p>
    </div>

    <UButton
      :class="[
        'h-14 w-14 sm:h-16 sm:w-16 rounded-full transition-all duration-300 justify-center',
        isRecording &&
          'bg-red-500 hover:bg-red-600 dark:bg-red-400 dark:hover:bg-red-500',
      ]"
      :icon="
        isRecording
          ? 'i-heroicons-stop-16-solid'
          : 'i-heroicons-microphone-16-solid'
      "
      :ui="{ icon: { base: '!w-7 !h-7 sm:!w-8 sm:!h-8' } }"
      @click="toggleRecording"
    />
  </div>
</template>

<script setup lang="ts">
const isRecording = ref(false);
const isProcessing = ref(false);
const statusMessage = ref('');

const mediaRecorder = ref<MediaRecorder>();
const audioChunks = ref<Blob[]>([]);

const toggleRecording = () => {
  if (isRecording.value) {
    stopRecording();
  } else {
    startRecording();
  }
};

const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.value = new MediaRecorder(stream);
    statusMessage.value = 'Listening...';
    isRecording.value = true;
    audioChunks.value = [];

    mediaRecorder.value.addEventListener(
      'dataavailable',
      (event: BlobEvent) => {
        if (event.data.size > 0) {
          audioChunks.value.push(event.data);
        }
      }
    );

    mediaRecorder.value.start(1000);
  } catch (error) {
    console.error('Error accessing microphone:', error);
    statusMessage.value = 'Error accessing microphone';
  }
};

const stopRecording = () => {
  if (mediaRecorder.value) {
    mediaRecorder.value.stop();
    mediaRecorder.value.stream.getTracks().forEach((track) => track.stop());
    isRecording.value = false;

    const blob = new Blob(audioChunks.value);

    transcribeAudio(blob);
  }
};

const transcription = ref('');
const transcribeAudio = async (blob: Blob) => {
  if (isProcessing.value) {
    return;
  }

  isProcessing.value = true;
  statusMessage.value = 'Transcribing...';

  const formData = new FormData();
  formData.append('audio', blob, 'audio.webm');

  try {
    const text = await $fetch('/api/transcribe', {
      method: 'POST',
      body: formData,
    });

    console.log('transcribed text', text);
    if (text) {
      transcription.value = text;
      processTranscription();
    } else {
      statusMessage.value = 'No text was transcribed';
      isProcessing.value = false;
    }
  } catch (error) {
    console.error('Error sending audio to server:', error);
    statusMessage.value = 'Error transcribing audio';
    isProcessing.value = false;
  }
};

const processTranscription = () => {
  // TODO
};
</script>
