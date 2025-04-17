<template>
   <div class="table__container">
    <div class="table__search">
      <input type="text" placeholder="Search..." class="table__input"  v-model="searchTerm" />
      <button class="btn" @click="onSearch">Search</button>
      <select v-model="selectedStatus" @change="onFilterChange" class="table__select">
        <option value="all">All</option>
        <option value="Active">Active</option>
        <option value="Completed">Completed</option>
        </select>

        <select v-model="selectedSort" @change="onFilterChange" class="table__select">
        <option disabled selected value="">Sort by...</option>
        <option value="id">ID</option>
        <option value="name">Name</option>
        <option value="tasks">Tasks</option>
        </select>

    </div>
  
    <div class="table__wrapper">
      <table class="projects__table">
        <thead>
            <tr>
            <th>
              ID
              <div class="resize-handle"></div>
            </th>
            <th>
              Name
              <div class="resize-handle"></div>
            </th>
            <th>
              Tasks
              <div class="resize-handle"></div>
            </th>
            <th>
              Status
              <div class="resize-handle"></div>
            </th>
            <th>
              Created At
              <div class="resize-handle"></div>
            </th>
          </tr>
        </thead>
        <tbody>
            <tr v-for="(project, i) in projects" :key="project.id"  @click="goToProject(project.id)">          
            <td>{{ i + 1 }}</td>
            <td>{{ project.name }}</td>
            <td>{{ project.tasksCount }}</td>
            <td>{{ project.status }}</td>
            <td>{{ formatDate(project.createdAt) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="table__bottom">
        <button class="btn" @click="isModalVisible = !isModalVisible">Add New Project</button>
    </div>

    <CreateModal
        :isOpen="isModalVisible"
        @close="isModalVisible = false"
        @copy="handleCopyAction"
        />

   </div>
  </template>
  
  
  <script lang="ts">
  import { mapGetters, mapActions } from 'vuex';
  import CreateModal from './modals/CreateModal.vue';
  
  interface Task {
    id: string | number;
    name: string;
    implementer: string;
    status: 'To do' | 'In Progress' | 'Done';
    deadline: string;
  }
  
  interface Project {
    id: string | number;
    name: string;
    status: string;
    tasks: Task[];
  }
  
  export default {
    name: 'AppTable',
  
    components: {
      CreateModal
    },
  
    computed: {
      ...mapGetters(['getProjects']),
  
      projects(): Project[] {
        return this.getProjects;
      }
    },
  
    data() {
      return {
        isModalVisible: false,
        searchTerm: '',
        searchNameTerm: '',
        selectedStatus: 'all',
        selectedSort: ''
      };
    },
  
    methods: {
      ...mapActions(['fetchProjects']),
  
      formatDate(date: string | number | Date): string {
        const formattedDate = new Date(date).toLocaleDateString('en-GB');
        return formattedDate.split('/').reverse().join('-');
      },
  
      initColumnResize() {
        const resizeHandles = document.querySelectorAll('.resize-handle');

        resizeHandles.forEach((handle) => {
            const el = handle as HTMLElement;

            el.addEventListener('mousedown', (e: MouseEvent) => {
            const th = el.parentElement as HTMLElement;
            const startX = e.clientX;
            const startWidth = th.offsetWidth;

            const onMouseMove = (e: MouseEvent) => {
                const newWidth = startWidth + (e.clientX - startX);
                th.style.width = `${newWidth}px`;
            };

            const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
            });
        });
        },
      onSearch(): void {
        this.onFilterChange();
      },
  
      onFilterChange(): void {
        this.fetchProjects({
          name: this.searchTerm,
          status: this.selectedStatus,
          sort: this.selectedSort
        });
      },
  
      goToProject(id: string | number): void {
        this.$router.push(`/project/${id}`);
      }
    },
  
    mounted() {
      this.fetchProjects();
      this.initColumnResize();
    }
  };
  </script>  
  
  
  <style scoped lang="scss">
  @mixin common-box-styles {
    margin: 15px;
    padding: 15px;
    background-color: #fff;
    box-shadow: 0px 2px 16px 0px rgba(0, 0, 0, 0.05);
    border-radius: 8px;
    display: flex;
    justify-content: center;
    }

    .table__container{
        flex-direction: column;
        display: flex;
        justify-content: center;
        margin-top: 50px;
    }

    .table__wrapper{
        @include common-box-styles;
    }

    .projects__table {
    width: 100%;
    border-collapse: collapse;
    border: 1px solid #ddd;
    }

    .projects__table th,
    .projects__table td {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: left;
    }

    .projects__table th {
    background-color: #5a3e8dbb;
    font-weight: bold;
    position: relative; 
    color: white;
    }

    .projects__table tr:nth-child(even) {
    background-color: #f9f9f9;
    }

    .projects__table tr:hover {
    background-color: #f1f1f1;
    }

    .resize-handle {
    position: absolute;
    top: 0;
    right: 0;
    width: 1px;
    height: 100%;
    cursor: ew-resize;
    background-color: #ccc;
    }

    .table__search{
        @include common-box-styles;
        gap: 10px;
    }

    .table__input{
        padding: 10px;
        border-radius: 5px;
        border: 1px solid #ccc;
        width: 200px;
    }

    .table__input:focus{
        outline: none;
        border-color: #34195d;
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
    .table__select{
        padding: 10px;
        border-radius: 5px;
        border: 1px solid #ccc;
        width: 150px;
    }
    .table__select:focus{
        outline: none;
        border-color: #34195d;
    }
    .table__bottom{
        @include common-box-styles;
        justify-content: center;
    }

  </style>
  