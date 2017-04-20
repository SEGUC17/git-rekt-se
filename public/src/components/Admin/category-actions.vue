<template>
    <div class="buttons">
        <el-button class="button is-default" @click="showEditDialog">Edit</el-button>
        <el-button class="button is-danger" @click="showDeleteDialog">Delete</el-button>
    </div>
</template>

<script>
  import EventBus from '../../services/EventBus';

  export default {
    props: ['data', 'row'],
    methods: {
      showEditDialog() {
        EventBus.$emit('showEditDialog', this.row);
      },
      showDeleteDialog() {
        EventBus.$emit('showDeleteDialog', this.row);
      },
    },
  };
</script>

<style>

</style>