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

                    <div class="column is-3 is-offset-2 is-12-mobile">
                        <el-input class="full-width" placeholder="Name" icon="search" v-model="name"
                                  size="large"></el-input>
                    </div>

                    <div class="column is-2">
                        <el-select class="full-width" v-model="location" filterable clearable placeholder="Locations"
                                   size="large">
                            <el-option v-for="loc in locations" :key="loc.value" :label="loc.label"
                                       :value="loc.value">
                            </el-option>
                        </el-select>
                    </div>

                    <div class="column is-2">
                        <el-select class="full-width" v-model="price" placeholder="Price range" size="large">
                            <el-option v-for="item in prices" :label="item.label" :value="item.value" :key="item.value">
                            </el-option>
                        </el-select>
                    </div>

                    <div class="column is-3">
                        <div class="field has-text-left">
                            <el-button size="large" type="success" @keydown.enter="searchClicked"
                                       @click="searchClicked">Search




                            </el-button>
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
                            Get valuable insights about the services and tell other readers about your experiences by leaving reviews for services.
                        </p>
                    </div>
                </card>

                <card class="column is-3" image="http://localhost:3000/assets/imgs/home/make-online-booking.svg">
                    <div slot="content" class="has-text-centered">
                        <h3>
                            Book Online
                        </h3>
                        <p>
                            Easily setup an appointment directly from the business listing page using our integrated booking options.
                        </p>
                    </div>
                </card>

            </div>
        </div>
    </div>
</template>

<script>
  import axios from 'axios';
  import card from '../../shared/gr-card.vue';
  import locs from './mainLocations';
  import priceRanges from './priceRanges';
  import {Visitor} from '../../../services/EndPoints';

  export default {
    data() {
      return {
        locations: locs,
        prices: priceRanges,
        name: '',
        price: '',
        location: '',
        loader: '',
      };
    },
    methods: {

        /*
         * Get list of locations from API.
         */

      getLocations() {
        this.loader = this.$loading({
          fullscreen: true,
        });
        axios
            .get(Visitor().locations)
            .then((res) => {
              this.loader.close();
              this.locations = res.data;
            })
            .catch(() => {
              this.loader.close();
              this.locations = locs;
            });
      },
        /*
         * Generate search URI.
         */

      searchClicked() {
        const url = '/search';
        const params = {
          offset: 1,
        };

        if (this.name) {
          params.name = this.name;
        }

        const priceRange = this.price.split('-');

        if (priceRange.length === 2) {
          const min = parseInt(priceRange[0], 10);
          const max = parseInt(priceRange[1], 10);
          if (!isNaN(min) && !isNaN(max)) {
            params.min = min;
            params.max = max;
          }
        }

        if (this.location) {
          params.location = this.location;
        }

        this.$router.push({
          path: url,
          query: params,
        });
      },
    },

    mounted() {
      this.getLocations();
    },

    components: {
      card,
    },

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

    .full-width {
        width: 100%;
    }

</style>
