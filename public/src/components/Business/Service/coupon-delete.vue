<template>
  <el-button class="button is-danger" @click="showDeleteDialog">Delete</el-button>
</template>
<script>
  import EventBus from '../../../services/EventBus';

  export default {
    props: ['data', 'row'],
    methods: {
      showDeleteDialog() {
        EventBus.$emit('showCouponDeleteDialog', this.row);
      },
    },
  };
</script>
