<template>
    <div class="service-page">

        <!-- Service Info -->
        <div class="hero service-info">
            <div class="hero-body">
                <div class="container">
                    <div class="service-categories is-spaced">
                            <span class="search-tag tag is-dark is-small" v-for="category in categories"
                                  :key="category._id">{{ category.title }}</span>
                    </div>
                    <div class="title is-2 white"> {{ name }} </div>

                    <div class="subtitle white">
                        <router-link class="white" :to="`/business/${businessId}`">{{ businessName }}</router-link>
                    </div>

                    <div class="subtitle white">{{ shortDescription }}</div>
                    <div class="rating">
                        <el-rate class="is-pulled-left" v-model="rating" disabled :max="5"></el-rate>
                    </div>

                    <router-link :to="`${$route.params.id}/book`"
                                 class="button white is-warning is-pulled-right"
                                 style="font-size: 1.2em">
                        Book Now

                    </router-link>
                </div>
            </div>
        </div>

        <!-- Service Description -->
        <div class="columns">
            <!-- Left Pane -->
            <div class="column is-7 is-offset-1">

                <!-- Service Description -->
                <div class="box">
                        <p>
                            {{ description }}
                        </p>
                </div>

                <!-- Navigation tabs -->
                <div class="tabs">
                    <ul>
                        <li @click="active = 1" :class="{ 'is-active': (active === 1) }"><a>Offerings</a></li>
                        <li @click="active = 2" :class="{ 'is-active': (active === 2) }"><a>Gallery</a></li>
                        <li @click="active = 3" :class="{ 'is-active': (active === 3) }"><a>Reviews</a></li>
                    </ul>
                </div>

                <!-- Offering Tab -->
                <transition name="fade">
                    <div class="offerings" v-show="active === 1">
                        <div class="box" v-for="offering in offerings">
                            <div class="content offerings">
                                <div class="offering">
                                    <h4> {{ offering.location }} </h4>

                                    <h6>
                                        <span><i class=" icon fa fa-location-arrow"></i></span>
                                        {{ getBranchAddress(offering.branch) }}
                                    </h6>

                                    <h6>
                                        <span><i class=" icon fa fa-calendar"></i></span>
                                        {{ offering.startDate | moment }}
                                    </h6>

                                    <h6>
                                        <span><i class=" icon fa fa-calendar"></i></span>
                                        {{ offering.endDate | moment }}
                                    </h6>

                                    <h6>
                                        <span><i class=" icon fa fa-money"></i></span>
                                        {{ offering.price }} EGP
                                    </h6>

                                </div>
                            </div>
                        </div>
                    </div>
                </transition>

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
                                <img :src="'uploads/' + item.path" class="extended"/>
                            </el-carousel-item>
                        </el-carousel>
                    </div>
                </transition>

                <!-- Reviews Tab -->

                <div class="columns" v-show="active === 3">
                    <div class="column">
                        <a href="#" class="button is-primary is-pulled-right">Add Review</a>
                    </div>
                </div>

                <transition name="fade">
                    <div class="no-reviews" v-show="active === 3" v-if="reviews.length === 0">
                        <h3 class="title has-text-centered">
                            No Reviews found.
                        </h3>
                    </div>

                    <div class="reviews" v-if="reviews.length > 0" v-show="active === 3">
                        <div class="box" v-for="review in reviews">
                            <div class="content reviews-content">
                                <div class="review">
                                    <h4> {{ review._client.firstName }} {{ review._client.lastName }} </h4>
                                    <el-rate class="rating-search" :value="review.rating"
                                             disabled :max="5"></el-rate>
                                    <br>
                                    <p> {{ review.description }} </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </transition>
            </div>

            <!-- Right Pane -->
            <div class="column is-3">
                <div class="panel">
                    <p class="panel-heading"> Related Services </p>
                    <a class="dark-link panel-block"
                       @click.prevent="getRelatedService(service._id)"
                       v-for="service in relatedServices"
                       :key="service._id"
                       :href="`/service/${service._id}`">
                        <figure class="related-image image is-64x64" v-if="service.coverImage">
                            <img :src="'uploads/' + service.coverImage" alt="Image">
                        </figure>
                        <p>
                            {{ service.name }}
                        </p>
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
  import axios from 'axios';
  import {Service} from '../../services/EndPoints';

  export default {
    data() {
      return {
        name: '',
        shortDescription: '',
        description: '',
        coverImage: '',
        businessName: '',
        businessId: '',
        businessEmail: '',
        businessShortDescription: '',
        businessDescription: '',
        businessPhoneNumbers: null,
        businessGallery: null,
        businessWorkingHours: null,
        branches: [],
        reviews: [],
        gallery: [],
        activeName: 'first',
        categories: [],
        offerings: [],
        relatedServices: [],
        current: '',
        errors: [],
        active: 1,
        rating: 0,
      };
    },
    methods: {
      getBranchAddress(offering) {
        const result = this.branches.find(branch => branch._id === offering);
        if (result) {
          return result.address;
        }
        return 'No Address.';
      },

      getRelatedService(serviceId) {
        this.$router.push(`/service/${serviceId}`);
        this.getService(serviceId);
      },

      // send get request to obtain service info using service id

      getService(serviceId = this.$route.params.id) {
        const loader = this.$loading({
          fullscreen: true,
        });
        axios.get(Service().viewService(serviceId)).then((res) => {
          const service = res.data;
          this.name = service.name;
          this.shortDescription = service.shortDescription;
          this.description = service.description;
          this.businessName = service.businessName;
          this.businessId = service.businessId;
          this.coverImage = service.coverImage;
          this.branches = service.branches;
          this.reviews = service.reviews;
          this.gallery = service.gallery;
          this.categories = service.categories;
          this.offerings = service.offerings;
          this.rating = service.rating;
          this.getRelatedServices(loader);
        }).catch((error) => {
          loader.close();
          this.errors = error.response.data.errors.map((err) => {
            if (typeof err === 'string') {
              return err;
            }
            return err.msg;
          });
        });
      },
      // obtains 3 related services from on of the categories
      getRelatedServices(loader) {
        if (this.categories.length === 0) {
          loader.close();
          return;
        }
        axios
            .get(Service().viewRelatedServices(this.categories[0]._id, 1))
            .then((res) => {
              loader.close();
              this.relatedServices = res.data.results;
              this.relatedServices = this.relatedServices
                  .filter(service => service._id !== this.$route.params.id);
            }).catch(() => {
          loader.close();
          this.relatedServices = [];
        });
      },
      goTo(relatedID) {
        this.$router.push((relatedID));
        this.$router.go((relatedID));
      },
    },
    mounted() {
      this.getService();
    },
  };
</script>

<style>
    .service-info {
        background: #c0392b; /* fallback for old browsers */
        background: -webkit-linear-gradient(to right, #8e44ad, #c0392b); /* Chrome 10-25, Safari 5.1-6 */
        background: linear-gradient(to right, #8e44ad, #c0392b); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
        margin-bottom: 2em;
    }

    .related-image {
        margin: 0.5em;
    }

    .panel-block.is-active {
        border-left-color: #dbdbdb;
    }

    /*
     Transition.
    */

    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s
    }

    .fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */
    {
        opacity: 0
    }

    .white a:hover {
        color: #dbdbdb;
    }

    .el-carousel {
        background: #eee;
    }
</style>
