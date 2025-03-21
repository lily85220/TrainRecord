<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const showAddButton = computed(() => route.name === 'records')

const addNewRecord = () => {
  router.push('/records/new')
}
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          健身訓練記錄
        </q-toolbar-title>
      </q-toolbar>

      <q-tabs>
        <q-route-tab to="/records" label="訓練記錄" />
        <q-route-tab to="/exercises" label="運動清單" />
      </q-tabs>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style>
body {
  margin: 0;
  padding: 0;
}
</style>
