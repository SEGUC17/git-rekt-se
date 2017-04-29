<template>
    <div class="business-page">
        <!-- Business Info -->
        <div class="hero bus-page-top">
            <div class="hero-body">
                <div class="container">
                    <div class="service-categories is-spaced">
                        <span class="search-tag tag is-dark is-small" v-for="category in categories" :key="category._id">{{ category.title }}</span>
                    </div>
                    <div class="title is-2 white"> {{ name }} </div>
    
                    <div class="subtitle white">{{ shortDescription }}</div>
    
                    <div class="subtitle white is-marginless">
                        <span><i class="icon is-medium fa fa-envelope" style="padding-top: 0.25em"></i></span> {{ email }}
    
                    </div>
                    <div class="subtitle white is-marginless">
                        <span><i class="icon is-medium fa fa-phone" style="padding-top: 0.25em"></i></span>
                        <span v-for="num in phoneNumbers">{{ num }} </span>
                    </div>
                    <div class="workinghours">
                        <div class="subtitle white is-marginless">
                            <span><i class="icon is-medium fa fa-clock-o" style="padding-top: 0.25em"></i></span> Working Hours
    
                        </div>
                        <pre class="subtitle white" style="padding-left: 1.9em">{{ workingHours }}</pre>
                    </div>
    
                </div>
            </div>
        </div>
    
        <!-- Business Description -->
        <div class="columns">
            <!-- Left Pane -->
            <div class="column is-7 is-offset-1">
    
                <!-- Business Full Description -->
                <div class="box">
                    <pre class="content is-marginless">{{ description || "No Description."}}</pre>
                </div>
    
                <!-- Navigation tabs -->
                <div class="tabs">
                    <ul>
                        <li @click="active = 1" :class="{ 'is-active': (active === 1) }"><a>Services</a></li>
                        <li @click="active = 2" :class="{ 'is-active': (active === 2) }"><a>Gallery</a></li>
                        <li @click="active = 3" :class="{ 'is-active': (active === 3) }"><a>Branches</a></li>
                    </ul>
                </div>
    
                <!-- Gallery Tab -->
                <transition name="fade">
                    <div class="no-gallery" v-show="active === 2" v-if="gallery.length === 0">
                        <h3 class="title has-text-centered">
                                        No Gallery found.
                                    </h3>
                    </div>
                    <div class="gallery" v-if="gallery.length > 0" v-show="active === 2">
                        <el-carousel :interval="1000" arrow="always">
                            <el-carousel-item v-for="item in gallery" v-bind:data="item" v-bind:key="item">
                                <img :src="'uploads/' + item.path" class="extended" />
                            </el-carousel-item>
                        </el-carousel>
                    </div>
                </transition>
    
                <!-- Branches Tab -->
                <transition name="fade">
                    <div class="branches" v-show="active === 3">
                        <div class="box" v-for="branch in branches">
                            <div class="content branches">
                                <div class="branch">
                                    <h4> {{ branch.location }} </h4>
                                    <h6>
                                        <span><i class=" icon fa fa-location-arrow"></i></span>                                                    
                                        <a href="#" class="dark-link" @click.prevent="showMap(branch)">
                                                            {{ branch.address }}
                                        </a>
                                <el-tooltip content="View Map" placement="bottom">
                                <a href="#" class="dark-link" @click.prevent="showMap(branch)">
                                    {{ branch.address }}
                                </a>
                                </el-tooltip>
                        <el-dialog
                        :title=branch.address
                        v-model="branch.showPopover">
                        <gmap-map
                                :center="branch.mapLocation"
                                :zoom="30"
                                size="large"
                                class="max-dialog"
                                map-type-id="terrain"
                                style="width: 100%; height: 20em"
                        >
                        <gmap-marker :position="branch.mapLocation" :clickable="true" :draggable="false"></gmap-marker>
                        </gmap-map>
                        </el-dialog>
                                    </h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </transition>
    
                <!-- Services Tab -->
                <transition name="fade">
                    <div class="no-services" v-show="active === 1" v-if="services.length === 0">
                        <h3 class="title has-text-centered">
                                    No Services found.
                                </h3>
                    </div>
                    <div class="services" v-show="active === 1" v-if="services.length > 0">
                        <router-link :to="`/service/${service._id}`" class="service-search-result box" v-for="service in services" :key="service._id">
                            <div class="content services">
                                <div class="service">
                                    <h4> {{ service.name }} </h4>
                                    <h6>
                                                <span><i class=" icon fa fa-edit"></i></span>
                                                {{ service.shortDescription }}
                                            </h6>
                                    <el-rate class="rating-search" :value="service._avgRating" disabled :max="5">
                                    </el-rate>
                                </div>
                            </div>
                        </router-link>
                    </div>
                </transition>
            </div>
    
            <!-- Right Pane -->
            <div class="column is-3">
                <!-- Related -->
                <div class="panel">
                    <p class="panel-heading"> Related Businesses </p>
                    <a class="dark-link panel-block" @click.prevent="relatedView(bus._id)" v-for="bus in related" :key="bus._id" :href="`/business/${bus._id}`">
                        <p>
                            {{ bus.name }}
                        </p>
                    </a>
                </div>
            </div>
        </div>
    
    </div>
