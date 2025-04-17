import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import AppTable from '@/components/AppTable.vue'
import ProjectPage from '@/components/ProjectPage.vue'
import NotFoundPage from '@/components/NotFoundPage.vue' 

const routes: Array<RouteRecordRaw> = [
  { path: '/', component: AppTable },
  { path: '/project/:id', component: ProjectPage },
  { path: '/:pathMatch(.*)*', component: NotFoundPage }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
