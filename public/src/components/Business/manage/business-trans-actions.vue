<template>
    <div class="buttons">
        <el-button :disabled="row.status !== 'pending'" class="margin-btn button is-success" @click="showAcceptDialog">Confirm</el-button>
        <el-button :disabled="row.status !== 'pending'" class="button is-danger" @click="showRejectDialog">Reject</el-button>
    </div>
</template>
<script>
  import EventBus from '../../../services/EventBus';

  export default {
    props: ['data', 'row'],
    methods: {
      showAcceptDialog() {
        EventBus.$emit('acceptTrans', this.row);
      },
      showRejectDialog() {
        EventBus.$emit('refundTrans', this.row);
      },
    },
  };</script>
<style>
.margin-btn {
    margin-bottom: 0.1em;
}
</style>
