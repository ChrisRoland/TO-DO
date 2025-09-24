<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <!-- Header -->
    <header class="relative z-10 px-6 py-4">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <CheckSquare class="h-8 w-8 text-blue-600" />
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            T0 + D0
          </h1>
        </div>
        <div class="flex items-center space-x-4">
          <RouterLink to="/login">
            <Button variant="ghost" class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
              Sign In
            </Button>
          </RouterLink>
          <RouterLink to="/register">
            <Button class="bg-blue-600 hover:bg-blue-700 text-white">
              Get Started
            </Button>
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
            <span class="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Amplify Your Productivity
            </span>
          </h2>
          <p class="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            T0+D0 is the modern todo app that works offline, syncs across devices, 
            and helps you stay focused on what matters most. Simple, powerful, and built for real life.
          </p>
          <div class="flex items-center justify-center space-x-4">
            <RouterLink to="/register">
              <Button size="lg" class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                Start Organizing Now
              </Button>
            </RouterLink>
            <RouterLink to="/login">
              <Button size="lg" variant="outline" class="px-8 py-3 text-lg">
                Sign In
              </Button>
            </RouterLink>
          </div>
        </div>

        <!-- Features Grid -->
        <div class="grid md:grid-cols-3 gap-8 mb-16">
          <Card class="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent class="p-8 text-center">
              <div class="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap class="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Lightning Fast
              </h3>
              <p class="text-gray-600 dark:text-gray-300">
                Built with modern Vue and optimized for speed. Create, edit, and organize todos instantly 
                with our responsive interface.
              </p>
            </CardContent>
          </Card>

          <Card class="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent class="p-8 text-center">
              <div class="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield class="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Works Offline
              </h3>
              <p class="text-gray-600 dark:text-gray-300">
                Never lose your productivity momentum. T0+D0 works completely offline and syncs 
                when you're back online.
              </p>
            </CardContent>
          </Card>

          <Card class="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent class="p-8 text-center">
              <div class="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone class="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Mobile First
              </h3>
              <p class="text-gray-600 dark:text-gray-300">
                Designed for the mobile-first world. Perfect experience on phone, tablet, 
                and desktop with PWA support.
              </p>
            </CardContent>
          </Card>
        </div>

        <!-- Feature Details -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-16">
          <h3 class="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Everything You Need to Stay Organized
          </h3>
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="flex items-center space-x-3">
              <CheckSquare class="h-8 w-8 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h4 class="font-semibold text-gray-900 dark:text-white">Smart Prioritization</h4>
                <p class="text-gray-600 dark:text-gray-300 text-sm">Set priorities and focus on what matters most</p>
              </div>
            </div>
            <div class="flex items-center space-x-3">
              <Star class="h-8 w-8 text-yellow-500 mt-1 flex-shrink-0" />
              <div>
                <h4 class="font-semibold text-gray-900 dark:text-white">Important Tasks</h4>
                <p class="text-gray-600 dark:text-gray-300 text-sm">Never miss critical deadlines and priorities</p>
              </div>
            </div>
            <div class="flex items-center space-x-3">
              <Archive class="h-8 w-8 text-gray-500 mt-1 flex-shrink-0" />
              <div>
                <h4 class="font-semibold text-gray-900 dark:text-white">Archive & History</h4>
                <p class="text-gray-600 dark:text-gray-300 text-sm">Keep completed tasks for future reference</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Call to Action -->
        <div class="text-center">
          <h3 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Get Organized?
          </h3>
          <p class="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Join thousands of users who have transformed their productivity with T0+D0
          </p>
          <RouterLink to="/register">
            <Button size="lg" class="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 text-xl">
              Start Your Journey Today
            </Button>
          </RouterLink>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { CheckSquare, Star, Archive, Zap, Shield, Smartphone } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import CardContent from '@/components/ui/CardContent.vue'
import { RouterLink } from 'vue-router'
</script>