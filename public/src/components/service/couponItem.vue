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
            <el-col :span="10">
                <h4 class="title is-5">
                    <span>
                              {{Value}} %
                           </span>
                </h4>
            </el-col>
            <el-col :span="10">
                <h4 class="title is-5">
                    <span>
                              {{startDate}}
                           </span>
                </h4>
            </el-col>
            <el-col :span="10">
                <h4 class="title is-5">
                    <span>
                              {{endDate}}
                           </span>
                </h4>
            </el-col>
            <a class="button is-danger is-outlined" @click="deleteCoupon">
                <span>Delete</span>
                <span class="icon is-small">
                      <i class="fa fa-times"></i>
                    </span>
            </a>
        </el-row>
    </el-card>
</template>

<script>
    import EndPoints from '../../services/EndPoints';
    export default {
    
    
        data() {
    
            return {
                couponID: this.coupon._id,
                Code: this.coupon.code,
                Value: this.coupon.discount,
                startDate: this.getDateFormat(this.coupon.startDate),
                endDate:  this.getDateFormat(this.coupon.endDate),
                serviceID: this.coupon._service,
            };
        },
        props: ['coupon'],
    
        methods: {
    
            getDateFormat(input) { // dd/mm/yyyy
                var date = new Date(input)
                var curr_date = date.getDate();
                var curr_month = date.getMonth() + 1; //Months are zero based
                if (curr_month < 10)
                    curr_month = '0' + curr_month;
                if (curr_date < 10)
                    curr_date = '0' + curr_date;
                var curr_year = date.getFullYear();
                return (curr_date + "-" + curr_month + "-" + curr_year);
            },
    
            deleteCoupon() {
                axios.post(EndPoints.Service().deleteCoupon('58f36821c82d1a37e868866b', this.couponID))
                    .then(() => {
                        this.$emit('deleted');
                        alert('Coupon Deleted!');
                    })
                    .catch(err => console.log(err))
            },
        }
    };
</script>