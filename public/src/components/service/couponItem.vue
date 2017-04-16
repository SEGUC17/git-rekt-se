<template>
    <el-card class="box-card">
        <el-row type="flex" class="row-bg">
            <el-col :span="10">
                <h4 class="title is-5">
                    <span>
                  {{Code}}
               </span>
                </h4>
            </el-col>
            <el-col :span="6">
                <h4 class="title is-5">
                    <span>
                  {{Value}} %
               </span>
                </h4>
            </el-col>
            <el-col :span="12">
                <h4 class="title is-5">
                    <span>
                  {{startDate}}
               </span>
                </h4>
            </el-col>
            <el-col :span="12">
                <h4 class="title is-5">
                    <span>
                  {{endDate}}
               </span>
                </h4>
            </el-col>
            <a class="button is-danger is-outlined" href=deleteURL()>
                <span>Delete</span>
                <span class="icon is-small">
          <i class="fa fa-times"></i>
        </span>
            </a>
        </el-row>
    </el-card>
</template>

<script>
    export default {
        data() {
    
            return {
                couponID: this.coupon._id,
                Code: this.coupon.code,
                Value: this.coupon.discount,
                startDate: this.coupon.startDate,
                endDate: this.coupon.endDate,
                serviceID: this.coupon._service,
            };
        },
        props: ['coupon'],
    
        computed: {
            deleteURL() {
                return `/service/${this.serviceID}/coupons/delete/${this.couponID}`;
            },
        },
    };
</script>