<template>
    <div class="card is-paddingless">
        <div class="card-image" v-if="image">
            <figure class="image is-square">
                <img :src="image" alt="Image">
            </figure>
        </div>
        <div class="card-content">
                <slot name="content"></slot>
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
    height: 100%;
    margin: 0.5em;
}

.card-image:hover {
    opacity: 0.8;
}

</style>
