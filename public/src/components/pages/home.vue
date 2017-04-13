<template>
    <div class="home">
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
    
                    <div class="column is-3 is-offset-2">
                        <el-input placeholder="Keywords" icon="search" v-model="value"  size="large"> </el-input>
                    </div>
    
    
                    <div class="column is-2">
                        <el-select v-model="location" placeholder="Locations"  size="large">
                            <el-option v-for="item in locations" :label="item.label" :value="item.value" :key="item.value">
                            </el-option>
                        </el-select>
                    </div>
    
                    <div class="column is-2">
                        <el-select v-model="price" placeholder="Price range" size="large">
                            <el-option v-for="item in prices" :label="item.label" :value="item.value" :key="item.value">
                            </el-option>
                        </el-select>
                    </div>
    
                    <div class="column is-3">
                        <div class="field has-text-left">
                            <el-button size="large" type="success">Search</el-button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    
        <div class="how-it-works">
            <h3 class="title is-1 has-text-centered">
                How it Works
            </h3>
            <p class="subtitle has-text-centered">
                Bringing students and mentors together.
            </p>
    
            <div class="columns">
                <card class="column is-3 is-offset-1" image="http://localhost:3000/assets/imgs/home/search-online.svg">
                    <div slot="content" class="has-text-centered">
                        <h3>
                            Find Businesses
                        </h3>
                        <p>
                            Discover &amp; connect with great local businesses in your local neighborhood like dentists, hair stylists and more.
                        </p>
                    </div>
                </card>
    
                <card class="column is-3" image="http://localhost:3000/assets/imgs/home/find-listing.svg">
                    <div slot="content" class="has-text-centered">
                        <h3>
                            Find Service
                        </h3>
                        <p>
                            Discover &amp; connect with great local businesses in your local neighborhood like dentists, hair stylists and more.
                        </p>
                    </div>
                </card>
    
                <card class="column is-3" image="http://localhost:3000/assets/imgs/home/make-online-booking.svg">
                    <div slot="content" class="has-text-centered">
                        <h3>
                            Book Online
                        </h3>
                        <p>
                            Discover &amp; connect with great local businesses in your local neighborhood like dentists, hair stylists and more.
                        </p>
                    </div>
                </card>
    
            </div>
        </div>
    </div>
</template>

<script>
    import card from '../shared/gr-card.vue';
    export default {
        data() {
            return {
                locations: [{
                    label: 'Nasr City',
                    value: 'Nasr City',
                }],
                prices: [{
                    label: '100-200',
                    value: '100-200',
                }],
                price: '',
                location: '',
            }
        },
        components: {
            card,
        }
    };
</script>

<style>
    .extra-large {
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
        margin-bottom: 2em;
    }
    
    .how-it-works {
        padding: 0 3em;
        margin-top: 2em;
        margin-bottom: 2em;
    }
</style>
