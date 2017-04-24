<template>
  <el-button class="button is-danger" @click="showDeleteDialog">Delete</el-button>
</template>
<script>
 /**
  * This component allows the business to delete coupons.
  */
  import EventBus from '../../../services/EventBus';

  export default {
    /**
     * Props used by this component.
     * data: The Data.
     * row: The Current row.
     */
    props: ['data', 'row'],
    /**
     * Methods used by this component.
     */
    methods: {
      /**
       * Emit an event.
       */
      showDeleteDialog() {
        EventBus.$emit('showCouponDeleteDialog', this.row);
      },
    },
  };
</script>
