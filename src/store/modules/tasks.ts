import axios from 'axios'
import { ActionContext } from 'vuex'

const SERVER_URL = 'http://localhost:3000/projects'

interface Task {
  id: string,
  name: string
  description: string
  implementer: string
  status: string
  deadline: string
}

interface Project {
  id: string
  name: string
  description: string
  tasksCount: number
  status: string
  createdAt: string
  tasks: Task[]
}


interface ProjectsState {
  projects: Project[]
}

interface RootState {
    projects: ProjectsState

  }
  

export default {
  state(): ProjectsState {
    return {
      projects: [],
    }
  },

  getters: {
    getProjects(state: ProjectsState): Project[] {
      return state.projects
    },
  },

  mutations: {
      
    UPDATE_TASK_STATUS(state: ProjectsState, payload: { projectId: string, taskId: string, newStatus: string }) {
      const project = state.projects.find(p => p.id === payload.projectId)
      if (project) {
        const task = project.tasks.find(t => t.id === payload.taskId)
        if (task) {
          task.status = payload.newStatus
        } else {
          console.warn(`Task with id ${payload.taskId} isn't exist in project ${payload.projectId}`)
        }
      }
    }, 
    
      ADD_TASK(state: ProjectsState, payload: { projectId: string, task: Task }) {
        const project = state.projects.find(p => p.id === payload.projectId)
        if (project) {
          project.tasks.push(payload.task)
          project.tasksCount += 1
        }
      },
  },

  actions: {   

      async updateTaskStatus(
        { commit }: ActionContext<ProjectsState, RootState>,
        payload: { projectId: string, taskId: string, newStatus: string }
      ) {
        try {
          const res = await axios.get<Project>(`${SERVER_URL}/${payload.projectId}`);
          const project = res.data;
          console.log("Project:", project)
      
          const task = project.tasks.find(t => t.id === payload.taskId)
          console.log("Task:", task)
          if (!task) {
            throw new Error(`Task with id ${payload.taskId} didn't find`)
          }
      
          task.status = payload.newStatus;
      
          await axios.put(`${SERVER_URL}/${payload.projectId}`, project);
          commit('UPDATE_TASK_STATUS', payload);
        } catch (err) {
          console.error('Error:', err);
        }
      },      
    
      async addTask({ commit }: ActionContext<ProjectsState, RootState>, payload: { projectId: string, task: Task }) {
        try {
          const res = await axios.get<Project>(`${SERVER_URL}/${payload.projectId}`);
          const project = res.data;
    
          project.tasks.push(payload.task);
          project.tasksCount += 1;
    
          await axios.put(`${SERVER_URL}/${payload.projectId}`, project);
          commit('ADD_TASK', payload);
        } catch (err) {
          console.error('Error:', err);
        }
      }
  },
}
