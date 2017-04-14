<template>
    <div class="columns is-mobile">
        <div class="column is-half is-offset-one-quarter">
    
            <div v-show="!form.errors.isEmpty()">
                <div class="error" v-for="key in form.keys" v-show="form.errors.has(key)">
                    <el-alert @close="form.errors.remove(key)" :title="key.toUpperCase()" type="error" :description="form.errors.getFirst(key)" show-icon></el-alert>
                </div>
            </div>
    
            <h1 class="title has-text-centered">Login</h1>
    
            <el-form :model="form" :rules="rules" ref="form" label-width="100px" label-position="top" class="demo-ruleForm">
                <el-form-item label="Email" prop="email">
                    <el-input v-model="form.email" placeholder="Email"></el-input>
                </el-form-item>
    
                <el-form-item label="Password" prop="password">
                    <el-input v-model="form.password" placeholder="Password" type="password"></el-input>
                </el-form-item>
                <el-form-item>
    
                    <el-button type="primary" @click="submitForm">Create</el-button>
                    <el-button @click="resetForm">Reset</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import Form from '../../services/Form.js';
    import Errors from '../../services/Errors.js';
    import clientAuth from '../../services/clientAuth.js';    
    export default {
        data() {
            return {
                form: new Form({
                    email: '',
                    password: ''
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
            }
        },
        methods: {
            submitForm() {
                this.$refs[formName].validate((valid) => {
                    if(valid){
                        clientAuth.login(form.data(), (err, response) => {
                            if(err){
                                this.form.onFailue(err);
                            } else {
                                console.log('Hello World');
                                console.log(response);
                            }
                        });
                    } else {
                        this.form.onFailue('Please fill the missing fields');
                    }
                });
               
            },
            resetForm() {
                this.form.reset();
            }
        }
    }
</script>
