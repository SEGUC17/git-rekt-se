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
            <router-link class="white" :to="`/business/${businessId}`">{{ businessName }}

            </router-link>
          </div>

          <div class="subtitle white">{{ shortDescription }}</div>
          <div class="rating">
            <el-rate class="is-pulled-left" v-model="rating" disabled :max="5"></el-rate>
          </div>

          <router-link :to="`${$route.params.id}/book`"
                       class="button white is-warning is-pulled-right" style="font-size: 1.2em">
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
          <pre class="content is-marginless">{{ description || "No Description."}}</pre>
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
                    <el-tooltip content="View Map" placement="bottom">
                      <a href="#" class="dark-link" @click.prevent="showMap(offering)">
                        {{ getBranchAddress(offering.branch) }}
                          </a>
                    </el-tooltip>
                    <el-dialog
                            :title=getBranchAddress(offering.branch)
                            v-model="offering.showPopover">
                      <gmap-map
                              :center="offering.mapLocation"
                              :zoom="30"
                              size="large"
                              class="max-dialog"
                              map-type-id="terrain"
                              style="width: 100%; height: 20em"
                      >
                        <gmap-marker :position="offering.mapLocation" :clickable="true"
                                     :draggable="false"></gmap-marker>
                      </gmap-map>
                    </el-dialog>
                  </h6>
                  <h6>
                    <span><i class=" icon fa fa-calendar"></i></span> {{ offering.startDate | moment }}
                            </h6>

                  <h6>
                    <span><i class=" icon fa fa-calendar"></i></span> {{ offering.endDate | moment }}
                            </h6>

                  <h6>
                    <span><i class=" icon fa fa-money"></i></span> {{ offering.price }} EGP
                            </h6>

                </div>
              </div>
            </div>
          </div>
        </transition>


        <div class="no-gallery" v-show="active === 1" v-if="offerings.length === 0">
            <h3 class="title has-text-centered">
              No Offerings found.
            </h3>
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
                <img :src="'uploads/' + item.path" class="extended"/>
              </el-carousel-item>
            </el-carousel>
          </div>
        </transition>

        <!-- Reviews Tab -->

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
                  <el-button-group class="is-pulled-right">
                    <el-button icon="information" @click="showReport(review)"
                               v-if="clientID && !review.hasReported"></el-button>
                    <el-button icon="edit" @click="showEdit(review)"
                               v-if="`${review._client._id}` === `${clientID}`">
                    </el-button>
                    <el-button type="danger" icon="delete" @click="showDelete(review)"
                               v-if="`${review._client._id}` === `${clientID}`">
                    </el-button>
                  </el-button-group>
                  <el-rate class="rating-search" :value="review.rating" disabled :max="5"></el-rate>
                  <br>
                  <p class="non-breaking"> {{ review.description }} </p>
                </div>
              </div>
            </div>
          </div>
        </transition>
        <br>
        <div class="columns" v-show="active === 3">
          <div class="column">
            <el-alert type="success" class="error" show-icon v-if="editReviewSuccess"
                      :title="editReviewSuccess"></el-alert>
            <el-alert type="success" class="error" show-icon v-if="deleteReviewSuccess"
                      :title="deleteReviewSuccess"></el-alert>

            <create-review v-if="clientID" :serviceID="serviceID"
                           @created="handleCreate"></create-review>
            <div class="box" v-else>
              <h3 class="title is-4"> Leave a review... </h3>
              <hr>
              <el-form label-position="top">
                <el-form-item label="Rating" required>
                  <el-rate disabled></el-rate>
                </el-form-item>
                <el-form-item label="Review">
                  <el-input type="textarea" disabled
                            placeholder="Enter your review here (Max 512 characters)"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-popover ref="popover" placement="top-start" title="Cannot Leave Review"
                              width="200" trigger="hover"
                              content="You need to be logged in to leave a review.">
                  </el-popover>
                  <el-button v-popover:popover type="primary">Create</el-button>
                </el-form-item>
              </el-form>
            </div>
            <edit-review :serviceID="serviceID" :review="reviewToEdit" :visible="editReviewVisible"
                         @edited="handleEdit" @cancelEdit="handleEditCancel"></edit-review>
            <delete-review :serviceID="serviceID" :reviewID="reviewToDelete._id"
                           :visible="deleteReviewVisible" @deleted="handleDelete"
                           @cancelDelete="handleDeleteCancel"></delete-review>
          </div>
        </div>
      </div>

      <!-- Right Pane -->
      <div class="column is-3">
        <div class="panel">
          <p class="panel-heading"> Related Services </p>
          <a class="dark-link panel-block" @click.prevent="getRelatedService(service._id)"
             v-for="service in relatedServices" :key="service._id"
             :href="`/service/${service._id}`">
            <figure class="related-image image is-64x64" v-if="service.coverImage">
              <img :src="'uploads/' + service.coverImage" alt="Image">
            </figure>
            <p>{{ service.name }}</p>
          </a>
        </div>
      </div>

    </div>

    <!-- Review Report Dialog-->
    <el-dialog title="Confirm Report" v-model="reportReview" size="tiny">
      <span>Are you sure you want to report this review ?</span>
      <span slot="footer" class="dialog-footer">
                  <button class="button is-default"
                          @click.prevent="reportReview = false">Cancel</button>
                  <button class="button is-danger" @click.prevent="sendReport">Confirm</button>
                </span>
    </el-dialog>

  </div>
