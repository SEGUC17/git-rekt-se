<template>
  <el-card class="box-card">
    <el-row type="flex" class="row-bg">
      <el-col :span="6">
        <h2>
          <router-link :to=" {{serviceURL}} ">{{serviceName}}</router-link>
        </h2>
      </el-col>
      <el-col :span="6">
        <h4>
          <router-link :to="{{businessURL}}"> by {{businessName}}</router-link>
        </h4>
      </el-col>
      <el-col :span="6">
        <h4>
          rating: {{rating}}
        </h4>
      </el-col>
    </el-row>
    <el-row type="flex" class="row-bg">
      <el-tag v-for="category in categories">{{category.title}}</el-tag>
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
        serviceName: service.name,
        serviceID: service._id,
        businessName: service._business.name,
        businessID: service._business._id,
        rating: service._avgRating,
        categories: service.categories,
        shortDescription: service.shortDescription,
        coverImage: service.coverImage,
      };
    },
    props: 'service',
    computed: {
      serviceURL: (() => {
        return (`/service/${this.serviceID}`);
      }),
      businessURL: (() => {
        return (`/business/${this.businessID}`);
      }),
    },
  
  };
</script>
