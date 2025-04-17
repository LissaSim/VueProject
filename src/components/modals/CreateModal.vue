<template>
    <div class="create__wrapper" :class="{ 'create__wrapper--active': isOpen }" @click="handleClose">
      <div class="create__popup" @click.stop>
        <div class="create__title">
          Add new Project
        </div>
        <div class="create__inpur__group">
          <p class="create__descr">Enter name of the new project</p>
          <input
            type="text"
            v-model="newName"
          />
          <p v-if="error" style="color: red">{{ error }}</p>
        </div>
        <div class="create__inpur__group">
          <p class="create__descr">Enter description of the new project (optional)</p>
          <input
            type="text"
            v-model="newDescription"
          />
          <p v-if="error" style="color: red">{{ error }}</p>
        </div>
          <button class="btn" @click="handleAdd">
            Add
          </button>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import { mapActions } from 'vuex';
  
  export default defineComponent({
    name: 'CreateModal',
  
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
        error: '',
      };
    },
  
    methods: {
      ...mapActions(['addProject']),
  
      handleClose() {
        this.$emit('close');
        this.error = '';
        this.newName = '';
        this.newDescription = '';
      },
  
      async handleAdd() {
        if (!this.newName.trim()) {
          this.error = 'Name can not be empty';
          return;
        }
  
        try {
          await (this).addProject({
            name: this.newName,
            description: this.newDescription,
            tasksCount: 0,
            status: 'Active',
            createdAt: new Date().toISOString(),
          });
  
          this.$emit('project-added');
          this.handleClose();
        } catch (error) {
          this.error = 'Failed to add project';
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