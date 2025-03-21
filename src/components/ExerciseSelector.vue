<template>
  <div class="q-pa-md">
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-input
          v-model="search"
          outlined
          dense
          placeholder="搜尋器材或動作"
          class="q-mb-md"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      
      <div 
        v-for="exercise in filteredExercises" 
        :key="exercise.id"
        class="col-12 col-sm-6 col-md-4"
      >
        <q-card 
          class="exercise-card cursor-pointer"
          @click="selectExercise(exercise)"
        >
          <q-img
            :src="exercise.image"
            :ratio="1/1"
            placeholder-src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
          >
           
          </q-img>
          <q-card-section>
            <div class="text-h6">{{ exercise.name }}</div>
            <div class="text-subtitle2">{{ exercise.category }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { exercises } from '../data/exercises'

const search = ref('')
const selectedExercise = ref(null)

const filteredExercises = computed(() => {
  return exercises.filter(exercise => 
    exercise.name.toLowerCase().includes(search.value.toLowerCase()) ||
    exercise.category.toLowerCase().includes(search.value.toLowerCase())
  )
})

const selectExercise = (exercise) => {
  selectedExercise.value = exercise
  emit('select', exercise)
}

const emit = defineEmits(['select'])
</script>

<style scoped>
.exercise-card {
  transition: transform 0.2s;
}

.exercise-card:hover {
  transform: translateY(-5px);
}
</style>
