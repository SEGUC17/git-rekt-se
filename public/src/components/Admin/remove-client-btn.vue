<template>
    <el-button class="button is-danger" @click="showRemoveDialog">Remove</el-button>
</template>

<script>
  /**
   * This component represent a `Remove` Button.
   */
  import axios from 'axios';
  import { Admin } from '../../services/EndPoints';
  import adminAuth from '../../services/auth/adminAuth';
  import EventBus from '../../services/EventBus';

  export default {
    /**
     * Props used by this component.
     * data: Data that can be displayed in the row.
     * row: row Object representing the current row.
     */
    props: ['data', 'row'],
    /**
     * Methods used by this component.
     */
    methods: {
      /**
       * Show a confirm dialog.
       */
      showRemoveDialog() {
        this.$dialog.confirm({
          title: 'Remove Client',
          message: 'Are you sure you wish to delete this client?',
          hasIcon: true,
          cancelText: 'No',
          confirmText: 'Yes',
          type: 'is-danger',
          onConfirm: this.removeClient,
        });
      },
      /**
       * Remove a client.
       */
      removeClient() {
        axios
            .post(Admin().deleteClient(this.data), {}, {
              headers: {
                Authorization: adminAuth.getJWTtoken(),
              },
            })
            .then((response) => {
              this.$toast.open({
                message: response.data.message,
                type: 'is-success',
              });
              EventBus.$emit('ClientRemoved', this.row);
            })
            .catch((err) => {
              const errors = err.resposne.data.errors.map((err) => {
                if (typeof err === 'string') {
                  return err;
                }
                return err.msg;
              });

              EventBus.$emit('ClientRemoveError', errors);
            });
      },
    },
  };
</script>
