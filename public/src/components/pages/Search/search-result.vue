<template>
    <div class="box service-search-result">
        <router-link :to="serviceURL" class="dark-link">
            <div class="media">

                <div class="media-left">
                    <figure class="image is-64x64">
                        <img :src="imagePath" alt="Service Image" class="image is-64x64">
                    </figure>
                </div>

                <div class="media-content">
                    <div class="content">
                        <p class="service-name non-breaking">{{serviceName}} - {{businessName}}</p>
                        <div class="service-categories">
                            <span class="search-tag tag is-dark is-small" v-for="category in categories"
                                  :key="category._id">{{ category.title }}</span>
                        </div>
                        <p class="result-content non-breaking">
                            {{shortDescription}}
                        </p>
                        <el-rate class="is-pulled-right" v-model="rating" disabled :max="5"></el-rate>
                    </div>
                </div>
            </div>
        </router-link>
    </div>
</template>

<script>
  export default {
    data() {
      return {
        serviceName: this.service.name,
        serviceID: this.service._id,
        businessName: this.service._business.name,
        businessID: this.service._business._id,
        rating: this.service._avgRating,
        categories: this.service.categories,
        shortDescription: this.service.shortDescription,
        coverImage: this.service.coverImage,
      };
    },
    props: ['service'],
    computed: {
      serviceURL() {
        return `/service/${this.serviceID}`;
      },
      businessURL() {
        return `/business/${this.businessID}`;
      },
      imagePath() {
        return (this.coverImage) ? `/uploads/${this.coverImage}` : 'assets/imgs/service.svg';
      },
    },
  };
</script>

<style>
    .result {
        margin-bottom: 8px;
    }

    .el-tag {
        margin: 0 1px;
    }

    .is-75x75 {
        width: 75px;
        height: 75px;
    }

    .image-container {
        display: flex;
    }

    .dark-link {
        color: #555555 !important;
    }

    .service-search-result:hover {
        background-color: #fbfbfb;
    }

    .service-search-result p {
        margin-bottom: 0 !important;
    }

    .service-name {
        text-transform: capitalize;
        color: #333;
        font-size: 1.1em;
    }

    .search-tag {
        margin: 0.3em;
        font-size: 0.7em;
    }

    .result-content{
        padding: 0.5em;
    }

    .non-breaking {
        overflow-wrap: break-word;
        word-wrap: break-word;

        -ms-word-break: break-all;
        word-break: break-all;
        word-break: break-word;

        -ms-hyphens: auto;
        -moz-hyphens: auto;
        -webkit-hyphens: auto;
        hyphens: auto;
    }

    .el-rate__icon{
        font-size: 14px !important;
    }
</style>
