<template>
    <div class="about">
        <section class="gr-content hero is-bold has-text-centered">
            <div class="hero-body">
                <div class="container intro-container">
                    <h1 class="extra-large white">
                        Fire up your career
                    </h1>
                    <h2 class="subtitle white">
                        Learn how our partners can help you land your dream job
                    </h2>
                </div>
    
                <div class="columns index-search has-text-centered">
    
                    <div class="column is-1"></div>
                    <div class="column is-3">
                        <div class="field has-text-centered">
                            <p class="control">
                                <input class="input" type="text" placeholder="Keyword(s) ...">
                            </p>
                        </div>
                    </div>
    
    
                    <div class="column is-3">
                        <div class="field has-text-centered">
                            <p class="control">
                                <input class="input" type="text" placeholder="Location ...">
                            </p>
                        </div>
                    </div>
    
                    <div class="column is-3">
                        <div class="field has-text-centered">
                            <p class="control">
                                <input class="input" type="text" placeholder="Price ...">
                            </p>
                        </div>
                    </div>
    
                    <div class="column is-2">
                        <div class="field has-text-left">
                            <button class="button is-primary">
                                          Search
                                    </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
    export default {
    
    };
</script>

<style>

    .extra-large{
        font-size: 4em;
        line-height: 1.2em;
    }

    .intro-container {
        padding: 5em;
    }
    
    .index-search {
        margin: auto !important;
        text-align: center;
        display: block;
    }
    
    .gr-content {
        background-image: url('http://localhost:3000/assets/imgs/idx_bg.jpg');
        margin-bottom: 0.5em;
    }
</style>
