<template>
    <div class="step2" >
        <div class="column is-6 is-offset-1">
    
            <div class="box">
                <h1 class="title is-4">Booking Information</h1>
                <hr />
                <div class="field">
                    <p class="label">Credit or debit card</p>
                    <div id="card-element" class="seventy-width el-input__inner"></div>
                    <div id="card-errors" class="help is-danger" v-show="stripeError">{{ stripeError }}</div>
                </div>
    
                <div class="field">
                    <p class="label">Coupon (optional)</p>
                    <el-input placeholder="coupon code" class="seventy-width" v-model="coupon"></el-input>
                    <el-button type="primary" @click="validateCoupon">Validate</el-button>
                    <span class="help is-danger" v-show="invalidCoupon">{{ invalidCoupon }}</span>
                    <span class="help is-success" v-show="validCoupon">{{ validCoupon }}</span>
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
                            <el-rate class="is-pulled-right" v-model="form.rating" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" disabled></el-rate>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Endpoints from '../../../services/EndPoints.js';

    export default {
        props: ['form'],
        
        data() {
            return {
                stripeError: '',
                invalidCoupon: '',
                validCoupon: '',
                coupon: '',
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
                var self = this;
                card.addEventListener('change', function(event) {
                    self.stripeError = event.error ? event.error.message : '';
                });
            },

            validateCoupon(){
                const url = Endpoints.Service().validateCoupon;
                this.invalidCoupon = '';
                this.validCoupon = '';

                axios
                .post(url, {
                    code: this.coupon,
                    serviceId: this.$route.params.ser_id,
                })
                .then((data) => {
                    this.form.coupon = data.data;
                    this.coupon = data.data.code;
                    this.validCoupon = 'Coupon applied.';
                })
                .catch(e =>{
                     this.invalidCoupon = e.response.data.errors[0];
                });
            }
        },

        mounted(){
            this.initStripe();
        },
    }
</script>