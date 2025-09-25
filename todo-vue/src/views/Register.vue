<script setup lang="ts">
defineOptions({ name: 'RegisterPage' })

import { useSeo } from '@/composables/useSeo'
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { CheckSquare, Eye, EyeOff, Mail, Lock, User, Chrome } from 'lucide-vue-next'

useSeo({ title: 'Sign Up - T0+D0' })
const router = useRouter()
const auth = useAuthStore()

const fullName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const error = ref('')
const success = ref('')

const handleSignUp = async () => {
  isLoading.value = true
  error.value = ''
  success.value = ''

  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    isLoading.value = false
    return
  }

  const { error: signUpError } = await auth.signUp(email.value, password.value, fullName.value)

  if (signUpError) {
    error.value = signUpError
  } else {
    success.value = 'Account created! Please check your email to verify your account.'
    setTimeout(() => {
      router.push('/app')
    }, 2000)
  }

  isLoading.value = false
}

const handleGoogleSignIn = async () => {
  isLoading.value = true
  error.value = ''
  const { error: googleError } = await auth.signInWithGoogle()
  if (googleError) {
    error.value = googleError
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-6">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <RouterLink to="/" class="inline-flex items-center space-x-2 mb-6">
          <CheckSquare class="h-8 w-8 text-blue-600" />
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            T0 + D0
          </h1>
        </RouterLink>
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Create Your Account
        </h2>
        <p class="text-gray-600 dark:text-gray-300">
          Join thousands organizing their life with T0+D0
        </p>
      </div>

      <Card class="shadow-xl border-0">
        <CardHeader class="space-y-1 pb-6">
          <CardTitle class="text-center text-xl">
            Get started for free
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div v-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
            <p class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
          </div>
          <div v-if="success" class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-3">
            <p class="text-sm text-green-600 dark:text-green-400">{{ success }}</p>
          </div>

          <form @submit.prevent="handleSignUp" class="space-y-4">
            <div class="space-y-2">
              <Label for="fullName">Full Name</Label>
              <div class="relative">
                <User class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input id="fullName" type="text" placeholder="Enter your full name" class="pl-10" v-model="fullName" :disabled="isLoading" />
              </div>
            </div>
            <div class="space-y-2">
              <Label for="email">Email</Label>
              <div class="relative">
                <Mail class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input id="email" type="email" placeholder="Enter your email" class="pl-10" v-model="email" :disabled="isLoading" />
              </div>
            </div>
            <div class="space-y-2">
              <Label for="password">Password</Label>
              <div class="relative">
                <Lock class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input id="password" :type="showPassword ? 'text' : 'password'" placeholder="Create a password" class="pl-10 pr-10" v-model="password" :disabled="isLoading" />
                <button type="button" class="absolute right-3 top-1/2 transform -translate-y-1/2" @click="showPassword = !showPassword">
                  <EyeOff v-if="showPassword" class="h-4 w-4 text-gray-400" />
                  <Eye v-else class="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>
            <div class="space-y-2">
              <Label for="confirmPassword">Confirm Password</Label>
              <div class="relative">
                <Lock class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input id="confirmPassword" type="password" placeholder="Confirm your password" class="pl-10" v-model="confirmPassword" :disabled="isLoading" />
              </div>
            </div>
            <Button type="submit" class="w-full bg-blue-600 hover:bg-blue-700" :disabled="isLoading">
              {{ isLoading ? "Creating account..." : "Create Account" }}
            </Button>
          </form>

          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <span class="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div class="relative flex justify-center text-xs uppercase">
              <span class="bg-white dark:bg-gray-800 px-2 text-gray-500">Or continue with</span>
            </div>
          </div>
          <Button type="button" variant="outline" class="w-full" @click="handleGoogleSignIn" :disabled="isLoading">
            <Chrome class="mr-2 h-4 w-4" />
            Continue with Google
          </Button>

        </CardContent>
        <CardFooter class="text-center">
          <p class="text-sm text-gray-600 dark:text-gray-300">
            Already have an account?
            <RouterLink to="/login" class="text-blue-600 hover:text-blue-700 font-medium">
              Sign in
            </RouterLink>
          </p>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>