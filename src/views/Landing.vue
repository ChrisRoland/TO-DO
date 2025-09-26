<script setup lang="ts">
defineOptions({ name: 'LandingPage' })

import { useSeo } from '@/composables/useSeo'
import { RouterLink } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckSquare, Star, Archive, Zap, Shield, Smartphone } from 'lucide-vue-next'
import RealTimeUserPresence from '@/components/RealTimeUserPresence.vue'

useSeo({ title: 'Welcome - T0+D0' })
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
  >
    <!-- Header -->
    <header class="relative z-10 px-6 py-4">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <CheckSquare class="h-8 w-8 text-blue-600" />
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">T0 + D0</h1>
        </div>

        <div class="flex items-center justify-between p-4">
          <RealTimeUserPresence />
        </div>
        <div class="flex items-center space-x-4">
          <RouterLink to="/login">
            <Button
              variant="ghost"
              class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              Sign In
            </Button>
          </RouterLink>
          <RouterLink to="/register">
            <Button class="bg-blue-600 hover:bg-blue-700 text-white"> Get Started </Button>
          </RouterLink>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <main class="px-6 py-12">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Organize Your Life,
            <span
              class="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
            >
              Amplify Your Productivity
            </span>
          </h2>
          <p class="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            T0+D0 is the modern todo app that works offline, syncs across devices, and helps you
            stay focused on what matters most. Simple, powerful, and built for real life.
          </p>
          <div class="flex items-center justify-center space-x-4">
            <RouterLink to="/register">
              <Button size="lg" class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                Start Organizing Now
              </Button>
            </RouterLink>
            <RouterLink to="/login">
              <Button size="lg" variant="outline" class="px-8 py-3 text-lg"> Sign In </Button>
            </RouterLink>
          </div>
        </div>

        <!-- Features Grid -->
        <div class="grid md:grid-cols-3 gap-8 mb-16">
          <Card class="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent class="p-8 text-center">
              <div
                class="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Zap class="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Lightning Fast
              </h3>
              <p class="text-gray-600 dark:text-gray-300">
                Built with modern React and optimized for speed. Create, edit, and organize todos
                instantly with our responsive interface.
              </p>
            </CardContent>
          </Card>

          <Card class="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent class="p-8 text-center">
              <div
                class="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Shield class="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Works Offline
              </h3>
              <p class="text-gray-600 dark:text-gray-300">
                Never lose your productivity flow. Our offline-first design keeps you working even
                without internet, syncing when you're back online.
              </p>
            </CardContent>
          </Card>

          <Card class="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent class="p-8 text-center">
              <div
                class="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Smartphone class="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">Mobile Ready</h3>
              <p class="text-gray-600 dark:text-gray-300">
                Fully responsive design that works beautifully on desktop, tablet, and mobile. Your
                todos, everywhere you need them.
              </p>
            </CardContent>
          </Card>
        </div>

        <!-- Feature Highlights -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-16">
          <h3 class="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Everything You Need to Stay Organized
          </h3>
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="flex items-center space-x-3">
              <CheckSquare class="h-8 w-8 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h4 class="font-semibold text-gray-900 dark:text-white">Smart Prioritization</h4>
                <p class="text-gray-600 dark:text-gray-300 text-sm">
                  Set priorities and focus on what matters most
                </p>
              </div>
            </div>
            <div class="flex items-center space-x-3">
              <Star class="h-8 w-8 text-yellow-500 mt-1 flex-shrink-0" />
              <div>
                <h4 class="font-semibold text-gray-900 dark:text-white">Important Tasks</h4>
                <p class="text-gray-600 dark:text-gray-300 text-sm">
                  Quick access to your high-priority items
                </p>
              </div>
            </div>
            <div class="flex items-center space-x-3">
              <Archive class="h-8 w-8 text-gray-500 mt-1 flex-shrink-0" />
              <div>
                <h4 class="font-semibold text-gray-900 dark:text-white">Archive System</h4>
                <p class="text-gray-600 dark:text-gray-300 text-sm">
                  Keep completed tasks organized and accessible
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- CTA Section -->
        <div class="text-center">
          <h3 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Get More Done?
          </h3>
          <p class="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Join thousands of users who've transformed their productivity with T0+D0
          </p>
          <RouterLink to="/register">
            <Button
              size="lg"
              class="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-12 py-4 text-lg"
            >
              Start Your Free Account
            </Button>
          </RouterLink>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="px-6 py-8 border-t border-gray-200 dark:border-gray-700 mt-16">
      <div class="max-w-7xl mx-auto text-center">
        <p class="text-gray-600 dark:text-gray-400">
          © {{ new Date().getFullYear() }} T0 + D0. Built with ❤️ for productivity enthusiasts.
        </p>
      </div>
    </footer>
  </div>
</template>
