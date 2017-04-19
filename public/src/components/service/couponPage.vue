<template>
  <div id="coupon-container" class="container">
    <div v-show="errors.length>0">
      <div class="error" v-for="(error,idx) in errors">
        <el-alert @close="closeError(idx)" :title="error" type="error" show-icon></el-alert>
      </div>
    </div>
    <el-button class="button is-primary" @click="dialog = true">Add a Coupon</el-button>
    <el-dialog title="Add a Coupon" v-model="dialog">
      <el-form :model="couponForm" :rules="rules" ref="couponForm" label-width="130px" class="demo-couponForm">
        <el-form-item label="Coupon Code" prop="code">
          <el-input v-model="couponForm.code"></el-input>
        </el-form-item>
        <el-form-item label="Discount Value" prop="discount">
          <el-input-number v-model="couponForm.discount" :min="1" :max="100"></el-input-number>
        </el-form-item>
        <el-form-item label="Start Date" required>
          <el-col :span="11">
            <el-form-item prop="startDate">
              <el-date-picker type="date" placeholder="Pick a date" v-model="couponForm.startDate" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="End Date" required>
          <el-col :span="11">
            <el-form-item prop="endDate">
              <el-date-picker type="date" placeholder="Pick a date" v-model="couponForm.endDate" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
              </el-form>
        <span slot="footer" class="dialog-footer">
                  <el-button @click="dialog = false">Cancel</el-button>
                  <el-button @click="resetForm('couponForm')">Reset</el-button>
                  <el-button type="primary" @click="submitForm('couponForm')">Confirm</el-button>
                </span>

    </el-dialog>
    <h1 class="title" v-show="coupons.length>0">Current Coupons:</h1>
    <div>
      <el-card class="box-card" v-show="coupons.length>0">
        <el-row type="flex" class="row-bg">
          <el-col :span="5">
            <h4 class="title is-4">
              <span>
                                    Coupon Code
                                 </span>
            </h4>
          </el-col>
          <el-col :span="6">
            <h4 class="title is-4">
              <span>
                                    Discount (%)
                                 </span>
            </h4>
          </el-col>
          <el-col :span="6">
            <h4 class="title is-4">
              <span>
                                    Start Date
                                 </span>
            </h4>
          </el-col>
          <el-col :span="8">
            <h4 class="title is-4">
              <span>
                                    End Date
                                 </span>
            </h4>
          </el-col>
        </el-row>
      </el-card>
      <couponItem @deleted="deleteCoupon(coupon._id)" v-for="coupon in coupons" :coupon="coupon" :key="coupon._id"></couponItem>
  
    </div>
  
  
  </div>
</template>

<script>
  import axios from 'axios';
  import EndPoints from '../../services/EndPoints';
  import couponItem from './couponItem.vue';
  
  export default {
    data() {
      return {
        coupons: [],
        errors: [],
        dialog: false,
        couponForm: {
          code: '',
          discount: 1,
          startDate: '',
          endDate: '',
        },
        rules: {
          code: [{
            required: true,
            message: 'Please input Coupon Code',
            trigger: 'blur'
          }, ],
          discount: [{
            type: 'number',
            required: true,
            message: 'Please input Discount Value',
            trigger: 'change'
          }, ],
          startDate: [{
            type: 'date',
            required: true,
            message: 'Please pick a Start date',
            trigger: 'change'
          }],
          endDate: [{
            type: 'date',
            required: true,
            message: 'Please pick an End date',
            trigger: 'change'
          }],
        }
      };
    },
    props: ['service'],
  
    methods: {
      closeError(idx) {
        this.errors.splice(idx, 1);
      },
      fetchCoupons() {
        axios.get(EndPoints.Service().viewCoupons(this.$route.params.ser_id))
          .then((res) => {
            this.coupons = res.data;
            this.errors = [];
          })
          .catch(err => {
            this.errors = err.response.data.errors;
            document.body.scrollTop = document.documentElement.scrollTop = 0;
          });
      },
      submitForm(formName) {
        this.dialog= false;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            axios.post(EndPoints.Service().addCoupon(this.$route.params.ser_id), this.couponForm)
              .then(() => {
                this.resetForm(formName);
                this.fetchCoupons();
                this.$notify({
                  title: 'Success!',
                  message: 'Coupon Added!',
                  type: 'success'
                });
              })
              .catch(err => {
                this.errors = err.response.data.errors;
                document.body.scrollTop = document.documentElement.scrollTop = 0;
              });
          } else {
            this.errors = ['Invalid Input(s)!'];
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      deleteCoupon(couponID) {
        axios.post(EndPoints.Service().deleteCoupon(this.$route.params.ser_id, couponID))
          .then(() => {
            this.fetchCoupons();
            this.$notify({
              title: 'Success!',
              message: 'Coupon Deleted!',
              type: 'success'
            });
          })
          .catch(err => {
            this.errors = err.response.data.errors;
            document.body.scrollTop = document.documentElement.scrollTop = 0;
          });
      }
    },
    mounted() {
      this.fetchCoupons();
    },
    components: {
      couponItem,
    },
  };
</script>
