<template>
<div>
   <reportButton repid="58f92a8bdd1e64454e8ef99b"></reportButton>
   </div>
</template>

<script>
    
    import axios from 'axios';
    import { Notification } from 'element-ui';
    import { Client } from '../../services/EndPoints.js';
    import reportButton from "../../components/Client/reportButton.vue"
    
    /**
        ID is hardcoded for testing purposes
     */
    export default {
        data() {
            return {
            }
        },
        mounted() {
        },
        components: {
             reportButton,
        },
        methods: {
        }
    }
</script>

<style>
    .error {
        margin-top: 20px;
    }
    .error:first-child {
        margin-top: none;
    }
    .demo-ruleForm {
        margin-top: 30px;
    }
</style>
