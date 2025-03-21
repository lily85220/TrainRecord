<template>
  <div class="workout-record q-pa-md">
    <div class="row q-col-gutter-md">
      <!-- 訓練基本資訊 -->
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="text-h6">新增訓練記錄</div>
            <div class="row q-col-gutter-md q-mt-md">
              <div class="col-12 col-sm-6">
                <q-input
                  v-model="workoutName"
                  label="訓練名稱"
                  outlined
                  dense
                />
              </div>
              <div class="col-12 col-sm-6">
                <q-input
                  v-model="workoutDate"
                  label="訓練日期"
                  outlined
                  dense
                  type="date"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- 器材列表 -->
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="row items-center justify-between">
              <div class="text-h6">器材清單</div>
              <q-btn
                color="primary"
                icon="add"
                label="新增器材"
                @click="showExerciseDialog = true"
              />
            </div>

            <!-- 已添加的器材列表 -->
            <div v-for="(exercise, exerciseIndex) in exercises" :key="exerciseIndex" class="q-mt-md">
              <q-card bordered>
                <q-card-section>
                  <div class="row items-center justify-between">
                    <div class="text-h6">{{ exercise.name }}</div>
                    <q-btn
                      flat
                      round
                      color="negative"
                      icon="delete"
                      @click="removeExercise(exerciseIndex)"
                    />
                  </div>

                  <!-- 組數記錄 -->
                  <div class="q-mt-md">
                    <div v-for="(set, setIndex) in exercise.sets" :key="setIndex" class="row q-col-gutter-sm q-mb-sm">
                      <div class="col-auto">
                        <div class="text-subtitle2">第 {{ setIndex + 1 }} 組</div>
                      </div>
                      <div class="col">
                        <q-input
                          v-model.number="set.weight"
                          type="number"
                          label="重量 (kg)"
                          outlined
                          dense
                        />
                      </div>
                      <div class="col">
                        <q-input
                          v-model.number="set.reps"
                          type="number"
                          label="次數"
                          outlined
                          dense
                        />
                      </div>
                      <div class="col-auto">
                        <q-btn
                          flat
                          round
                          color="negative"
                          icon="remove"
                          @click="removeSet(exerciseIndex, setIndex)"
                        />
                      </div>
                    </div>
                    <q-btn
                      flat
                      color="primary"
                      icon="add"
                      label="新增一組"
                      @click="addSet(exerciseIndex)"
                    />
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- 儲存按鈕 -->
      <div class="col-12">
        <q-btn
          color="primary"
          label="儲存訓練記錄"
          class="full-width"
          @click="saveWorkout"
        />
      </div>
    </div>

    <!-- 選擇器材對話框 -->
    <q-dialog v-model="showExerciseDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">選擇器材</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <ExerciseSelector @select="onExerciseSelect" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="取消" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { date } from 'quasar'
import ExerciseSelector from '../components/ExerciseSelector.vue'

const route = useRoute()
const showExerciseDialog = ref(false)

// 訓練基本資訊
const workoutName = ref('')
const workoutDate = ref(date.formatDate(new Date(), 'YYYY-MM-DD'))

// 器材列表
const exercises = ref([])

// 新增器材
const onExerciseSelect = (exercise) => {
  exercises.value.push({
    id: exercise.id,
    name: exercise.name,
    sets: []
  })
  showExerciseDialog.value = false
}

// 移除器材
const removeExercise = (index) => {
  exercises.value.splice(index, 1)
}

// 新增一組
const addSet = (exerciseIndex) => {
  exercises.value[exerciseIndex].sets.push({
    weight: 0,
    reps: 0
  })
}

// 移除一組
const removeSet = (exerciseIndex, setIndex) => {
  exercises.value[exerciseIndex].sets.splice(setIndex, 1)
}

// 儲存訓練記錄
const saveWorkout = () => {
  const workout = {
    name: workoutName.value,
    date: workoutDate.value,
    exercises: exercises.value
  }
  console.log('儲存訓練記錄:', workout)
  // 這裡之後可以加入實際的儲存邏輯
}

onMounted(() => {
  const exerciseId = route.query.exerciseId
  if (exerciseId) {
    // 如果是從運動清單過來，自動加入該運動
    const selectedExercise = exercises.find(e => e.id === parseInt(exerciseId))
    if (!selectedExercise) {
      // TODO: 從 exercises.js 中取得運動資訊
    }
  }
})
</script>

<style scoped>
.workout-record {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
