<template>
    <div class="checkout">
        <section class="checkout-top hero is-bold">
            <div class="hero-body">
                <div class="container service-info-header">
                    <h1 class="white title is-2">{{ service.name }}</h1>
                    <p class="white subtitle">{{ service.businessName}}</p>
                    <p class="white subtitle">
                        {{ service.shortDescription}}
                    </p>
                    <el-rate v-model="value" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" disabled></el-rate>
                </div>
            </div>
        </section>
    
        <div class="stepper">
            <el-steps space="50%" :active="active" :center="true" :align-center="true">
                <el-step title="Select" icon="edit"></el-step>
                <el-step title="Review" icon="document"></el-step>
                <el-step title="Finish" icon="check"></el-step>
            </el-steps>
        </div>
    
        <div class="columns checkout-boxes">
    
            <div class="column is-10 is-offset-1" v-if="active === 2">
    
                <div class="box">
                    <h1 class="title is-4">Booking Information</h1>
                    <hr />
    
                    <div class="field">
                        <p class="label">Select Branch</p>
                        <el-select class="seventy-width" v-model="form.branch" placeholder="Select Branch">
                            <el-option v-for="branch in service.branches" :key="branch._id" :label="branch.address" :value="branch._id"></el-option>
                        </el-select>
                    </div>
    
                    <div class="field">
                        <p class="label">Starting Date</p>
                        <el-select class="seventy-width" @change="goToStep2" v-model="form.offering" placeholder="Select Offering" :disabled="form.branch === ''">
                            <el-option v-for="offering in service.offerings" v-if="offering.branch === form.branch" :key="offering._id" :label="formatDates(offering.startDate, offering.endDate)" :value="offering"></el-option>
                        </el-select>
                    </div>
    
                </div>
            </div>
    
            <div class="column is-12 columns" v-if="active === 1">
                <div class="column is-6 is-offset-1">
    
                    <div class="box">
                        <h1 class="title is-4">Booking Information</h1>
                        <hr />
    
                        
                        <div class="field">
                            <p class="label">Credit or debit card</p>
                            <div id="card-element" class="seventy-width el-input__inner"></div>    
                            <div id="card-errors"></div>
                        </div>
                        
                        <div class="field">
                            <p class="label">Coupon (optional)</p>
                            <el-input placeholder="coupon code" class="seventy-width"></el-input>
                            <el-button type="primary">Validate</el-button>
                        </div>

                    </div>
    
                </div>
    
                <div class="column is-4">
                    <div class="box">
                        <div class="service">
                            <div class="media service-info">
                                <div class="media-left">
                                    <figure class="image is-64x64">
                                        <img src="http://bulma.io/images/placeholders/128x128.png" alt="Image">
                                    </figure>
                                </div>
                                <!-- Service Cover Image-->
    
                                <div class="media-content">
                                    <strong>German Course #1</strong>
                                    <p class="shortDescription">
                                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore tenetur odio facere nobis nemo adipisci eius sequi, in sint recusandae
                                    </p>
                                    <el-rate class="is-pulled-right" v-model="value" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" disabled></el-rate>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
    
            </div>
        </div>
    </div>
</template>

<script>
    import Endpoints from '../../../services/EndPoints';
    export default {
        data() {
            return {
                active: 1,
                value: 3,
                form: {
                    branch: '',
                    offering: '',
                },
                service: '',
                loader: '',
                card: '',
            }
        },
    
        methods: {
            initStripe() {
                const stripe = Stripe('pk_test_BAf83Axjq8bck9Pbd36seTPS');
                const elements = stripe.elements();
    
                this.card = elements.create('card');
                
                const card = this.card;
                const style = {
                    base: {
                        color: '#32325d',
                        lineHeight: '24px',
                        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                        fontSmoothing: 'antialiased',
                        fontSize: '16px',
                        '::placeholder': {
                            color: '#aab7c4'
                        }
                    },
                    invalid: {
                        color: '#fa755a',
                        iconColor: '#fa755a'
                    }
                };
    
                card.mount('#card-element', {
                    style: style
                });
    
                // Handle real-time validation errors from the card Element.
                card.addEventListener('change', function(event) {
                    var displayError = document.getElementById('card-errors');
                    if (event.error) {
                        displayError.textContent = event.error.message;
                    } else {
                        displayError.textContent = '';
                    }
                });

    
            },
            getService() {
                const url = Endpoints.Visitor().viewService(this.$route.params.ser_id);
                axios
                    .get(url)
                    .then(req => {
                        this.service = req.data;
                        this.loader.close();
                    })
                    .catch(e => {
                        console.log(e);
                        this.loader.close();
                        // TODO: Error handler
                    });
            },
            formatDates(startDate, endDate) {
    
                const momentStartDate = moment(startDate);
                const momentEndDate = moment(endDate);
    
                return `${momentStartDate.format("MMMM Do YYYY")} - ${momentEndDate.diff(momentStartDate, 'days')} days`
            },
            goToStep2() {
                this.active++;
            }
        },
        mounted() {
            this.loader = this.$loading({
                fullscreen: true,
            });
    
            this.initStripe();
            this.getService();
        },
    }
</script>

<style>
    .stepper {
        padding: 0em 5em 2em 5em;
    }
    
    .checkout-top {
        background-image: url('http://localhost:3000/assets/imgs/chk_1.jpg');
        margin-bottom: 2em;
    }
    
    .checkout-boxes {
        margin-bottom: 2em !important;
    }
    
    .el-rate__icon {
        font-size: 24px;
    }
    
    .shortDescription {
        font-size: 0.8em;
    }
    
    .seventy-width {
        width: 70%;
    }
    
    .label {
        width: 100%;
        margin-bottom: 0.3em;
    }

    .StripeElement{
        background-color: #fff;
        padding: 10px 8px;
    }
    
    @media screen and (max-width: 999px) {
        .service-info-header {
            padding: 2em;
        }
        .box{
            margin: 0.3em;
        }
    }
</style>