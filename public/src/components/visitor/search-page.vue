<template>
  <div class="columns is-mobile" id="search">
    <div class="column s-half is-offset-one-quarter">
  
      <SearchResult v-for="result in results" :service="result"></SearchResult>
      <el-pagination layout="prev, pager, next" :total="{{count}}">
      </el-pagination>
  
  
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
      };
    },
    components: [SearchResult],
    mounted() {
      Axios.get(`${EndPoints.visitor.search}${query}`)
        .then((response) => {
          // TODO pass error message
          this.results = response.results;
          this.count = response.count;
        });
    },
  };
</script>
