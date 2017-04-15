<template>
  <el-card class="box-card">
    <el-row type="flex" class="row-bg">
      <el-col :span="8">
        <h4 class="title is-4">
          <router-link :to="serviceURL">{{serviceName}}</router-link>
        </h4>
      </el-col>
      <el-col :span="8">
        <h6 class="subtitle is-6">
          <router-link :to="businessURL"> by {{businessName}}</router-link>
        </h6>
      </el-col>
      <el-col :span="8">
        <el-rate v-model="rating" disabled show-text :max="5" text-template="{value} points">
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
    },
  };
</script>

<style>
  .el-tag {
    margin: 0 1px;
  }
</style>
