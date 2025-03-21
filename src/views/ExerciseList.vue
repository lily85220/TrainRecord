<template>
  <div class="exercise-list">
    <ExerciseSelector @select="onExerciseSelect" />
  </div>
</template>

<script setup>
import ExerciseSelector from '../components/ExerciseSelector.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const onExerciseSelect = (exercise) => {
  router.push({
    name: 'new-record',
    query: { exerciseId: exercise.id }
  })
}
</script>
