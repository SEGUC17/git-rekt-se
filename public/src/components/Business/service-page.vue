<template>
    <div>
        <section class="hero is-primary is-medium" :style="backgroundStyle">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title">
                        {{businessName}}
                    </h1>
                    <h2 class="subtitle">
                        {{name}}
                    </h2>
                    Current rating:
                    <el-rate v-model="value5" disabled show-text text-color="#ff9900" text-template="{value} points">
                    </el-rate>
                </div>
            </div>
        </section>
        <div class="columns">
            <div class="column is-one-quarter">
            </div>
    
            <div class="column">
    
    
                <div class="box cyan-bg" v-for="offer in offerings" style="margin-top:2em; margin-bottom:2em">
                    <div class="columns">
                        <div class="column is-6">
                            <p>
                                <h1 class="title">
                                    {{offer.address}}
                                </h1>
                                <h2 class="subtitle">
                                    {{offer.location}}
                                </h2>
                            </p>
                        </div>
                        <div class="column is-3">
                            <span class="subtitle">EGP {{offer.price}}</span>
                        </div>
                        <div class="column">
                            <el-button type="success" @click="BookNow()">Book Now</el-button>
                        </div>
                    </div>
    
                </div>
    
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="Info" name="first">
                        <article class="box" style="margin:2em">
                            <h1 class="title" style="margin-bottom:1em">Description:</h1>
                            <div>{{shortDescription}}</div>
                            <h1 class="title" style="margin-top:2em">Gallery:</h1>
                            <!--TODO:Carousal should go here-->
                            <div>
                                <template>
                                    <el-carousel :interval="5000" arrow="always">
                                        <el-carousel-item v-for="item in gallery" v-bind:data="item" v-bind:key="item">
                                        <h3>{{ item }}</h3>
                                        </el-carousel-item>
                                    </el-carousel>
                                </template>
                            </div>
                        </article>
    
                    </el-tab-pane>
                    <el-tab-pane label="Reviews" name="second">Config</el-tab-pane>
                </el-tabs>
            </div>
    
            <div class="column">
    
                <div class="card">
                    <header class="card-header">
                        <p class="card-header-title">
                            Contact us.
                        </p>
                    </header>
                    <div class="card-content">
                        <div class="content">
                            Email: {{businessEmail}}
                        </div>
                        <div class="content">
                            Phone numbers:
                            <ul>
                                <li v-for="number in businessPhoneNumbers">{{number}}</li>
                            </ul>
                        </div>
                    </div>
    
                </div>
                <div class="card">
                    <header class="card-header">
                        <p class="card-header-title">
                            Categories:
                        </p>
                    </header>
                    <div class="card-content">
                        <div class="content">
                            <ul>
                                <span class="tag is-black" v-for="category in categories">{{category.title}}</span>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="card">
                    <header class="card-header">
                        <p class="card-header-title">
                            Related services:
                        </p>
                    </header>
                    <div class="card-content">
                        <div class="content">
                            <!--card starts here-->

                            <el-row>
                                <el-col :span="8" v-for="relatedService in relatedServices" v-bind:data="relatedService" v-bind:key="relatedService.name">
                                    <el-card :body-style="{ padding: '0px' }">
                                        <img :src="relatedService.coverImage" class="image">
                                        <div style="padding: 14px;">
                                            <span>{{relatedService.name}}</span>
                                            <div class="bottom clearfix">
                                                <el-button type="text" class="button is-primary">{{relatedService.name}}</el-button>
                                            </div>
                                        </div>
                                    </el-card>
                                </el-col>
                            </el-row>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
    import axios from 'axios';
    import EndPoints from '../../services/EndPoints.js';
    
    export default {
        data() {
            return {
                name: '',
                shortDescription: '',
                description: '',
                coverImage: '',
                businessName: '',
                businessEmail: '',
                businessShortDescription: '',
                businessDescription: '',
                businessPhoneNumbers: null,
                businessGallery: null,
                businessWorkingHours: null,
                branches: null,
                reviews: null,
                gallery: null,
                activeName: 'first',
                categories: null,
                offerings: null,
                value5: 3.7,
                relatedServices: null,
            };
        },
        methods: {
            //send get request to obtain service info using service id
            getService() {
                axios.get(EndPoints.Service().viewSearvice(this.$route.params.id)).then((res) => {
                    const service = res.data;
                    this.name = service.name,
                        this.shortDescription = service.shortDescription,
                        this.description = service.description,
                        this.businessName = service.businessName,
                        this.businessEmail = service.businessEmail,
                        this.coverImage = service.coverImage,
                        this.businessShortDescription = service.businessShortDescription,
                        this.businessDescription = service.businessDescription,
                        this.businessPhoneNumbers = service.businessPhoneNumbers,
                        this.businessGallery = service.businessGallery,
                        this.businessWorkingHours = service.businessWorkingHours,
                        this.branches = service.branches,
                        this.reviews = service.reviews,
                        this.gallery = service.gallery,
                        this.categories = service.categories,
                        this.offerings = service.offerings,
                        this.getRelatedServices();
                }).catch((err) => {
                    console.log(err);
                });
            },
            //obtains 3 related services from on of the categories
            getRelatedServices() {
                if(this.categories.length === 0)
                return;

                axios.get(EndPoints.viewRelatedServices(this.categories[0], 1)).then((res) => {
                    this.relatedServices = res.data.results;
                }).catch(err => console.log(err));
            },
            //in case extra functionality is needed
            handleClick(tab, event) {
            },
            //link to booking
            BookNow() {
                alert('booking');
            }
        },
        mounted() {
            this.getService();
        },
        computed: {
            backgroundStyle() {
                return {
                    'background-image': 'url("' + this.coverImage + '")'
                }
            },
    
    
        }
    }
</script>

<style>
    .time {
        font-size: 13px;
        color: #999;
    }
    
    .bottom {
        margin-top: 13px;
        line-height: 12px;
    }
    
    .button {
        padding: 0;
        float: right;
    }
    
    .image {
        width: 100%;
        display: block;
    }
    
    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }
    
    .clearfix:after {
        clear: both
    }
    
    .cyan-bg {
        background-color: lightblue;
    }
    
    .time {
        font-size: 13px;
        color: #999;
    }
    
    .bottom {
        margin-top: 13px;
        line-height: 12px;
    }
    
    .button {
        padding: 0;
        float: right;
    }
    
    .image {
        width: 100%;
        display: block;
    }
    
    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }
    
    .clearfix:after {
        clear: both
    }
</style>