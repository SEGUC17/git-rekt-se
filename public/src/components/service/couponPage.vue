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
        <el-form-item label="Discount Value (%)" prop="discount">
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
    <el-table :data="coupons" border stripe style="width: 100%">
      </el-table-column>
      <el-table-column prop="code" label="Code" width="250">
      </el-table-column>
      <el-table-column prop="discount" label="Discount Value (%)" width="200">
      </el-table-column>
  
      <el-table-column label="Start Date" width="250">
        <template scope="scope">
    <el-icon name="Start Date"></el-icon>
    <span>{{ getDateFormat(scope.row.startDate) }}</span>
</template>

</el-table-column>

<el-table-column label="End Date" width="250">
<template scope="scope">
  <el-icon name="End Date">
  </el-icon>
  <span>{{ getDateFormat(scope.row.endDate) }}</span>
</template>

</el-table-column>
 <el-table-column label="Operations" width="200">
<template scope="scope">
  <el-dialog title="Delete Coupon" v-model="deleteDialog" size="tiny">
    <span>Are you sure you wish to delete this coupon?</span>
    <span slot="footer" class="dialog-footer">
                  <el-button @click="deleteDialog = false">Cancel</el-button>
                  <el-button type="primary" @click="deleteCoupon(scope.$index, coupons)">Yes, I'm sure.</el-button>
              </span>
  </el-dialog>
  <a class="button is-danger is-outlined" @click="deleteDialog = true">
    <span>Delete</span>
    <span class="icon is-small">
                            <i class="fa fa-times"></i>
                          </span>
  </a>
</template>
           </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import axios from 'axios';
  import EndPoints from '../../services/EndPoints';
  
  export default {
    data() {
      return {
        coupons: [],
        errors: [],

        dialog: false,
        deleteDialog: false,

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
        this.dialog = false;
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
      deleteCoupon(index, rows) {
        this.deleteDialog= false;
        axios.post(EndPoints.Service().deleteCoupon(this.$route.params.ser_id, this.coupons[index]._id))
          .then(() => {
            rows.splice(index, 1);
            this.errors=[];
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
      },
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
    },
    mounted() {
      this.fetchCoupons();
    },
  };
</script>
