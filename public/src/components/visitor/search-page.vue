<template>
  <div class="page-container page-component column s-half is-offset-one-quarter">
    <div class="el-row">
      <div class="el-col el-col-24 el-col-xs-24 el-col-sm-6">
        <!---TODO Search Tools-->
      </div>
      <div class="el-col el-col-24 el-col-xs-24 el-col-sm-18">
        <search-result v-for="result in results" :service="result"></search-result>
        <el-row :gutter="20">
          <el-col :span="12" :offset="6">
            <el-pagination layout="prev, pager, next" :total="count">
            </el-pagination>
          </el-col>
        </el-row>
  
      </div>
  
    </div>
  </div>
</template>

<script>
  import Axios from 'axios';
  
  import SearchResult from './search-result.vue';
  import EndPoints from '../../services/EndPoints';
  
  export default {
    data() {
      return {
        results: [],
        count: 0,
        incQuery: '?',
      };
    },
    components: {
      SearchResult,
    },
    mounted() {
      if (this.$route.query.offset) {
        this.incQuery = `${this.incQuery}&offset=${this.$route.query.offset}`;
      }
      if (this.$route.query.name) {
        this.incQuery = `${this.incQuery}&name=${this.$route.query.name}`;
      }
      if (this.$route.query.rating) {
        this.incQuery = `${this.incQuery}&rating=${this.$route.query.rating}`;
      }
      if (this.$route.query.min) {
        this.incQuery = `${this.incQuery}&min=${this.$route.query.min}`;
      }
      if (this.$route.query.max) {
        this.incQuery = `${this.incQuery}&max=${this.$route.query.max}`;
      }
      if (this.$route.query.location) {
        this.incQuery = `${this.incQuery}&location=${this.$route.query.location}`;
      }
      if (this.incQuery === '?') {
        this.incQuery = '';
      }
      Axios.get(`${EndPoints.Visitor().search}/${this.incQuery}`)
        .then((response) => {
          this.results = response.data.results;
          this.count = response.data.count;
        })
        .catch(err => console.log(err));
      // TODO proper error handling
    },
  };
</script>
