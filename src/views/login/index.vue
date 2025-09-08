<script setup lang="ts">
// 交互逻辑你自己补，比如 useForm, 校验, API 请求
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-bg text-text">
    <div class="w-full max-w-md p-8 rounded-2xl shadow-md bg-surface border border-border">
      <!-- 标题 -->
      <h1 class="text-2xl font-bold text-center mb-6 text-primary">{{ "router.dashboard" }} Admin</h1>

      <!-- 用户名 -->
      <div class="mb-4">
        <label class="block text-sm font-medium mb-1 text-muted"> Username </label>
        <input
          type="text"
          class="w-full px-4 py-2 rounded-lg border border-input-border bg-input-bg text-input-text focus:outline-none focus:ring-1 focus:ring-primary focus:border-input-focus"
          placeholder="Enter your username"
        />
      </div>

      <!-- 密码 -->
      <div class="mb-6">
        <label class="block text-sm font-medium mb-1 text-muted"> Password </label>
        <input
          type="password"
          class="w-full px-4 py-2 rounded-lg border border-input-border bg-input-bg text-input-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-input-focus"
          placeholder="Enter your password"
        />
      </div>

      <!-- 登录按钮 -->
      <button class="w-full py-2 px-4 rounded-lg bg-primary text-invert font-medium shadow hover:bg-primary/90 transition-colors">Login</button>

      <!-- 额外操作 -->
      <div class="flex justify-between mt-4 text-sm text-muted">
        <a href="#" class="hover:text-primary transition-colors">Forgot password?</a>
        <a href="#" class="hover:text-primary transition-colors">Register</a>
      </div>
    </div>
  </div>
</template>
