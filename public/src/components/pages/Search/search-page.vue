<template>
    <div class="main-cnt">

        <!-- Search Top Header -->
        <section class="search-header hero is-bold">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title extra-large white">
                        Search For Services
                      </h1>
                    <h2 class="subtitle white">
                        Find services that can help you.
                     </h2>
                </div>
            </div>
        </section>

        <div class="container is-fluid columns">

            <!-- Search filtering -->
            <aside class="column search-sidebar is-3">
                <el-form label-position="top" class="search-form">
                    <el-form-item label="Service Name">
                        <el-input v-model="newQuery.name" @keyup.enter.native="performSearch"
                                  placeholder="Enter Name">
                        </el-input>
                    </el-form-item>

                    <el-form-item label="Min Rating">
                        <el-slider v-model="newQuery.rating" :max="5"></el-slider>
                    </el-form-item>

                    <el-form-item label="Price Range">
                        <el-slider v-model="priceRange" range :step="100" :max="10000"
                                   :format-tooltip="rangeTooltip" size="large"></el-slider>
                    </el-form-item>

                    <el-form-item label="Location">
                        <el-select v-model="newQuery.location" filterable clearable placeholder="Select Location">
                            <el-option v-for="location in locationsDB" :key="location.value" :label="location.label"
                                       :value="location.value">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="Sort By">
                        <el-select v-model="newQuery.sort" clearable placeholder="Select">
                            <el-option v-for="item in sortOptions" :key="item.value" :label="item.label"
                                       :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item>
                        <el-button class="search-button" type="primary" @click="performSearch">Search</el-button>
                    </el-form-item>
                </el-form>
            </aside>

            <!-- Search results -->
            <div class="search-results column is-8">

                <!-- Alerts Div -->
                <div class="alerts">
                    <el-alert v-for="error in errors" :key="error" :title="error" class="error" type="error"
                              show-icon></el-alert>
                </div>

                <!-- No Search Results -->
                <section v-if="noResults" class="hero is-medium">
                    <div class="hero-body">
                        <div class="has-text-centered">
                            <h1 class="title is-1 is-spaced">
                                No search results
                              </h1>
                            <h2 class="subtitle">
                                Try to search for another query.
                             </h2>
                        </div>
                    </div>
                </section>

                <!-- Error occurred -->
                <section v-if="errors.length > 0 && !noResults" class="hero is-medium">
                    <div class="hero-body">
                        <div class="has-text-centered">
                            <h1 class="title is-1 is-spaced">
                                Error(s) occurred during search.
                               </h1>
                            <h2 class="subtitle">
                                please try again
                             </h2>
                        </div>
                    </div>
                </section>

                <search-result v-for="result in results" :service="result" :key="result._id"></search-result>

                <b-pagination
                        v-show="errors.length === 0 && !noResults"
                        :total="count"
                        :current="currentQuery.offset"
                        order="is-centered"
                        size="default"
                        :simple="false"
                        :per-page="10"
                        @change="changePage">
                </b-pagination>
            </div>
        </div>
    </div>
</template>

<script>
  import Axios from 'axios';

  import SearchResult from './search-result.vue';
  import {Visitor} from '../../../services/EndPoints';
  import Locations from '../Index/mainLocations';

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
        errors: [],
      };
    },
    components: {
      SearchResult,
    },
    mounted() {
      this.getLocations();
      this.newQuery.offset = 1;
      this.execQuery();
    },
    methods: {
      updateURL() {
        const params = {};
        Object.keys(this.currentQuery).forEach((key) => {
          if (this.currentQuery[key]) {
            params[key] = this.currentQuery[key];
          }
        });

        this.$router.push({
          path: '/search',
          query: params,
        });
      },
      getLocations() {
        Axios
            .get(Visitor().locations)
            .then((res) => {
              this.locationsDB = res.data;
            })
            .catch(() => {
              this.locationsDB = Locations;
            });
      },
      stringifyQuery(query) {
        let queryString = '?';
        if (!query.offset === undefined) {
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
        if (query.max || query.max === 0) {
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
        this.updateURL();
        this.execQuery();
      },
      rangeTooltip(value) {
        return (value === 10000) ? 'ALL' : value;
      },
      createFilter(queryString) {
        return location => ((location.value).toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      },
      performSearch() {
        this.newQuery.offset = 1;
        this.newQuery.min = Math.min(...this.priceRange);
        this.newQuery.max = (Math.max(...this.priceRange) === 10000) ?
            undefined : Math.max(...this.priceRange);
        this.currentQuery = this.newQuery;
        this.updateURL();
        this.execQuery();
      },
      execQuery() {
        this.errors = [];
        const loader = this.$loading({
          fullscreen: true,
        });
        Axios.get(`${Visitor().search}${this.stringifyQuery(this.currentQuery)}`)
            .then((response) => {
              loader.close();
              this.noResults = false;
              this.results = response.data.results;
              this.count = response.data.count;
            })
            .catch((err) => {
              loader.close();
              if (err.response.data.errors[0] === 'No search results match the query.') {
                this.noResults = true;
                this.results = [];
                this.count = 0;
              } else {
                this.errors = err.response.data.errors.map((error) => {
                  if (typeof error === 'string') {
                    return error;
                  }
                  return error.msg;
                });
              }
            });
      },
    },
  };
</script>

<style>

    .search-header {
        background: #CB356B; /* fallback for old browsers */
        background: -webkit-linear-gradient(to right, #BD3F32, #CB356B); /* Chrome 10-25, Safari 5.1-6 */
        background: linear-gradient(to right, #BD3F32, #CB356B); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    }

    .el-pagination {
        display: flex;
        justify-content: space-between;
    }

    .search-body {
        padding-top: 10px;
    }

    .search-tools {
        padding: 15px;
    }

    .search-sidebar {
        margin-top: 1em;
    }

    .search-button {
        width: 100%;
    }

    .search-form .el-form-item__label {
        font-size: 1em;
    }

    .alerts {
        margin-bottom: 1em;
    }

    @media screen and (max-width: 999px) {
        .search-sidebar {
            margin: 2em;
        }

        .search-results {
            margin: 1em;
        }
    }
</style>
