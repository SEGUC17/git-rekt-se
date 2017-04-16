<template>
  <div class="main-cnt">
    <section class="gr-content hero is-medium is-bold has-text-centered">
      <div class="hero-body">
        <h1 class="extra-large white">
          Search For Services
        </h1>
        <h2 class="subtitle white">
          Find services that can help you
        </h2>
      </div>
    </section>
    <div class="container">
      <div class="el-row">
        <div class="el-col el-col-24 el-col-xs-24 el-col-sm-6 search-tools">
          <div class="block">
            <h4 class="subtitle is-4">Filters</h4>
          </div>
          <div class="block">
            <span class="search-label">Service Name</span>
            <el-input v-model="newQuery.name" @keyup.enter.native="performSearch" placeholder="Enter Name"></el-input>
          </div>
          <div class="block">
            <span class="search-label">Min. Rating</span>
            <el-slider v-model="newQuery.rating" :max="5"></el-slider>
          </div>
          <div class="block">
            <span class="search-label">Price Range</span>
            <el-slider v-model="priceRange" range :step="100" :max="10000"></el-slider>
          </div>
          <div class="block">
            <span class="search-label">Location</span>
            <el-autocomplete class="inline-input" v-model="newQuery.location" :fetch-suggestions="locationSearch" @keyup.enter.native="performSearch" placeholder="Select Location"></el-autocomplete>
          </div>
          <div class="block">
            <span class="search-label">Sort By</span>
            <el-select v-model="newQuery.sort" clearable placeholder="Select">
              <el-option v-for="item in sortOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="block">
            <el-button class="search-button" type="primary" @click="performSearch">Search</el-button>
          </div>
  
        </div>
        <div class="el-col el-col-24 el-col-xs-24 el-col-sm-18">
          <section v-if="noResults" class="hero is-medium">
            <div  class="hero-body">
              <div class="has-text-centered">
                <h1 class="title">
                  No Results Found
                </h1>
                <h2 class="subtitle">
                  Please try searching for another query
                </h2>
              </div>
            </div>
          </section>
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
  import { Visitor } from '../../services/EndPoints';
  import Locations from '../../../../app/seed/service/locations';
  // TODO move locations to public folder
  
  export default {
    data() {
      return {
        noResults: false,
        results: [],
        locationsDB: [],
        count: 0,
        sortOptions: [{
          value: 1,
          label: 'A-Z',
        },
        {
          value: 2,
          label: 'Highest Rating',

        },
        ],
        currentQuery: this.$route.query,
        priceRange: [(this.$route.query.min) ? parseInt(this.$route.query.min, 10) : 0,
          (this.$route.query.max) ? parseInt(this.$route.query.max, 10) : 10000,
        ],
        newQuery: {
          offset: 1,
          name: (this.$route.query.name) ? this.$route.query.name : '',
          rating: (this.$route.query.rating) ? parseInt(this.$route.query.rating, 10) : 0,
          min: 0,
          max: 10000,
          location: (this.$route.query.location) ? this.$route.query.location : '',
          sort: (this.$route.query.sort) ? this.$route.query.sort : '',
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
      this.execQuery();
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
        if (query.sort) {
          queryString += `&sort=${query.sort}`;
        }
        return queryString;
      },
      changePage(newPage) {
        this.currentQuery.offset = newPage;
        this.execQuery();
      },
      locationSearch(q, cb) {
        const results = q ? this.locationsDB.filter(this.createFilter(q)) : this.locationsDB;
        cb(results);
      },
      createFilter(queryString) {
        return location => ((location.value).toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      },
      performSearch() {
        this.newQuery.offset = 1;
        this.newQuery.min = Math.min(...this.priceRange);
        this.newQuery.max = Math.max(...this.priceRange);
        this.currentQuery = this.newQuery;
        this.execQuery();
      },
      execQuery() {
        Axios.get(`${Visitor().search}${this.stringifyQuery(this.currentQuery)}`)
          .then((response) => {
            this.noResults = false;
            this.results = response.data.results;
            this.count = response.data.count;
          })
          .catch((err) => {
            if (err.response.data.errors[0] === 'No search results match the query.') {
              this.noResults = true;
              this.results = [];
              this.count = 0;
            }
          });
      },
    },
  };
</script>

<style>
  .main-cnt {
    padding: 10px 0;
  }

  .gr-content{
    background: linear-gradient(180deg,rgba(0,0,0,.65),rgba(0,0,0,0)),url('http://localhost:3000/assets/imgs/search/search_BG.JPG') 0 0/cover
  }
  
  .el-pagination {
    display: flex;
    justify-content: space-between;
  }
  
  .search-tools {
    padding: 15px;
  }
  
  .search-button {
    width: 100%;
    margin-top: 15px;
  }
</style>