</template>

<script>
/**
 * This component is responsible for Editing the Business Info.
 */
import axios from 'axios';
import { Visitor } from '../../../services/EndPoints';

export default {
    /**
     * Data used by this component.
     * id: Business ID.
     * name: Business Name.
     * active: which component is active.
     * email: Business Email.
     * loader: Loader Object for loading view.
     * shortDescription: Business' Short Description.
     * gallery: Business' Gallery.
     * phoneNumbers: Business' Phone Numbers.
     * description: Business' Description.
     * categories: Business' Categories.
     * branches: Business's branches.
     * services: Business's Services.
     * related: Related Businesses.
     */
  data() {
    return {
      id: '',
      name: '',
      active: 1,
      email: '',
      loader: '',
      shortDescription: '',
      gallery: [],
      phoneNumbers: [],
      description: '',
      workingHours: '',
      categories: [],
      branches: [],
      services: [],
      related: [],
    };
  },
    /**
     * Ran when component is mounted on DOM.
     * Fetches the Business with a specific ID.
     */
  mounted() {
    this.load(this.$route.params.id);
  },
    /**
     * All Methods used by this component.
     */
  methods: {
    /*
    * Show google map.
    */
    showMap(branch) {
      branch.showPopover = true;
      axios
            .get(`http://maps.googleapis.com/maps/api/geocode/json?address=${branch.address}&sensor=false`)
            .then((response) => {
              const loc = response.data.results[0].geometry.location;
              branch.mapLocation = {
                lat: loc.lat,
                lng: loc.lng,
              };
            });
    },

        /**
         * Go to a service.
         */
    viewService(service) {
      const serviceID = service._id;
      const url = `/service/${serviceID}`;
      this.$router.push(url);
    },
        /**
         * Book a service.
         */
    bookService(service) {
      const serviceID = service._id;
      const url = `/service/${serviceID}/book`;
      this.$router.push(url);
    },
        /**
         * Go to a related Business.
         */
    relatedView(id) {
      const url = `/business/${id}`;
      this.$router.push(url);
      this.load(id);
    },
        /**
         * Load a business with a specific ID.
         */
    load(id) {
      this.loader = this.$loading({
        fullscreen: true,
      });
      axios.get(Visitor().viewBusiness(id))
                .then((business) => {
                  this.id = business.data.id;
                  this.name = business.data.name;
                  this.email = business.data.email;
                  this.shortDescription = business.data.shortDescription;
                  this.gallery = business.data.gallery;
                  this.phoneNumbers = business.data.phoneNumbers;
                  this.description = business.data.description;
                  this.workingHours = business.data.workingHours;
                  this.categories = business.data.categories;
                  this.branches = business.data.branches.map((branch) => {
                    branch.showPopover = false;
                    branch.mapLocation = {};
                    return branch;
                  });
                  this.services = business.data.services;

                  axios.get(Visitor().relatedBusiness(this.categories[0]._id, 1))
                        .then((res) => {
                          this.loader.close();
                          this.related = res.data.results;
                          this.related = this.related
                                .filter(bus => bus._id !== this.$route.params.id);
                        })
                        .catch(() => {
                          this.loader.close();
                          this.$router.push('/404');
                        });
                })
                .catch(() => {
                  this.loader.close();
                  this.$router.push('/404');
                });
    },
  },
};
</script>

<style>
.bus-page-top {
    background: #cb2d3e;
    /* fallback for old browsers */
    background: -webkit-linear-gradient(to right, #ef473a, #cb2d3e);
    /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to right, #ef473a, #cb2d3e);
    /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    margin-bottom: 2em;
}
</style>
