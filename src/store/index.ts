
import { createStore } from 'vuex'
import projectsModule from "./modules/projects"
import tasksModule from "./modules/tasks"

export default createStore({

  modules: {
    projects: projectsModule,
    tasks: tasksModule
  }
})
