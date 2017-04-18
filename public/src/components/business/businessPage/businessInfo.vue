<template>
    <div>
        <div class="gallery" :style="backgroundStyle">
            <h1 class="extra-large white">
                {{name}}
            </h1>
    
            <h2 class="subtitle white">
                {{shortDescription}}
            </h2>
        </div>
    
        <div class="content">
            <el-row :gutter="20">
                <el-col :span="16">
                    <div class="grid-content">
                        <hr class="description">
                        <p> {{description}} </p>
                    </div>
                    <div class="grid-content">
                        <hr class="services">
                        <el-collapse accordion>
                            <el-collapse-item v-for="service in services" :key="service" :title="service.name">
                                <div>{{service.shortDescription}}
                                    <el-button class="right" @click="bookService(service)">Book Now</el-button>
                                    <el-button class="right" @click="viewService(service)">View</el-button>
                                </div>
                            </el-collapse-item>
                        </el-collapse>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content">
                        <hr class="info">
                        <p> Working hours: {{workingHours}} </p>
                    </div>
                    <div class="grid-content">
                        <hr class="categories">
                        <el-tag type="primary" v-for="category in categories" :key="category">{{category.title}}</el-tag>
                    </div>
                    <div class="grid-content">
                        <hr class="contacts">
                        <h6> Email: {{email}} </h6>
                        <h6> Numbers: </h6>
                        <ul>
                            <li v-for="num in phoneNumbers">
                                {{ num }}
                            </li>
                        </ul>
                        <h6> Branches: </h6>
                        <ul>
                            <li v-for="branch in branches">
                                {{ branch.location }},{{branch.address}}
                            </li>
                        </ul>
                    </div>
                    <div class="grid-content">
                        <hr class="related">
                        <ul>
                            <li v-for="business in related">
                                <div @click="relatedView(business)">
                                    {{ business.name }}
                                </div>
                            </li>
                        </ul>
                    </div>
                </el-col>
            </el-row>
        </div>
    
    
    </div>
</template>

<script>
    import axios from 'axios';
    import EndPoints from '../../../services/EndPoints';
    export default {
        data() {
            return {
                images: [{
                    path: 'http://www.solidbackgrounds.com/images/2560x1440/2560x1440-black-solid-color-background.jpg'
                }],
                currentNumber: 0,
                timer: null,
    
                id: '',
                name: '',
                email: '',
                shortDescription: '',
                gallery: [],
                phoneNumbers: [],
                description: '',
                workingHours: '',
                categories: [],
                branches: [],
                services: [],
    
                //related businesses
                related: [],
            }
        },
        mounted: function() {
            this.startRotation();
    
            axios.get(EndPoints.Visitor().viewBusiness(this.$route.params.id))
                .then((business) => {
                    this.id = business.data.id;
                    this.name = business.data.name;
                    this.email = business.data.email;
                    this.shortDescription = business.data.shortDescription;
                    this.gallery = business.data.gallery;
                    this.phoneNumbers = business.data.phoneNumbers;
                    this.description = business.data.description;
                    this.workingHours = business.data.workingHours;
                    this.categories = business.data.categories;
                    this.branches = business.data.branches;
                    this.services = business.data.services;
    
                    //uncomment this when you add gallery .setting the slider
                    if (this.gallery.length > 0) {
                        this.images = this.gallery;
                    }
    
                    console.log(this.images);
    
                    //getting related businesses
                    axios.get(EndPoints.Visitor().relatedBusiness(this.categories[0]._id, 1))
                        .then((res) => {
                            this.related = res.data.results;
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                })
                .catch((err) => {
                    console.log(err);
                });
    
        },
    
        computed: {
            backgroundStyle: function() {
                return {
                    //add .path when adding gallery
                    'background-image': 'url("' + this.images[this.currentNumber % this.images.length].path + '")'
                }
            }
        },
    
        methods: {
            startRotation: function() {
                this.timer = setInterval(this.next, 5000);
            },
    
            next: function() {
                this.currentNumber += 1
            },
            prev: function() {
                this.currentNumber -= 1
            },
            viewService(service) {
                const serviceID = service._id;
                let url = `/service/${serviceID}`;
                this.$router.push(url);
            },
            bookService(service) {
                const serviceID = service._id;
                let url = `/service/${serviceID}/book`;
                this.$router.push(url);
            },
            relatedView(business) {
                const businessID = business._id;
                let url = `/business/${businessID}`;
                this.$router.push(url);
                this.$router.go(1);
            },
        }
    };
</script>

<style>
    .extra-large {
        font-size: 4em;
        line-height: 1.2em;
    }
    
    .gallery {
        padding-top: 145px;
        padding-bottom: 120px;
        text-align: center;
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
    }
    
    .hero-text {
        text-align: center;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: white;
    }
    
    hr.style1 {
        border-top: 1px solid lightgrey;
    }
    
    hr.description {
        border-top: 3px double #8c8b8b;
        text-align: center;
    }
    
    hr.description:after {
        content: 'Description';
        display: inline-block;
        position: relative;
        top: -22px;
        padding: 0 10px;
        background: #ffffff;
        color: #8c8b8b;
        font-size: 24px;
    }
    
    hr.info {
        border-top: 3px double #8c8b8b;
        text-align: center;
    }
    
    hr.info:after {
        content: 'General info';
        display: inline-block;
        position: relative;
        padding: 0 5px;
        top: -22px;
        background: #ffffff;
        color: #8c8b8b;
        font-size: 24px;
    }
    
    hr.categories {
        border-top: 3px double #8c8b8b;
        text-align: center;
    }
    
    hr.categories:after {
        content: 'Categories';
        display: inline-block;
        position: relative;
        padding: 0 5px;
        top: -22px;
        background: #ffffff;
        color: #8c8b8b;
        font-size: 24px;
    }
    
    hr.contacts {
        border-top: 3px double #8c8b8b;
        text-align: center;
    }
    
    hr.contacts:after {
        content: 'Contacts';
        display: inline-block;
        position: relative;
        padding: 0 5px;
        top: -22px;
        background: #ffffff;
        color: #8c8b8b;
        font-size: 24px;
    }
    
    hr.related {
        border-top: 3px double #8c8b8b;
        text-align: center;
    }
    
    hr.related:after {
        content: 'Related Services';
        display: inline-block;
        position: relative;
        padding: 0 5px;
        top: -22px;
        background: #ffffff;
        color: #8c8b8b;
        font-size: 24px;
    }
    
    hr.services {
        border-top: 3px double #8c8b8b;
        text-align: center;
    }
    
    hr.services:after {
        content: 'Our Services';
        display: inline-block;
        position: relative;
        padding: 0 5px;
        top: -22px;
        background: #ffffff;
        color: #8c8b8b;
        font-size: 24px;
    }
    
    hr.reviews {
        border-top: 3px double #8c8b8b;
        text-align: center;
    }
    
    hr.reviews:after {
        content: 'Reviews';
        display: inline-block;
        position: relative;
        padding: 0 5px;
        top: -22px;
        background: #ffffff;
        color: #8c8b8b;
        font-size: 24px;
    }
    
    .grid-content {
        border: 1px solid #8c8b8b;
        border-radius: 25px;
        padding: 25px;
        margin: 20px;
    }
    
    .content {
        margin: 30px;
        max-width: 720;
    }
    
    .right {
        float: right;
        margin: 5px;
    }
</style>
