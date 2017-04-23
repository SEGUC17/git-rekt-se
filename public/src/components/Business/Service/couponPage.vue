<template>
  <div class="coupons-edits">

    <!-- Coupon General Errors -->
    <div class="errors" v-if="errors.length>0">
      <el-alert v-for="error in errors" class="error" :key="error"
                @close="errors.splice(idx, 1)" :title="error"
                type="error" show-icon>
      </el-alert>
    </div>

    <!-- Add Coupon Button -->
    <el-button
            size="large"
            class="margin-bot-1"
            @click="dialog = true"
            type="primary">
      Add Coupon

    </el-button>

    <b-table
            :data="coupons"
            :striped="true"
            :narrowed="false"
            :mobile-cards="true"
            :paginated="true"
            :per-page="10"
            :pagination-simple="false"
            default-sort="code"
            render-html>

      <b-table-column field="code" label="Code" sortable></b-table-column>
      <b-table-column field="discount" label="Discount (%)" sortable></b-table-column>
      <b-table-column field="startDate" label="Start Date" :format="formatDate"></b-table-column>
      <b-table-column field="endDate" label="End Date" :format="formatDate"></b-table-column>
      <b-table-column field="_id" label="Delete" component="coupon-delete-btn"></b-table-column>
    </b-table>

    <!-- Delete Coupon Modal-->
    <el-dialog title="Delete Coupon" v-model="deleteDialog" size="tiny">
      <span>Are you sure you wish to delete this coupon?</span>
      <span slot="footer" class="dialog-footer">
          <el-button @click="deleteDialog = false">Cancel</el-button>
          <el-button type="danger" @click="deleteCoupon">Yes, I'm sure.</el-button>
      </span>
    </el-dialog>

    <!-- Add Coupon Modal -->
    <el-dialog title="Add a Coupon" v-model="dialog">

      <!-- Coupon Add Errors -->
      <div class="errors" v-if="addErrors.length>0">
        <el-alert v-for="error in addErrors" class="error" :key="error"
                  @close="addErrors.splice(idx, 1)" :title="error"
                  type="error" show-icon>
        </el-alert>
      </div>

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
  </div>
</template>

<script>
 /**
  * This component allows a business to add and delete coupons
  */
  import axios from 'axios';
  import moment from 'moment';
  import EventBus from '../../../services/EventBus';
  import { Service } from '../../../services/EndPoints';
  import businessAuth from '../../../services/auth/businessAuth';
  import { businessAddCoupon } from '../../../services/validation';
  import JWTCheck from '../../../services/JWTErrors';
  
  export default {
    /**
     * Data used by this component.
     * coupons: Available coupons.
     * errors: Errors received from server.
     * rules: Validation Rules used to validate input.
     * dialog: true to show dialog, false otherwise.
     * deleteDialog: true to show delete dialog, false otherwise.
     * loader: Loader Object to display loading screen.
     * couponToDelete: The Coupon chosen to delete.
     * couponForm: Data to create a new coupon with.
     */
    data() {
      return {
        coupons: [],
        errors: [],
        addErrors: [],
        rules: businessAddCoupon,

        dialog: false,
        deleteDialog: false,
        loader: '',

        couponToDelete: '',

        couponForm: {
          code: '',
          discount: 1,
          startDate: '',
          endDate: '',

        },
      };
    },
    /**
     * All Methods used by this component.
     */
    methods: {
      /**
       * Fetch all coupons
       */
      fetchCoupons() {
        this.loader = this.$loading({
          fullscreen: true,
        });
        axios.get(Service().viewCoupons(this.$route.params.ser_id),
            { headers: { Authorization: businessAuth.getJWTtoken() } })
            .then((res) => {
              this.coupons = res.data;
              this.errors = [];
              this.loader.close();
            })
            .catch((err) => {
              this.loader.close();
              if(err.response && JWTCheck(err.response.data.errors)) {
                businessAuth.removeData();
                this.$router.push('/');
                this.$toast.open({
                  text: 'Your sessions has expired. Please login.',
                  position: 'bottom',
                  type: 'danger'
                });
              } else {
                this.errors = err.response.data.errors;
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
              }
            });
      },
      /**
       * Validate and submit form.
       */
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loader = this.$loading({
              fullscreen: true,
            });
            axios.post(Service().addCoupon(this.$route.params.ser_id), this.couponForm,
                { headers: { Authorization: businessAuth.getJWTtoken() } })
                .then(() => {
                  this.resetForm(formName);
                  this.addErrors = [];
                  this.fetchCoupons();
                  this.dialog = false;
                  this.$toast.open({
                    title: 'Success!',
                    message: 'Coupon Added!',
                    type: 'is-success',
                  });
                  this.loader.close();
                })
                .catch((err) => {
                  this.loader.close();
                  if(err.response && JWTCheck(err.response.data.errors)) {
                    businessAuth.removeData();
                    this.$router.push('/');
                    this.$toast.open({
                      text: 'Your sessions has expired. Please login.',
                      position: 'bottom',
                      type: 'danger'
                    });
                  } else {
                    this.addErrors = err.response.data.errors;
                  }
                });
          }
        });
      },
      /**
       * Reset form.
       */
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      /**
       * Delete a coupon
       */
      deleteCoupon() {
        this.deleteDialog = false;
        axios.post(Service().deleteCoupon(this.couponToDelete._service,
            this.couponToDelete._id), null,
            { headers: { Authorization: businessAuth.getJWTtoken() } })
            .then(() => {
              this.errors = [];
              this.$toast.open({
                message: 'Coupon Deleted!',
                type: 'is-success',
              });
              this.fetchCoupons();
            })
            .catch((err) => {
              if(err.response && JWTCheck(err.response.data.errors)) {
                    businessAuth.removeData();
                    this.$router.push('/');
                    this.$toast.open({
                      text: 'Your sessions has expired. Please login.',
                      position: 'bottom',
                      type: 'danger'
                    });
                  } else {
                    this.errors = err.response.data.errors;
                    document.body.scrollTop = 0;
                    document.documentElement.scrollTop = 0;
                  }
            });
      },
      /**
       * Format Date.
       */
      formatDate(value, row) {
        return moment(value).format('MMMM Do YYYY');
      },
    },
    /**
     * Ran when component is mounted on DOM.
     * Route user back if he/she is not authenticated,
     * otherwise emit and event and fetch coupons.
     */
    mounted() {
      if (!businessAuth.isAuthenticated()) {
        this.$router.push('/404');
        return;
      }
      EventBus.$on('showCouponDeleteDialog', (row) => {
        this.couponToDelete = row;
        this.deleteDialog = true;
      });

      this.fetchCoupons();
    },
  };
</script>
