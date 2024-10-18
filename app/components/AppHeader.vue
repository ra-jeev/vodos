<template>
  <header
    class="bg-white/75 dark:bg-gray-900/75 backdrop-blur border-b -mb-px sticky top-0 z-50 border-gray-200 dark:border-gray-800"
  >
    <UContainer class="flex flex-wrap items-center justify-between h-14">
      <AppLogo />
      <div class="flex items-center gap-x-4">
        <ColorMode />

        <UButton
          icon="i-simple-icons-github"
          color="gray"
          variant="ghost"
          to="https://github.com/ra-jeev/vodos"
          target="_blank"
        />

        <UserMenu v-if="loggedIn" />

        <UButton
          v-else
          trailing-icon="i-heroicons-arrow-right-end-on-rectangle"
          to="/sign-in"
        >
          Sign In
        </UButton>
      </div>
    </UContainer>
  </header>
</template>

<script setup lang="ts">
const { loggedIn } = useUserSession();
</script>
