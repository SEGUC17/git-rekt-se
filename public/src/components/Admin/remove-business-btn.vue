<template>
    <el-button class="button is-danger" @click="showRemoveDialog">Remove</el-button>
</template>

<script>
  import axios from 'axios';
  import { Admin } from '../../services/EndPoints';
  import adminAuth from '../../services/auth/adminAuth';
  import EventBus from '../../services/EventBus';

  export default {
    props: ['data', 'row'],
    methods: {
      showRemoveDialog() {
        this.$dialog.confirm({
          title: 'Remove Business',
          message: 'Are you sure you wish to delete this business?',
          hasIcon: true,
          cancelText: 'No',
          confirmText: 'Yes',
          type: 'is-danger',
          onConfirm: this.removeBusiness,
        });
      },

      removeBusiness() {
        axios
            .post(Admin().deleteBusiness(this.data), null, {
              headers: {
                Authorization: adminAuth.getJWTtoken(),
              },
            })
            .then((response) => {
              this.$toast.open({
                message: response.data.message,
                type: 'is-success',
              });
              EventBus.$emit('BusinessRemoved', this.row);
            })
            .catch((error) => {
              const errors = error.resposne.data.errors.map((err) => {
                if (typeof err === 'string') {
                  return err;
                }
                return err.msg;
              });

              EventBus.$emit('BusinessRemoveError', errors);
            });
      },
    },
  };
</script>
