<template>
    <div class="remove-business">
        <div class="errors" v-if="errors.length > 0">
            <el-alert v-for="error in errors" class="error" :title="error" type="error" :key="error | appendRandom" show-icon></el-alert>
        </div>
    
        <b-table v-if="businesses.length > 0" :data="businesses" :striped="true" :narrowed="false" :mobile-cards="true" :paginated="true" :per-page="10" :pagination-simple="false" default-sort="name" render-html>
    
            <b-table-column field="name" label="Name" sortable></b-table-column>
            <b-table-column field="email" label="Email" sortable></b-table-column>
            <b-table-column field="_id" component="business-remove-btn"></b-table-column>
        </b-table>
    
        <!-- No data found. -->
        <div class="no-data hero" v-show="businesses.length === 0">
            <div class="hero-body has-text-centered">
                <el-icon name="circle-close" class="confirmation-icon icon-fail"></el-icon>
                <p class="title is-2">No Businesses Found.</p>
                <a class="button is-info" @click.prevent="getBusinesses">Refresh</a>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import {
        Admin
    } from '../../services/EndPoints';
    import adminAuth from '../../services/auth/adminAuth';
    import EventBus from '../../services/EventBus';
    
    export default {
        data() {
            return {
                errors: [],
                businesses: [],
                email: '',
            };
        },
        mounted() {
            if (!adminAuth.isAuthenticated()) {
                this.$router.push('/404');
            } else {
                this.getBusinesses();
                EventBus.$on('BusinessRemoved', () => {
                    this.getBusinesses();
                });
                EventBus.$on('BusinessRemoveError', (errors) => {
                    this.errors = errors;
                });
            }
        },
        methods: {
            getBusinesses() {
                const loader = this.$loading({
                    fullscreen: true,
                });
                axios
                    .get(Admin().listBusiness, {
                        headers: {
                            Authorization: adminAuth.getJWTtoken(),
                        },
                    })
                    .then((response) => {
                        loader.close();
                        this.businesses = response.data.results;
                        this.errors = [];
                    })
                    .catch((error) => {
                        this.errors = error.response.data.errors.map((err) => {
                            if (typeof err === 'string') {
                                return err;
                            }
                            return err.msg;
                        });
                        loader.close();
                        this.businesses = [];
                    });
            },
        },
    };
</script>