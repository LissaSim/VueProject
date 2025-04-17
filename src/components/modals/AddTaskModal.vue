<template>
    <div class="create__wrapper" :class="{ 'create__wrapper--active': isOpen }" @click="handleClose">
      <div class="create__popup" @click.stop>
        <div class="create__title">
          Add new Task
        </div>
  
        <div class="create__inpur__group">
          <p class="create__descr">Enter name of the new task</p>
          <input type="text" v-model="newName" />
          <p v-if="error" style="color: red">{{ error }}</p>
        </div>
  
        <div class="create__inpur__group">
          <p class="create__descr">Select implementer</p>
          <select v-model="implementer" class="create__select">
            <option disabled value="">Choose a person</option>
            <option v-for="person in implementersList" :key="person" :value="person">
              {{ person }}
            </option>
          </select>
        </div>
  
        <div class="create__inpur__group">
          <p class="create__descr">Set a deadline</p>
          <input type="date" v-model="deadline" />
        </div>
  
        <button class="btn" @click="handleAdd">Add</button>
      </div>
    </div>
  </template>  
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import { mapActions } from 'vuex';
  import { v4 as uuidv4 } from 'uuid';
  
  interface Task {
    id: string;
    name: string;
    description: string;
    implementer: string;
    deadline: string;
    createdAt: string;
    status: string;
  }
  
  export default defineComponent({
    name: 'AddTaskModal',
  
    props: {
      isOpen: {
        type: Boolean,
        required: true,
      },
    },
  
    data() {
      return {
        newName: '',
        newDescription: '',
        implementer: '',
        deadline: '',
        error: '',
        status: '',
        implementersList: ['Alisa S.', 'Nikita L.', 'Julia K.'],
      };
    },
  
    methods: {
      ...mapActions(['addTask']),
  
      handleClose() {
        this.$emit('close');
        this.error = '';
        this.newName = '';
        this.newDescription = '';
        this.implementer = '';
        this.deadline = '';
      },
  
      async handleAdd(): Promise<void> {
        if (!this.newName.trim()) {
          this.error = 'Task name cannot be empty';
          return;
        }
  
        const task: Task = {
          id: uuidv4(),
          name: this.newName,
          description: this.newDescription,
          implementer: this.implementer,
          deadline: this.deadline,
          status: 'To do',
          createdAt: new Date().toISOString(),
        };
  
        try {
          await (this).addTask({
            projectId: (this.$route.params).id,
            task,
          });
  
          this.$emit('added', task);
          this.handleClose();
        } catch (error) {
          this.error = 'Error while saving task';
        }
      },
    },
  });
  </script>   
  

<style lang="scss" scoped>
  .create__wrapper {
  height: 100vh;
  width: 100vw;
  background-color: rgba(0, 0, 0, 0.4);
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: all 0.3s;

  &--active {
    opacity: 1;
    pointer-events: all;
    background-color: rgba(0, 0, 0, 0.1);
  }
}

.create__popup {
  max-width: 600px;
  width: 100%;
  padding: 40px;
  gap: 20px;
  border-radius: 8px;
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  z-index: 100;
  color: black;
  position: relative;

  .create__title {
    font-size: 24px;
    font-weight: 500;
    text-align: center;
  }

  .create__inpur__group {
    display: flex;
    flex-direction: column;
    gap: 10px;

    input {
        padding: 10px;
        border-radius: 5px;
        border: 1px solid #ccc;
        width: 100%;
    }

    input:focus{
        outline: none;
        border-color: #34195d;
    }
  }

.create__select{
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
    width: 100%;
}

.create__select:focus{
outline: none;
border-color: #34195d;
}
  .create__descr{
    font-size: 18px
  }

  .btn{
        padding: 10px 20px;
        background-color: #34195d;
        color: #fff;
        border: none;
        min-width: 200px;
        border-radius: 5px;
        align-self: center;
        cursor: pointer;
    }
    .btn:hover{
        background-color: #5a3e8d;
    }
}
</style>