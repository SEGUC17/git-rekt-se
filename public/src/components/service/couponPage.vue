<template>
  <div id="coupon-container" class="container">
    <h1 class="title">Add a Coupon</h1>
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
  
      <el-form-item>
        <el-button type="primary" @click="submitForm('couponForm')">Add</el-button>
        <el-button @click="resetForm('couponForm')">Reset</el-button>
      </el-form-item>
    </el-form>
    <h1 class="title">Current Coupons:</h1>
    <div>
      <el-card class="box-card">
        <el-row type="flex" class="row-bg">
          <el-col :span="6">
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
      <couponItem @deleted="fetchCoupons" v-for="coupon in coupons" :coupon="coupon" :key="coupon._id"></couponItem>
  
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
      fetchCoupons() { // this.$router.params.id
        axios.get(EndPoints.Service().viewCoupons('58f36821c82d1a37e868866b'))
          .then((res) => {
            this.coupons = res.data;
          })
          .catch(err => console.log(err));
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) { // this.$router.params.id
            axios.post(EndPoints.Service().addCoupon('58f36821c82d1a37e868866b'), this.couponForm)
              .then(() => {
                this.resetForm(formName);
                this.fetchCoupons();
                 alert('Coupon Added!');
              })
              .catch(err => console.log(err));
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
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
