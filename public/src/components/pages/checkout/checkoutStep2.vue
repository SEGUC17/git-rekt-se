<template>
    <div class="step2">
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
                <h1 class="title is-5">{{ service.name }}</h1>
                <p class="subtitle is-6">{{ service.businessName }}</p>
    
                <div class="timing">
                    <p class="icon-margin">
                        <span class="icon">
                                          <i class="checkout-i fa fa-calendar"></i>
                </span> {{ form.offering.startDate | moment}}
                    </p>
                    <p class="icon-margin">
                        <span class="icon">
                <i class="checkout-i fa fa-calendar"></i>
                </span> {{ form.offering.endDate | moment}}
                    </p>
    
                    <p class="icon-margin">
                        <span classs="icon">
                 <i class="checkout-i fa fa-clock-o"></i>
                </span> {{ getServiceDuration(form.offering.startDate, form.offering.endDate) }}
                    </p>
    
                </div>
    
                <div class="serviceloc">
                    <p class="icon-margin">
                        <span classs="icon">
                <i class="checkout-i fa fa-location-arrow"></i>
                </span> {{ form.offering.location }}
                    </p>
    
                    <p class="icon-margin">
                        <span classs="icon">
                <i class="checkout-i fa fa-map-marker"></i>
                </span> {{ form.offering.address }}
                    </p>
                </div>
    
                <div class="payment">
                    <p class="icon-margin">
                        <span classs="icon">
                                                    <i class="checkout-i fa fa-money"></i>
                                        </span> {{ form.offering.price }} EGP
                    </p>
                </div>
    
                <hr />
    
                <div class="coupon" v-show="form.coupon">
    
                    <p>
                        <span classs="icon">
                             <i class="checkout-i fa fa-tag"></i>
                        </span> {{ coupon }}:
                        <span class="is-pulled-right"> -{{ form.offering.price - price }} EGP.</span>
                    </p>
                    <hr />
                </div>
    
                <p class="title is-5">
                    Subtotal:
                    <span class="is-pulled-right">{{ price }} EGP.</span>
                </p>
                <el-button type="success">Confirm Booking</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import Endpoints from '../../../services/EndPoints.js';
    import moment from 'moment';
    
    export default {
        props: ['form', 'service'],
    
        data() {
            return {
                stripeError: '',
                invalidCoupon: '',
                validCoupon: '',
                coupon: undefined,
            }
        },
    
        computed: {
            price() {
                const originalPrice = this.form.offering.price;
                const coupon = this.form.coupon;
                return parseFloat(originalPrice) * (coupon ? ((100 - parseInt(coupon.discount)) / 100.0) : 1);
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
    
            validateCoupon() {
                const url = Endpoints.Service().validateCoupon;
                this.form.coupon = '';
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
                    .catch(e => {
                        this.invalidCoupon = e.response.data.errors[0];
                    });
            },
    
            getServiceDuration(startDate, endDate) {
                const momentStartDate = moment(startDate);
                const momentEndDate = moment(endDate);
                return `${momentEndDate.diff(momentStartDate, 'days')} days.`;
            }
        },
    
        mounted() {
            this.initStripe();
        },
    
        filters: {
            moment(date) {
                return moment(date).format("dddd MMMM Do YYYY.");
            }
        }
    }
</script>

<style>
    .serviceloc,
    .payment,
    .timing {
        margin-bottom: 1em;
    }
    
    .icon-margin {
        margin-bottom: 0.5em !important;
    }
    
    .checkout-i {
        font-size: 1.5rem !important;
    }
</style>