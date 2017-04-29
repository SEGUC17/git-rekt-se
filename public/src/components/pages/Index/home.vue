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
            <el-input class="full-width" placeholder="Name" icon="search" v-model="name" size="large"></el-input>
          </div>
  
          <div class="column is-2">
            <el-select class="full-width" v-model="location" filterable clearable placeholder="Locations" size="large">
              <el-option v-for="loc in locations" :key="loc.value" :label="loc.label" :value="loc.value">
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
              <el-button size="large" type="success"
               @keydown.enter="searchClicked"
              @click="searchClicked">Search</el-button>
            </div>
          </div>
        </div>
      </div>
    </section>
    <div class="how-it-works">
      <h3 class="title is-2 is-bold has-text-left"> Top Services</h3>
      <hr>
      <div class="columns is-multiline">
        <card class="column is-3"
          v-for="(service, index) in topServices"
         :key="service._id"
         :class="{'is-offset-1': (index % 3 === 0)}" :image="`uploads/${service.coverImage || 'upload_image.svg'}`">
          <div slot="content" class="has-text-centered">
            <h3 class="title is-3">           
           <router-link class="dark-link" :to="`/service/${service._id}`">
           {{ service.name }}
          </router-link>
          </h3>
            <h4 class="subtitle is-6">{{ service._business.name }}</h4>
            <el-rate class="rating-home" :value="service._avgRating" disabled :max="5"></el-rate>
          </div>
        </card>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * This component represents the Home page.
 */
import axios from 'axios';
import card from '../../shared/gr-card.vue';
import locs from './mainLocations';
import priceRanges from './priceRanges';
import { Visitor } from '../../../services/EndPoints';

export default {
  /**
   * Data used by the component.
   * locations: List of pre-defined locations
   * List of pre-defined ranges.
   * name: Search name entered by user.
   * price: price range chosen by user.
   * location: Locations retrieve from the server.
   * loader: The loader Object, used when loading.
   */
  data() {
    return {
      locations: locs,
      topServices: [],
      prices: priceRanges,
      name: '',
      price: '',
      location: '',
      loader: '',
    };
  },
  /**
   * Methods used by the component.
   */
  methods: {
    /**
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
    * Get list of top rated services.
    */

    getTopRated() {
      axios
        .get(Visitor().topRated)
        .then((response) => {
          this.topServices = response.data.results;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    /**
     * Generate Search URI.
     */

    searchClicked() {
      const url = '/search';
      const params = {
        offset: 1,
        sort: 1,
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

  /**
   * Ran when component is mounted on DOM.
   * Fetch locations.
   */

  mounted() {
    this.getLocations();
    this.getTopRated();
  },

  /**
   * Sub-components, used by this component.
   */

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
  background-image: url('/assets/imgs/idx_bg.jpg');
  background-size: cover;
  margin-bottom: 2em;
}

.how-it-works {
  padding: 0 3em;
  margin-top: 3em;
  margin-bottom: 2em;
}

.full-width {
  width: 100%;
}

.rating-home .el-rate__icon{
    font-size: 22px !important;
}
</style>
