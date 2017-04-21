<template>
    <section class="top-hero hero is-bold">
        <div class="hero-body">
            <div class="container">
                <h1 class="title extra-large white" v-if="title">
                    {{ title }}
                </h1>
                <p class="subtitle white" v-if="subtitle">
                    {{ subtitle }}
                </p>
            </div>
        </div>
    </section>
</template>

<script>
  export default{
    props: ['title', 'subtitle'],
  };
</script>
<style>
    .top-hero {
        margin-bottom: 2em;
    }
</style>
