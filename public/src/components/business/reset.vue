
<<template>
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
                }),
                errors: {},
                rules: {
                    password: [{
                        validator: validatePassword,
                        trigger: 'blur'
                    }],
                    confirmPassword: [{
                        validator: validateConfirmPassword,
                        trigger: 'blur'
                    }],
                }
            };
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        console.log(this.form.data);
                        this.form.post(EndPoints.Business().reset)
                            .then((data) => console.log(data))
                            .catch((err) => {
                                console.log(err);
                                console.log(this.form.errors);
                                console.log(this.form.errors.get('email'));
                            });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
        }
    }
</script>