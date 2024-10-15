<template>
  <UCard class="max-w-sm w-full">
    <h2 class="text-2xl font-medium text-center">Create a new account</h2>

    <UForm
      :schema="schema"
      :state="state"
      class="space-y-4 my-6"
      @submit="onSignUp"
    >
      <UFormGroup name="name" label="Name" required>
        <UInput
          v-model.trim="state.name"
          placeholder="Enter your name"
          icon="i-heroicons-user"
        />
      </UFormGroup>

      <UFormGroup name="username" label="Username" required>
        <UInput
          v-model.trim="state.username"
          placeholder="Enter you username"
          icon="i-heroicons-at-symbol"
        />
      </UFormGroup>

      <UFormGroup name="password" label="Password" required>
        <UInput
          v-model.trim="state.password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Enter your password"
          icon="i-heroicons-key"
          :ui="{ icon: { trailing: { pointer: '' } } }"
        >
          <template #trailing>
            <UButton
              :icon="
                showPassword
                  ? `i-heroicons-eye-slash-solid`
                  : `i-heroicons-eye-solid`
              "
              :padded="false"
              color="gray"
              variant="link"
              @click="showPassword = !showPassword"
            />
          </template>
        </UInput>
      </UFormGroup>

      <UNotification
        v-if="formError"
        id="sign-in"
        icon="i-heroicons-exclamation-triangle-solid"
        title="Error"
        color="red"
        :description="formError"
        :timeout="10000"
        @close="formError = ''"
      />

      <UButton
        block
        class="!mt-6"
        :loading="loading"
        :disabled="loading"
        trailing-icon="i-heroicons-arrow-right-20-solid"
        type="submit"
      >
        Submit
      </UButton>
    </UForm>

    <div
      class="text-sm font-medium text-gray-500 dark:text-gray-300 text-center"
    >
      Already have an account?
      <ULink
        class="text-primary hover:text-primary-600 dark:hover:text-primary-500"
        to="/sign-in"
      >
        Sign in here
      </ULink>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { z } from 'zod';
import type { FormSubmitEvent } from '#ui/types';

const showPassword = ref(false);
const loading = ref(false);
const formError = ref('');

const schema = z.object({
  name: z.string().min(2, 'Must be at least 2 characters'),
  username: z.string().min(2, 'Must be at least 2 characters'),
  password: z.string().min(8, 'Must be at least 8 characters'),
});

type Schema = z.output<typeof schema>;

const state = reactive({
  name: undefined,
  username: undefined,
  password: undefined,
});

const { fetch: refreshSession } = useUserSession();
const onSignUp = async (event: FormSubmitEvent<Schema>) => {
  loading.value = true;
  formError.value = '';

  try {
    await $fetch('/api/auth/sign-up', {
      method: 'POST',
      body: {
        name: event.data.name,
        username: event.data.username,
        password: event.data.password,
      },
    });

    await refreshSession();
  } catch (error) {
    formError.value =
      (error as { data?: { statusMessage?: string } }).data?.statusMessage ??
      'Failed to sign up. Please try again later.';
  } finally {
    loading.value = false;
  }
};

definePageMeta({
  layout: 'auth',
});
</script>
