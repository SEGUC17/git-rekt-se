<template>
    <el-form :model="infoForm" :rules="form1Rules" ref="infoForm" label-width="120px" label-position="top" class="demo-ruleForm">
    
        <el-form-item label="Description" prop="description">
            <el-input type="textarea" :autosize="{ minRows: 2}" v-model="infoForm.description"></el-input>
        </el-form-item>
    
        <el-form-item label="Working hours" prop="workingHours">
            <el-input type="textarea" :autosize="{ minRows: 1}" v-model="infoForm.workingHours"></el-input>
        </el-form-item>
    
        <el-form-item label="Categories" prop="categories">
            <el-select v-model="infoForm.categories" multiple :multiple-limit="3" placeholder="Select">
                <el-option v-for="category in categories" :key="category._id" :label="category.title" :value="category._id">
                </el-option>
            </el-select>
        </el-form-item>
    
        <el-form-item>
            <el-button type="primary" @click="submitForm('infoForm')">Create</el-button>
            <el-button @click="resetForm('infoForm')">Reset</el-button>
        </el-form-item>
    
    </el-form>
</template>

<script>
    import axios from 'axios';
    import Form from '../../services/Form';
    import {
        infoFormRules,
    } from '../../services/validation';
    
    import {
        Visitor,
        Business
    } from '../../services/EndPoints';
    import businessAuth from '../../services/auth/businessAuth';
    
    export default {
    
        data() {
            return {
                activeName: 'basicInfotab',
                infoForm: new Form({
                    description: '',
                    workingHours: '',
                    categories: [],
                }),
                categories: [],
                form1Rules: infoFormRules,
                errors: [],
                success: false,
                editSuccess: '',
            }
        },
        mounted() {
            axios.get(Business()
                .businessInfo, {
                    headers: {
                        Authorization: businessAuth.getJWTtoken(),
                    },
                }).then((infoResponse) => {
                axios.get(Visitor().businessCategories).then((categoriesResponse) => {
                    this.categories = categoriesResponse.data.results;
    
                    this.infoForm.description = infoResponse.data.results.description;
                    this.infoForm.workingHours = infoResponse.data.results.workingHours;
                    this.infoForm.categories = infoResponse.data.results.categories;
                    this.infoForm.categories = infoResponse.data.results.categories.map((cat) => {
                        return cat._id;
                    });
    
                }).catch(e => this.errors = e);
            }).catch(e => this.errors = e);
    
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        axios.put(Business().editInfo, this.infoForm.data(), {
                            headers: {
                                Authorization: businessAuth.getJWTtoken(),
                            },
                        }).then((response) => {
                            this.success = true;
                            this.editSuccess = response.data.message;
                            setTimeout(() => {
                                this.$router.go(this.$router.path);
                            }, 1000);
                        }).catch(e => this.errors = e);
                    } else {
                        errors = ['Please fill in the fields'];
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
        }
    
    }
</script>

<style>
    
</style>