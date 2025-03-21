<!-- 將 WorkoutRecord.vue 的內容複製到這裡，並做一些修改 -->
<template>
  <div class="workout-form q-pa-md">
    <div class="row q-col-gutter-md">
      <!-- 訓練基本資訊 -->
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="text-h6">{{ editId ? '編輯訓練記錄' : '新增訓練記錄' }}</div>
            <div class="row q-col-gutter-md q-mt-md">
              <div class="col-12 col-sm-6">
                <q-input
                  v-model="workoutName"
                  label="訓練名稱"
                  outlined
                  dense
                  :rules="[val => !!val || '請輸入訓練名稱']"
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
                  <div class="row q-col-gutter-md">
                    <!-- 器材資訊 -->
                    <div class="col-12 col-sm-4">
                      <q-img
                        :src="getExerciseImage(exercise)"
                        :ratio="1/1"
                        class="rounded-borders"
                      >
                       
                      </q-img>
                    </div>

                    <!-- 訓練組數 -->
                    <div class="col-12 col-sm-8">
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
                    </div>
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
          :label="editId ? '更新訓練記錄' : '儲存訓練記錄'"
          class="full-width"
          @click="saveWorkout"
          :disable="!isFormValid"
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
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { date } from 'quasar'
import ExerciseSelector from '../components/ExerciseSelector.vue'
import { exercises as exerciseList } from '../data/exercises'

const router = useRouter()
const route = useRoute()
const $q = useQuasar()
const showExerciseDialog = ref(false)

// 訓練基本資訊
const workoutName = ref('')
const workoutDate = ref(date.formatDate(new Date(), 'YYYY-MM-DD'))

// 器材列表
const exercises = ref([])

// 編輯模式
const editId = ref(null)

// 表單驗證
const isFormValid = computed(() => {
  return workoutName.value && exercises.value.length > 0
})

// 獲取器材圖片
const getExerciseImage = (exercise) => {
  const exerciseData = exerciseList.find(e => e.id === exercise.id)
  return exerciseData?.image || '/TrainRecord/images/default-exercise.jpg'
}

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
  if (!isFormValid.value) {
    $q.notify({
      color: 'negative',
      message: '請填寫訓練名稱並至少新增一個器材'
    })
    return
  }

  // 從 localStorage 獲取現有記錄
  const existingWorkouts = JSON.parse(localStorage.getItem('workouts') || '[]')
  
  const workout = {
    id: editId.value || Date.now(),
    name: workoutName.value,
    date: workoutDate.value,
    exercises: exercises.value,
    createdAt: editId.value ? 
      existingWorkouts.find(w => w.id === editId.value)?.createdAt : 
      new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  if (editId.value) {
    // 更新現有記錄
    const index = existingWorkouts.findIndex(w => w.id === editId.value)
    if (index !== -1) {
      existingWorkouts[index] = workout
    }
  } else {
    // 新增記錄
    existingWorkouts.push(workout)
  }
  
  // 儲存回 localStorage
  localStorage.setItem('workouts', JSON.stringify(existingWorkouts))

  $q.notify({
    color: 'positive',
    message: editId.value ? '訓練記錄已更新' : '訓練記錄已儲存'
  })

  // 返回記錄列表
  router.push('/records')
}

onMounted(() => {
  // 檢查是否為編輯模式
  const editWorkoutId = route.query.editId
  if (editWorkoutId) {
    editId.value = parseInt(editWorkoutId)
    const existingWorkouts = JSON.parse(localStorage.getItem('workouts') || '[]')
    const workoutToEdit = existingWorkouts.find(w => w.id === editId.value)
    
    if (workoutToEdit) {
      workoutName.value = workoutToEdit.name
      workoutDate.value = workoutToEdit.date
      exercises.value = workoutToEdit.exercises
    }
  } else {
    // 檢查是否從運動清單過來
    const exerciseId = route.query.exerciseId
    if (exerciseId) {
      const exerciseData = exerciseList.find(e => e.id === parseInt(exerciseId))
      if (exerciseData) {
        exercises.value.push({
          id: exerciseData.id,
          name: exerciseData.name,
          sets: []
        })
      }
    }
  }
})
</script>

<style scoped>
.workout-form {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
