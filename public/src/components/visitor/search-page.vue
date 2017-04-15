<template>
  <div class="page-container page-component column s-half is-offset-one-quarter">
    <div class="el-row">
      <div class="el-col el-col-24 el-col-xs-24 el-col-sm-6">
        <!---TODO Search Tools-->
      </div>
      <div class="el-col el-col-24 el-col-xs-24 el-col-sm-18">
        <search-result v-for="result in results" :service="result" :key= "result._id"></search-result>
        <el-row :gutter="20">
          <el-col :span="12" :offset="6">
            <el-pagination small layout="prev, pager, next" :current-page="parseInt(currentQuery.offset)" :total="count" @current-change="changePage">
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
        currentQuery: this.$route.query,
        nextQuery: {},
      };
    },
    components: {
      SearchResult,
    },
    mounted() {
      Axios.get(`${EndPoints.Visitor().search}/${this.stringifyQuery(this.currentQuery)}`)
        .then((response) => {
          this.results = response.data.results;
          this.count = response.data.count;
        })
        .catch(err => console.log(err));
      // TODO proper error handling
    },
    methods: {
      stringifyQuery(query) {
        let queryString = '?';
        if (!query.offset) {
          query.offset = 1;
        }
        queryString = `${queryString}offset=${query.offset}`;
        if (query.name) {
          queryString = `${queryString}&name=${query.name}`;
        }
        if (query.rating) {
          queryString = `${queryString}&rating=${query.rating}`;
        }
        if (query.min) {
          queryString = `${queryString}&min=${query.min}`;
        }
        if (query.max) {
          queryString = `${queryString}&max=${query.max}`;
        }
        if (query.location) {
          queryString = `${queryString}&location=${query.location}`;
        }
        return queryString;
      },
      changePage(newPage) {
        this.currentQuery.offset = newPage;
        Axios.get(`${EndPoints.Visitor().search}/${this.stringifyQuery(this.currentQuery)}`)
        .then((response) => {
          this.results = [];
          this.results = response.data.results;
          this.count = response.data.count;
        });
      },
    },
  };
</script>
