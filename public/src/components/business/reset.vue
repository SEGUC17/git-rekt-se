
<<template>
    <div class="columns is-mobile">
        <div class="column is-half is-offset-one-quarter">
            <div>
                <div class="alert" >
                    <div class="message" v-show="alert_show">
                        <el-alert :title="message" type="success" show-icon></el-alert>
                    </div>
                    <div class="message" v-show="error_show">
                        <el-alert v-for="error in errors" :key="error" :title="error" type="error" show-icon></el-alert>
                    </div>
                </div>
    
                <h1 class="title has-text-centered">Reset Password</h1>
                <el-form :model="form" :rules="rules" ref="form" label-width="120px" class="demo-ruleForm">
                    <el-form-item label="Password" prop="password">
                        <el-input type="password" v-model="form.password" auto-complete="off"></el-input>
                    </el-form-item>
    
                    <el-form-item label="Confirm Password" prop="confirmPassword">
                        <el-input type="password" v-model="form.confirmPassword" auto-complete="off"></el-input>
                    </el-form-item>
    
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('form')">Submit</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import Form from '../../services/Form';
    import EndPoints from '../../services/EndPoints';
    
    export default {
        data() {
            var validatePassword = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('Please input a password'));
                } else {
                    if (!(/^(?=.*\d).{8,15}$/.test(value))) {
                        callback(new Error('Password must be between 8 and 15 characters and contains at least one number.'));
                    } else {
                        if (this.form.confirmPassword !== '') {
                            this.$refs.form.validateField('confirmPassword');
                        }
                        callback();
                    }
    
                }
            };
            var validateConfirmPassword = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('Please insert a password!'));
                } else if (value !== this.form.password) {
                    callback(new Error('The two inputs don\'t match!'));
                } else {
                    callback();
                }
            };
            return {
                form: new Form({
                    password: '',
                    confirmPassword: '',
                    token: this.$route.params.token,
                }),
                errors: [],
                rules: {
                    password: [{
                        validator: validatePassword,
                        trigger: 'blur'
                    }],
                    confirmPassword: [{
                        validator: validateConfirmPassword,
                        trigger: 'blur'
                    }],
                },
                message: '',
                alert_show: false,
                error_show: false,
            };
        },
        computed: {
            tokenGetter: function() {
                return this.$route.params;
                console.log(this.$route.params);
            }
        },
        methods: {
            submitForm(formName) {
                console.log(this.form);
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        console.log(this.form.data);
                        this.form.post(EndPoints.Business().reset)
                            .then((data) => {
                                console.log(data);
                                this.message = data.message;
                                this.alert_show = true;
                            })
                            .catch((err) => {
                                console.log(err);
                                this.errors = err;
                                this.error_show = true;
                            });
                    } else {
                        this.errors = ['Please insert correct inputs'];
                        this.error_show = true;
                    }
                });
            },
        }
    }
</script>