</template>


<script>
  /**
   * This component is responsible for viewing the service's info.
   */
  import axios from 'axios';
  import { Service, Client } from '../../services/EndPoints';
  import ClientAuth from '../../services/auth/clientAuth';
  import CreateReview from './Review/createReview.vue';
  import EditReview from './Review/editReview.vue';
  import DeleteReview from './Review/deleteReview.vue';

  export default {
    /**
     * Data used by this component.
     * serviceID: The ID of the desired Service.
     * name: Sevice Name.
     * shortDescription: Service's Short Description.
     * description: Service's Description.
     * coverImage: Service's Cover Image.
     * businessName: Business Offering this Service.
     * businessId: Business' ID.
     * businessShortDescription: Business' Short Description.
     * businessPhoneNumbers: Business' Phone Numbers.
     * businessGallery: Business' Gallery.
     * businessWorkingHours: Business' Working Hours.
     * Branches: Branches in which this service is offered at.
     * reviews: Reviews about this service.
     * Gallery: Service Gallery.
     * categories: Service's Categories.
     * Offerings: Service's Offerings.
     * relatedServices: Services Related to this services.
     * errors: Errors received from the server.
     * active: Which tab is active.
     * rating: Service Rating.
     * reportReview: true to show a dialog, false otherwise.
     * reportReview: Review to report.
     * clientID: Current Client's ID.
     * editReviewVisible: true if Edit Review is visible, false otherwise.
     * reviewToEdit: Object holding information for editing a review.
     * reviewToDelete: Which review to delete.
     * editReviewSuccess: Message shown when Editing a review is successful.
     * deleteReviewSuccess: Message shown when Deleting a review is successful.
     */
    data() {
      return {
        serviceID: this.$route.params.id,
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
        reportReview: false,
        reviewToReport: '',
        clientID: ClientAuth.user.userID(),
        editReviewVisible: false,
        deleteReviewVisible: false,
        reviewToEdit: {
          _id: '',
          rating: undefined,
          description: '',
        },
        reviewToDelete: {},
        editReviewSuccess: '',
        deleteReviewSuccess: '',
      };
    },
    /**
     * Sub-components used by this component.
     */
    components: {
      CreateReview,
      EditReview,
      DeleteReview,
    },
    /**
     * Methods used by this component.
     */
    methods: {
      /**
       * Takes the services offering anf gets the corresponding branch.
       * @param {Offering} offering
       * @returns {string}
       */
      getBranchAddress(offering) {
        const result = this.branches.find(branch => branch._id === offering);
        if (result) {
          return result.address;
        }
        return 'No Address.';
      },
      /*
       * Gets the geolocation of a certain address.
       */
      showMap(offering) {
        offering.showPopover = true;
        axios
            .get(`http://maps.googleapis.com/maps/api/geocode/json?address=${offering.address}&sensor=false`)
            .then((response) => {
              const loc = response.data.results[0].geometry.location;
              offering.mapLocation = {
                lat: loc.lat,
                lng: loc.lng,
              };
            });
      },

      /**
       * Gets a related service.
       * @param {mongoose.ObjectId} serviceId
       */
      getRelatedService(serviceId) {
        this.$router.push(`/service/${serviceId}`);
        this.getService(serviceId);
      },

      /**
       * Gets all the service's info.
       * @param {mongoose.ObjectId} serviceId
       */
      getService(serviceId = this.serviceID) {
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
          this.reviews = service.reviews.map((review) => {
            review.hasReported = false;
            return review;
          });
          this.gallery = service.gallery;
          this.categories = service.categories;
          this.offerings = service.offerings.map((offering) => {
            offering.showPopover = false;
            offering.mapLocation = {};
            return offering;
          });
          this.rating = service.rating;
          this.getRelatedServices(loader);
        }).catch(() => {
          loader.close();
          this.$router.push('/404');
        });
      },
      /**
       * Get related services
       */
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
      /**
       * Go to a service.
       */
      goTo(relatedID) {
        this.$router.push((relatedID));
        this.$router.go((relatedID));
      },
      /**
       * Show the Edit Review Component.
       */
      showEdit(review) {
        this.reviewToEdit = {
          _id: review._id,
          rating: review.rating,
          description: review.description,
        };
        this.editReviewVisible = true;
      },
      /**
       * Show the Delete Review Component.
       */
      showDelete(review) {
        this.reviewToDelete = review;
        this.deleteReviewVisible = true;
      },
      /**
       * Show the Report Review Dialog.
       */
      showReport(review) {
        this.reviewToReport = review;
        this.reportReview = true;
      },
      /**
       * Reports a review.
       */
      sendReport() {
        const loader = this.$loading({
          fullscreen: true,
        });

        axios
            .post(Client().reportReview(this.reviewToReport._id), {}, {
              headers: {
                Authorization: ClientAuth.getJWTtoken(),
              },
            })
            .then((response) => {
              this.$toast.open({
                message: response.data.message,
                type: 'is-success',
                position: 'bottom',
              });
              this.reportReview = false;
              this.reviewToReport.hasReported = true;
              this.errors = [];
              loader.close();
            })
            .catch((error) => {
              this.reportReview = false;
              this.errors = error.response.data.errors.map((err) => {
                if (typeof err === 'string') {
                  return err;
                }
                return err.msg;
              });
              loader.close();
            });
      },
      /**
       * Gets the service Info when creating a review.
       */
      handleCreate() {
        this.getService();
      },
      /**
       * Gets the service Info when editing a review.
       */
      handleEdit(successMessage) {
        this.reviewToEdit = {
          rating: undefined,
          description: '',
        };
        this.editReviewSuccess = successMessage;
        this.editReviewVisible = false;
        this.getService();
      },
      /**
       * Gets the service Info when deleting a review.
       */
      handleDelete(successMessage) {
        this.reviewToDelete = {};
        this.deleteReviewSuccess = successMessage;
        this.deleteReviewVisible = false;
        this.getService();
      },
      /**
       * Handles canceling editing a review.
       */
      handleEditCancel() {
        this.reviewToEdit = {
          rating: undefined,
          description: '',
        };
        this.editReviewVisible = false;
      },
      /**
       * Handles canceling editing a review.
       */
      handleDeleteCancel() {
        this.reviewToDelete = {};
        this.deleteReviewVisible = false;
      },
    },
    /**
     * Ran when component is mounted on DOM.
     * Get's the Service's Info.
     */
    mounted() {
      this.getService();
    },
  };
</script>

<style>
  .service-info {
    background: #c0392b;
    /* fallback for old browsers */
    background: -webkit-linear-gradient(to right, #8e44ad, #c0392b);
    /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to right, #8e44ad, #c0392b);
    /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
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

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity .5s
  }

  .fade-enter,
  .fade-leave-to
    /* .fade-leave-active in <2.1.8 */

  {
    opacity: 0
  }

  .white a:hover {
    color: #dbdbdb;
  }

  .el-carousel {
    background: #eee;
  }

  .el-dialog--small {
    width: 80% !important;
  }
</style>
