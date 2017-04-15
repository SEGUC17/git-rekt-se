<template>
    <div class="columns is-mobile">
        <div class="column is-half is-offset-one-quarter">
    
            <div v-show="this.errors.length > 0">
                <div class="error" v-for="error in this.errors">
                    <el-alert title="error alert" type="error" :description="error" show-icon>
                    </el-alert>
                </div>
            </div>
    
            <div v-show="logged_in">
                <el-alert title="success alert" type="success" :description="loginSuccess" show-icon>
                </el-alert>
            </div>
    
    
            <h1 class="title has-text-centered">Login</h1>
    
            <el-form :model="form" ref="form" :rules="rules" label-width="100px" label-position="top" class="demo-ruleForm">
                <el-form-item label="Email" prop="email">
                    <el-input v-model="form.email" placeholder="Email"></el-input>
                </el-form-item>
    
                <el-form-item label="Password" prop="password">
                    <el-input v-model="form.password" placeholder="Password" type="password"></el-input>
                </el-form-item>
    
                <el-form-item>
                    <el-button type="primary" @click="submitForm('form')">Login</el-button>
                    <el-button @click="resetForm('form')">Reset</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import clientAuth from '../../services/clientAuth';
    import Form from '../../services/Form'
    
    export default {
        data() {
            return {
                form: new Form({
                    email: '',
                    password: '',
                }),
                rules: {
                    email: [{
                        required: true,
                        message: 'Please enter your email',
                        trigger: 'blur'
                    }],
                    password: [{
                        required: true,
                        message: 'Please enter your password',
                        trigger: 'blur'
                    }]
                },
                logged_in: false,
                loginSuccess: '',
                errors: [],
            }
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        clientAuth.login(this.form.data(), (err, response) => {
                            if (err) {
                               this.errors.push(err.errors[0]);
                            } else {
                                this.logged_in = true;
                                this.loginSuccess = response.body.message;
                                setTimeout(() => {
                                    this.$router.push('/')
                                }, 500);
                            }
                        });
                    } else {
                        this.errors.push('Please fill in all the fields');
                    }
                });
    
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
        }
    }
</script>
