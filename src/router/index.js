import { createRouter, createWebHistory } from 'vue-router'
import ExerciseList from '../views/ExerciseList.vue'
import WorkoutRecords from '../views/WorkoutRecords.vue'
import WorkoutForm from '../views/WorkoutForm.vue'

const routes = [
  {
    path: '/',
    redirect: '/exercises'
  },
  {
    path: '/exercises',
    name: 'exercises',
    component: ExerciseList,
    meta: {
      title: '運動清單'
    }
  },
  {
    path: '/records',
    name: 'records',
    component: WorkoutRecords,
    meta: {
      title: '訓練記錄'
    }
  },
  {
    path: '/records/new',
    name: 'new-record',
    component: WorkoutForm,
    meta: {
      title: '新增記錄'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
