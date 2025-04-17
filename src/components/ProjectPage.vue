<template>
    <h1 class="project__title">Projects Page</h1>
    <div class="form">
  <label>Filtration</label>
  <select v-model="sortBy" @change="groupTasksByStatus(tasks)" class="project__select">
    <option value="">—</option>
    <option value="implementer">By implementer</option>
    <option value="deadline">By deadline</option>
    <option value="status">By status</option>
  </select>

  <label>Filter by implementer</label>
  <input type="text" v-model="filterImplementer" @input="groupTasksByStatus(tasks)" placeholder="Implementer" class="project__input"/>

  <label>Filter by status</label>
  <select v-model="filterStatus" @change="groupTasksByStatus(tasks)" class="project__select">
    <option value="">—</option>
    <option value="To do">To do</option>
    <option value="In Progress">In Progress</option>
    <option value="Done">Done</option>
  </select>
</div>

    <div class="board">
      <div class="column" v-for="(list, index) in columns" :key="index">
        <h2>{{ titles[index] }}</h2>

        <draggable
          v-model="columns[index]"
          :group="'tasks'"
          tag="ul"
          class="draggable-list"
          @end="onDragEnd"
        >
          <template #item="{ element }">
            <li>
              <strong>{{ element.name }}</strong><br />
              <small>{{ element.implementer }}</small><br />
              <small>Deadline: {{ element.deadline }}</small>
            </li>
          </template>
        </draggable>
        <button
            v-if="titles[index] === 'To do'"
            @click="isOpen = true"
            class="btn"
        >
            + Add Task
        </button>
      </div>
    </div>
    <AddTaskModal
        :isOpen="isOpen"
        @close="isOpen = false"
        @added="handleTaskAdded"
        />

  </template>
  

  <script lang="ts">
  import draggable from 'vuedraggable'
  import { mapGetters, mapActions } from 'vuex'
  import { useRoute, RouteLocationNormalizedLoaded } from 'vue-router'
  import AddTaskModal from "./modals/AddTaskModal.vue"
  import { defineComponent, computed, watch } from 'vue'
  
  interface Task {
    id: string
    title: string
    status: 'To do' | 'In Progress' | 'Done'
    implementer: string
    deadline: string
  }
  
  interface Project {
    id: string
    name: string
    tasks: Task[]
  }
  
  export default defineComponent({
    components: {
      draggable,
      AddTaskModal
    },
  
    setup() {
      const route: RouteLocationNormalizedLoaded = useRoute()
      return { route }
    },
  
    data() {
      return {
        titles: ['To do', 'In Progress', 'Done'],
        columns: [[], [], []],
        isOpen: false,
        sortBy: '',
        filterImplementer: '',
        filterStatus: ''
      }
    },
  
    computed: {
      ...mapGetters(['getProjects']),
  
      tasks(): Task[] {
        const currentProject: Project = this.getProjects.find(
          (p: Project) => p.id === this.route.params.id
        )
        return currentProject?.tasks || []
      }
    },
  
    watch: {
      tasks: {
        immediate: true,
        handler(newTasks: Task[]) {
          this.groupTasksByStatus(newTasks)
        }
      }
    },
  
    created() {
      this.fetchProjects()
    },
  
    methods: {
      ...mapActions(['fetchProjects', 'updateTaskStatus']),
  
      handleTaskAdded() {
        this.fetchProjects()
      },
  
      groupTasksByStatus(tasks: Task[]) {
        const grouped: Task[][] = [[], [], []]
  
        let filtered: Task[] = tasks
  
        if (this.filterImplementer) {
          filtered = filtered.filter(task =>
            task.implementer.toLowerCase().includes(this.filterImplementer.toLowerCase())
          )
        }
  
        if (this.filterStatus) {
          filtered = filtered.filter(task => task.status === this.filterStatus)
        }
  
        filtered.forEach(task => {
          switch (task.status) {
            case 'To do':
              grouped[0].push(task)
              break
            case 'In Progress':
              grouped[1].push(task)
              break
            case 'Done':
              grouped[2].push(task)
              break
          }
        })
  
        const sortFn = {
          implementer: (a: Task, b: Task) => a.implementer.localeCompare(b.implementer),
          deadline: (a: Task, b: Task) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime(),
          status: (a: Task, b: Task) => a.status.localeCompare(b.status)
        }
  
        if (this.sortBy && sortFn[this.sortBy]) {
          grouped.forEach(column => column.sort(sortFn[this.sortBy]))
        }
  
        this.columns = grouped
      },
  
      onDragEnd() {
        const updatedTasks: Array<{ task: Task; newStatus: string }> = []
  
        this.columns.forEach((column: Task[], colIndex: number) => {
          const newStatus: Task['status'] = this.titles[colIndex]
          column.forEach((task: Task) => {
            if (task.status !== newStatus) {
              task.status = newStatus
              updatedTasks.push({ task, newStatus })
            }
          })
        })
  
        const projectId = this.route.params.id
        updatedTasks.forEach(({ task }) => {
          const taskIndex = this.tasks.findIndex((t: Task) => t.id === task.id)
          if (taskIndex !== -1) {
            this.updateTaskStatus({
              projectId,
              taskId: task.id,
              newStatus: task.status
            })
          }
        })
  
        console.log('Update tasks:', updatedTasks)
      }
    }
  })
  </script>
  
  

<style scoped>
.board {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 30px;
  padding: 20px;
}
.form{
    display: flex;
    gap: 10px;
    margin-top: 20px;
    align-items: center;
    justify-content: center;
    color: white;
}
.project__title {
        color: #fff;
        font-size: 28px;
        font-family: Verdana, Geneva, Tahoma, sans-serif;
        line-height: 128.571%;
        font-weight: 500;
        text-align: center;
        margin: 0;
        padding-top: 15px;
    }

.project__select{
        padding: 10px;
        border-radius: 5px;
        border: 1px solid #ccc;
        width: 150px;
    }

.project__select:focus{
    outline: none;
    border-color: #34195d;
}

.project__input{
        padding: 10px;
        border-radius: 5px;
        border: 1px solid #ccc;
        width: 200px;
    }

.project__input:focus{
    outline: none;
    border-color: #34195d;
}

.column {
    flex: 1;
    border: 1px solid #ccc;
    padding: 10px;
    min-height: 200px;
    background-color: #fff;
    box-shadow: 0px 2px 16px 0px rgba(0, 0, 0, 0.05);
    border-radius: 8px;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  padding: 8px;
  margin-bottom: 6px;
  border-radius: 8px;
  background-color: rgba(90, 62, 141, 0.7333333333);
  cursor: move;
  color: white;
}

.form {
  display: flex;
  gap: 10px;
  margin-top: 20px;
  align-items: center;
}

input,
select {
  padding: 8px;
  font-size: 16px;
}

.btn{
    padding: 10px 20px;
    background-color: #34195d;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    }

.btn:hover{
    background-color: #5a3e8d;
}
</style>
