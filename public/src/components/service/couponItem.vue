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
            <template>
                <el-dialog title="Delete Coupon" v-model="acceptDialogue" size="tiny">
            <span>Are you sure you wish to delete this coupon?</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="acceptDialogue = false">Cancel</el-button>
                <el-button type="primary" @click="deleteCoupon">Yes, I'm sure.</el-button>
            </span>
        </el-dialog>
                <a class="button is-danger is-outlined" @click="acceptDialogue = true">
                    <span>Delete</span>
                    <span class="icon is-small">
                          <i class="fa fa-times"></i>
                        </span>
                </a>
</template>
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
                endDate: this.getDateFormat(this.coupon.endDate),
                serviceID: this.coupon._service,
                acceptDialogue: false,
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
                this.$emit('deleted');
                this.acceptDialogue= false;
            },
        }
    };
</script>