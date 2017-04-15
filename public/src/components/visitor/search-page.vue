<template>
  <div class="main-cnt">
    <div class="page-container page-component">
      <div class="el-row">
        <div class="el-col el-col-24 el-col-xs-24 el-col-sm-4 search-tools">
          <!---TODO Search Tools-->
          <div class="block">
            <h4 class="subtitle is-4">Filters</h4>
          </div>
          <div class="block">
            <span class="search-label">Service Name</span>
            <el-input v-model="newQuery.name" placeholder="Enter Name"></el-input>
          </div>
          <div class="block">
            <span class="search-label">Min. Rating</span>
            <el-slider v-model="newQuery.rating" :max="10"></el-slider>
          </div>
          <div class="block">
            <span class="search-label">Price Range</span>
            <el-slider v-model="priceRange" range :step="100" :max="10000"></el-slider>
          </div>
            <span class="search-label">Location</span>
            <el-autocomplete class="inline-input" v-model="newQuery.location" :fetch-suggestions="locationSearch" placeholder="Select Location"></el-autocomplete>
          <div class="block">
            <el-button class="search-button" type="primary"@click="performSearch">Search</el-button>
          </div>

        </div>
        <div class="el-col el-col-24 el-col-xs-24 el-col-sm-20">
          <search-result v-for="result in results" :service="result" :key="result._id"></search-result>
          <el-row :gutter="20">
            <el-col :span="12" :offset="6">
              <el-pagination small layout="prev, pager, next" :current-page="parseInt(currentQuery.offset)" :total="count" @current-change="changePage">
              </el-pagination>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Axios from 'axios';
  
  import SearchResult from './search-result.vue';
  import EndPoints from '../../services/EndPoints';
  import Locations from '../../../../app/seed/service/locations';
  // TODO move locations to public folder
  
  export default {
    data() {
      return {
        results: [],
        locationsDB: [],
        count: 0,
        currentQuery: this.$route.query,
        priceRange: [(this.$route.query.min) ? parseInt(this.$route.query.min, 10) : 0,
          (this.$route.query.max) ? parseInt(this.$route.query.max, 10) : 10000,
        ],
        newQuery: {
          offset: 1,
          name: (this.$route.query.name) ? this.$route.query.name : '',
          rating: (this.$route.query.rating) ? parseInt(this.$route.query.rating, 10) : 0,
          min: 0,
          max: 0,
          location: (this.$route.query.location) ? this.$route.query.location : '',
        },
      };
    },
    components: {
      SearchResult,
    },
    mounted() {
      Locations.forEach((location) => {
        this.locationsDB.push({
          value: location,
        });
      }, this);
      this.newQuery.offset = 1;
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
        queryString += `offset=${query.offset}`;
        if (query.name) {
          queryString += `&name=${query.name}`;
        }
        if (query.rating) {
          queryString += `&rating=${query.rating}`;
        }
        if (query.min) {
          queryString += `&min=${query.min}`;
        }
        if (query.max) {
          queryString += `&max=${query.max}`;
        }
        if (query.location) {
          queryString += `&location=${query.location}`;
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
      locationSearch(q, cb) {
        const results = q ? this.locationsDB.filter(this.createFilter(q)) : this.locationsDB;
        cb(results);
      },
      createFilter(queryString) {
        return location => ((location.value).toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      },
      performSearch() {
        this.newQuery.min = Math.min(this.priceRange);
        this.newQuery.max = Math.max(this.priceRange);
        this.currentQuery = this.newQuery;
        Axios.get(`${EndPoints.Visitor().search}/${this.stringifyQuery(this.currentQuery)}`)
        .then((response) => {
          this.results = response.data.results;
          this.count = response.data.count;
        })
        .catch(err => console.log(err));
      // TODO proper error handling
      },
    },
  };
</script>

<style>
  .container,
  .page-container {
    width: 1140px;
    padding: 0 30px;
    margin: 10px auto;
  }
  
  .el-pagination {
    display: flex;
    justify-content: space-between;
  }
  
  .search-tools {
    padding-right: 15px;
  }
  
  .search-button {
    width: 100%;
    margin-top: 15px;
  }
</style>
