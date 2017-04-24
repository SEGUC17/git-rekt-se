<template>
    <div class="card">
        <div class="card-image" v-if="image">
            <figure class="image is-4by3">
                <img :src="image" alt="Image">
            </figure>
        </div>
        <div class="card-content">
            <div class="content">
                <slot name="content"></slot>
            </div>
        </div>
    </div>
</template>

<script>
  /**
   * This component represent a card with an image,
   * and content.
   */
  export default {
    /**
     * Props for the component.    
     */
    props: {
      image: {
        type: String,
        default: '',
      },
    },
  };
</script>

<style>
    .card {
        margin: 1em;
    }
</style>
