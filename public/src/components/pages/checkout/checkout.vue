<template>
    <div class="checkout">
        <serviceInfoHeader :service="service"></serviceInfoHeader>
    
        <!--- Checkout Steps -->
        <div class="stepper">
            <el-steps space="50%" :active="active" :center="true" :align-center="true">
                <el-step title="Select" icon="edit"></el-step>
                <el-step title="Review" icon="document"></el-step>
                <el-step title="Finish" icon="check"></el-step>
            </el-steps>
        </div>
    
        <div class="columns checkout-boxes">
    
            <checkoutStep1 class="column is-10 is-offset-1" :form="form" :service="service" v-show="active === 1" @reviewBooking="goToStep2"></checkoutStep1>
            <checkoutStep2 class="column is-12 columns " :service="service" :form="form" v-show="active === 2" @tokenGenerated="makeTransaction"></checkoutStep2>
            <checkoutStep3 v-if="active === 3"></checkoutStep3>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import {
        Visitor,
        Service
    } from '../../../services/EndPoints';
    import serviceInfoHeader from './serviceInfoHeader.vue';
    import checkoutStep1 from './checkoutStep1.vue';
    import checkoutStep2 from './checkoutStep2.vue';
    import checkoutStep3 from './checkoutStep3.vue';
    import clientAuth from '../../../services/clientAuth';
    
    export default {
        components: {
            serviceInfoHeader,
            checkoutStep1,
            checkoutStep2,
            checkoutStep3,
        },
    
        data() {
            return {
                active: 1,
                form: {
                    branch: '',
                    offering: '',
                    coupon: '',
                    token: '',
                },
                service: '',
                loader: '',
            };
        },
    
        methods: {
            getService() {
                const url = Visitor().viewService(this.$route.params.ser_id);
                axios
                    .get(url)
                    .then((req) => {
                        this.service = req.data;
                        this.loader.close();
                    })
                    .catch((e) => {
                        console.log(e);
                        this.loader.close();
                        // TODO: Error handler
                    });
            },
            goToStep2() {
                /*
                 *  Make the change between steps smoother.
                 */
    
                setTimeout(() => {
                    this.active = 2;
                }, 500);
            },
    
            makeTransaction() {
                this.loader = this.$loading({
                    fullscreen: true,
                });
    
                let url = Service().makeBooking;
                axios
                    .post(url, {
                        service: this.$route.params.ser_id,
                        offering: this.form.offering._id,
                        coupon: this.form.coupon._id,
                        token: this.form.token,
                    }, {
                        headers: {
                            Authorization: clientAuth.getJWTtoken(),
                        }
                    })
                    .then((response) => {
                        this.active = 3;
                        this.loader.close();
                    }).catch((e) => {
                        this.loader.close();
                    });
    
            }
        },
        mounted() {
            clientAuth.refreshAuth();
            if (!clientAuth.user.authenticated) {
                this.$router.push('/client/login');
                this.$toast.open({
                    message: 'You must be logged as a client to view this page.',
                    type: 'is-danger',
                    position: 'bottom',
                });
                return;
            }
    
            this.loader = this.$loading({
                fullscreen: true,
            });
            this.getService();
        },
    };
</script>

<style>
    .stepper {
        padding: 0em 5em 2em 5em;
    }
    
    .checkout-top {
        background-image: url('http://localhost:3000/assets/imgs/checkout/chk_1.jpg');
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
    
    .StripeElement {
        background-color: #fff;
        padding: 10px 8px;
    }
    
    @media screen and (max-width: 999px) {
        .service-info-header {
            padding: 2em;
        }
        .box {
            margin: 0.3em;
        }
    }
</style>
