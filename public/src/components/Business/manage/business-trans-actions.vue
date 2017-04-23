<template>
    <div class="buttons">
        <el-button :disabled="row.status !== 'pending'" class="margin-btn button is-success" @click="showAcceptDialog">Confirm</el-button>
        <el-button :disabled="row.status !== 'pending'" class="button is-danger" @click="showRejectDialog">Reject</el-button>
    </div>
</template>
<script>
 /**
  * This component is for accepting and rejecting business transctions.
  */
  import EventBus from '../../../services/EventBus';

  export default {
    /**
     * Props used by this component.
     * data: Data in the current row.
     * row: The Current row.
     */
    props: ['data', 'row'],
    /**
     * All Methods used by this component.
     */
    methods: {
      /**
       * Emit an event.
       */
      showAcceptDialog() {
        EventBus.$emit('acceptTrans', this.row);
      },
      /**
       * Emit an event
       */
      showRejectDialog() {
        EventBus.$emit('refundTrans', this.row);
      },
    },
  };
</script>

<style>
.margin-btn {
    margin-bottom: 0.1em;
}
</style>
