<template>
  <div class="workout-records q-pa-md">
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5">訓練記錄</div>
      <q-btn
        color="primary"
        icon="add"
        label="新增記錄"
        @click="$router.push('/records/new')"
      />
    </div>

    <!-- 記錄列表 -->
    <div class="row q-col-gutter-md">
      <div v-for="workout in sortedWorkouts" :key="workout.id" class="col-12">
        <q-card>
          <q-card-section>
            <div class="row items-center justify-between">
              <div>
                <div class="text-h6">{{ workout.name }}</div>
                <div class="text-subtitle2">{{ formatDate(workout.date) }}</div>
                <div class="text-caption text-grey">建立時間：{{ formatDateTime(workout.createdAt) }}</div>
              </div>
              <div class="row items-center">
                <q-btn
                  flat
                  round
                  color="primary"
                  icon="visibility"
                  @click="showWorkoutDetails(workout)"
                />
                <q-btn
                  flat
                  round
                  color="warning"
                  icon="edit"
                  @click="editWorkout(workout)"
                />
                <q-btn
                  flat
                  round
                  color="negative"
                  icon="delete"
                  @click="confirmDelete(workout)"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div v-if="sortedWorkouts.length === 0" class="col-12 text-center q-pa-lg">
        <div class="text-h6 text-grey">尚無訓練記錄</div>
      </div>
    </div>

    <!-- 詳細資訊對話框 -->
    <q-dialog v-model="showDetails" maximized>
      <q-card>
        <q-card-section class="row items-center">
          <div class="text-h6">{{ selectedWorkout?.name }}</div>
          <q-space />
          <q-btn flat round icon="close" v-close-popup />
        </q-card-section>

        <q-card-section v-if="selectedWorkout">
          <div class="text-subtitle2">日期：{{ formatDate(selectedWorkout.date) }}</div>
          <div class="text-caption text-grey">建立時間：{{ formatDateTime(selectedWorkout.createdAt) }}</div>
          
          <div class="q-mt-md">
            <div v-for="exercise in selectedWorkout.exercises" :key="exercise.id" class="q-mb-md">
              <q-card bordered>
                <q-card-section>
                  <div class="text-h6 row items-center">
                    <div class="img-box q-mr-md">
                      <q-img
                        :src="getExerciseImage(exercise)"
                        :ratio="1/1"
                        class="rounded-borders"
                      ></q-img>
                    </div>
                    <span>{{ exercise.name }}</span>

                  </div>
                  <div class="q-mt-sm">
                    <div v-for="(set, index) in exercise.sets" :key="index" class="row q-gutter-sm">
                      <div>第 {{ index + 1 }} 組：</div>
                      <div>{{ set.weight }} kg x {{ set.reps }} 次</div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuasar, date } from 'quasar'
import { useRouter } from 'vue-router'
import { exercises as exerciseList } from '../data/exercises'

const router = useRouter()
const $q = useQuasar()
const showDetails = ref(false)
const selectedWorkout = ref(null)

// 從 localStorage 獲取記錄
const workouts = ref(JSON.parse(localStorage.getItem('workouts') || '[]'))

// 依建立時間排序的記錄
const sortedWorkouts = computed(() => {
  return [...workouts.value].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
})

// 格式化日期
const formatDate = (dateString) => {
  return date.formatDate(dateString, 'YYYY/MM/DD (ddd)')
}

// 格式化日期時間
const formatDateTime = (dateString) => {
  return date.formatDate(dateString, 'YYYY/MM/DD HH:mm:ss')
}

// 顯示詳細資訊
const showWorkoutDetails = (workout) => {
  selectedWorkout.value = workout
  showDetails.value = true
}

// 編輯記錄
const editWorkout = (workout) => {
  router.push({
    name: 'new-record',
    query: { editId: workout.id }
  })
}

// 確認刪除
const confirmDelete = (workout) => {
  $q.dialog({
    title: '確認刪除',
    message: `確定要刪除「${workout.name}」的訓練記錄嗎？`,
    cancel: {
      label: '取消',
      flat: true
    },
    ok: {
      label: '刪除',
      color: 'negative'
    },
    persistent: true
  }).onOk(() => {
    deleteWorkout(workout.id)
  })
}

// 刪除記錄
const deleteWorkout = (workoutId) => {
  const index = workouts.value.findIndex(w => w.id === workoutId)
  if (index !== -1) {
    workouts.value.splice(index, 1)
    localStorage.setItem('workouts', JSON.stringify(workouts.value))
    $q.notify({
      color: 'positive',
      message: '記錄已刪除'
    })
  }
}
// 獲取器材圖片
const getExerciseImage = (exercise) => {
  const exerciseData = exerciseList.find(e => e.id === exercise.id)
  return exerciseData?.image || '/TrainRecord/images/default-exercise.jpg'
}
</script>

<style scoped>
.workout-records {
  max-width: 1200px;
  margin: 0 auto;
}
.img-box{
  width: 80px;
}
</style>
