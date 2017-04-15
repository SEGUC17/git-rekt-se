<template>
  <el-card class="box-card">
    <el-row type="flex" class="row-bg">
      <el-col :span="3" class="image-container">
        <figure class="service-center">
        <img :src="imagePath" class="is-75x75">
        </figure>
      </el-col>
      <el-col :span="21">
        <el-row type="flex" class="row-bg">
          <el-col :span="11">
            <h4 class="title is-4">
              <router-link :to="serviceURL">{{serviceName}}</router-link>
            </h4>
          </el-col>
          <el-col :span="8">
            <h6 class="subtitle is-6">
              <router-link :to="businessURL"> by {{businessName}}</router-link>
            </h6>
          </el-col>
          <el-col :span="5">
            <el-rate v-model="rating" disabled :max="5">
            </el-rate>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg">
          <el-tag v-for="category in categories" :key="category._id">{{category.title}}</el-tag>
        </el-row>
        <el-row type="flex" class="row-bg">
          <span>
             {{shortDescription}}
          </span>
        </el-row>
      </el-col>
    </el-row>
  </el-card>
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
        // TODO change service image path
        return (this.coverImage) ? '' : 'assets/imgs/service.svg';
      },
    },
  };
</script>

<style>
  .el-tag {
    margin: 0 1px;
  }
  
  .is-75x75{
    width: 75px;
    height: 75px;
  }

  .image-container{
    display: flex;
  }

  .service-center{
    margin: 0 auto;
  }
</style>
