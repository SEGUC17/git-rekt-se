<template>
    <div class="buttons">
        <el-button class="button is-default" @click="showEditDialog">Edit</el-button>
        <el-button class="button is-danger" @click="showDeleteDialog">Delete</el-button>
    </div>
</template>

<script>
 /**
  * This component represents the actions that can be done
  * on the categories.
  */
  import EventBus from '../../services/EventBus';

  export default {
    /**
     * Props used by this attribute.
     */
    props: ['data', 'row'],
    /**
     * Methods used by this component.
     */
    methods: {
      /**
       * Emit an event, to be handled in parent component.
       */
      showEditDialog() {
        EventBus.$emit('showEditDialog', this.row);
      },
      /**
       * Emit an event, to be handled in parent component.
       */
      showDeleteDialog() {
        EventBus.$emit('showDeleteDialog', this.row);
      },
    },
  };
</script>
