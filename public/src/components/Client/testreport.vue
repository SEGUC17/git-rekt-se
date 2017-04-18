<template>
<div>
   <reportButton repid="58f603fb7e936a5bbf157ae9"></reportButton>
   </div>
</template>

<script>
    
    import axios from 'axios';
    import { Notification } from 'element-ui';
    import { Client } from '../../services/EndPoints.js';
    import reportButton from "../../components/Client/reportButton.vue"
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
