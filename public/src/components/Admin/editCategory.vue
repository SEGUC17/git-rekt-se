<template>
    <div class="main">
        <div class="container">
            <el-card class="create-category">
                <el-alert v-for="error in generalErrors" type="error" :title="error" show-icon></el-alert>
                <div slot="header" class="clearfix">
                    <span>Create category</span>
                </div>
                <el-alert v-if="createSuccess" type="success" :title="createSuccess" show-icon></el-alert>
                <el-alert v-if="editSuccess" type="success" :title="editSuccess" show-icon></el-alert>
                <el-alert v-if="deleteSuccess" type="success" :title="deleteSuccess" show-icon></el-alert>
                <el-alert v-for="error in createErrors" type="error" :title="error" show-icon></el-alert>
                <el-form :model="newCategory" ref="createCategory" :rules="categoryRules" label-position="left">
                    <el-form-item label="type" required prop="type">
                        <el-input v-model="newCategory.type" placeholder="The type of your category"></el-input>
                    </el-form-item>
                    <el-form-item label="title" required prop="title">
                        <!--TODO use radio buttons-->
                        <el-input v-model="newCategory.title" placeholder="Title of your category"></el-input>
                    </el-form-item>
                    <!--TODO Upload Cover Image-->
                    <el-form-item class="is-pulled-right">
                        <el-button type="primary" @click="createCategory">Create</el-button>
                        <el-button @click="resetCreate">Clear</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </div>
        <div class="catgory-list">
            <el-card class="Category-card" v-for="category in categories" :key="category._id">
                <span>{{category.title}}</span>
                <div class="Category-buttons is-pulled-right">
                    <el-button icon="edit" @click="showEdit(category)">
                        Edit Category
                    </el-button>
                    <el-button icon="delete" @click="showDelete(category)" type="danger">
                        Delete Category
                    </el-button>
                </div>
            </el-card>
        </div>
        <div>
            <!--last part-->
            <el-dialog title="Edit Category" v-model="editVisible" size="large">
                <el-form ref="editCategory" :model="categoryToEdit" :rules="categoryRules" label-position="left">
                    <el-alert v-for="error in editErrors" type="error" :title="error" show-icon></el-alert>
                    <el-form-item label="type" required prop="type">
                        <el-input v-model="categoryToEdit.type" placeholder="The type of your Category"></el-input>
                    </el-form-item>
                    <el-form-item label="title" required prop="title">
                        <el-input v-model="categoryToEdit.title" placeholder="The title of your Category"></el-input>
                    </el-form-item>
                    <!--TODO Upload Cover Image-->
                </el-form>
                <span slot="footer" class="dialog-footer">
                                <el-button @click="editVisible = false">Cancel</el-button>
                                <el-button type="primary" @click="editCategory">Edit</el-button>
                              </span>
            </el-dialog>
            <el-dialog title="Delete Category" v-model="deleteVisible" size="small">
                <span>This cannot be undone. Delete this Category?</span>
                <span slot="footer" class="dialog-footer">
                                <el-button @click="deleteVisible = false">Cancel</el-button>
                                <el-button type="danger" @click="deleteCategory">Delete</el-button>
                              </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import Axios from 'axios';
    import {
        categoryRules
    } from '../../services/validation.js';
    import EndPoints from '../../services/EndPoints.js';
    
    export default {
        data() {
            return {
                categories: [],
                newCategory: {
                    type: '',
                    title: '',
                    icon: '',
                },
                generalErrors: [],
                categoryRules,
                createSuccess: '',
                createErrors: [],
                categoryToEdit: {
                    _id: '',
                    type: '',
                    title: '',
                    icon: '',
                },
                editVisible: false,
                editSuccess: '',
                editErrors: [],
                categoryToDelete: {
                    _id: '',
                },
                deleteVisible: false,
                deleteSuccess: '',
                deleteErrors: [],
            };
        },
        methods: {
            createCategory() {
                this.createSuccess = '';
                this.createErrors = [];
                this.$refs.createCategory.validate((valid) => {
                    if (valid) {
                        const loader = this.$loading({
                            fullscreen: true,
                        });
                        Axios.post(EndPoints.Admin().createCategory, this.newCategory)
                            .then((response) => {
                                loader.close();
                                this.createSuccess = response.data.message;
                                this.resetCreate();
                                this.getCategories();
                            })
                            .catch((error) => {
                                loader.close();
                                this.createErrors = error.response.data.errors.map((err) => {
                                    if (typeof err === 'string') {
                                        return err;
                                    }
                                    return err.msg;
                                });
                            });
                    }
                });
            },
            editCategory() {
                this.editSuccess = '';
                this.editErrors = [];
                this.$refs.editCategory.validate((valid) => {
                    if (valid) {
                        const loader = this.$loading({
                            fullscreen: true,
                        });
                        //TODO: add auth
                        Axios.post(EndPoints.Admin().editCategory(this.categoryToEdit._id), this.categoryToEdit)
                            .then((response) => {
                                this.editSuccess = response.data.message;
                                this.editVisible = false;
                                loader.close();
                                this.getCategories();
                            })
                            .catch((error) => {
                                loader.close();
                                this.editErrors = error.response.data.errors.map((err) => {
                                    if (typeof err === 'string') {
                                        return err;
                                    }
                                    return err.msg;
                                });
                            });
                    }
                });
            },
            deleteCategory() {
                this.deleteSuccess = '';
                this.deleteErrors = [];
                const loader = this.$loading({
                    fullscreen: true,
                });
                Axios.post(EndPoints.Admin().deleteCategory(this.categoryToDelete._id), null)
                    .then((response) => {
                        this.deleteSuccess = response.data.message;
                        this.deleteVisible = false;
                        loader.close();
                        this.getCategories();
                    })
                    .catch((error) => {
                        loader.close();
                        this.deleteErrors = error.response.data.errors.map((err) => {
                            if (typeof err === 'string') {
                                return err;
                            }
                            return err.msg;
                        });
                    });
            },
            resetCreate() {
                this.$refs.createCategory.resetFields();
            },
            getCategories() {
                const loader = this.$loading({
                    fullscreen: true,
                });
                //TODO: add authentication
                Axios.get(EndPoints.Admin().listCategories)
                    .then((response) => {
                        loader.close();
                        this.categories = response.data.category;
                    })
                    .catch((error) => {
                        loader.close();
                        this.generalErrors = error.response.data.errors.map((err) => {
                            if (typeof err === 'string') {
                                return err;
                            }
                            return err.msg;
                        });
                    });
            },
            showEdit(category) {
                this.categoryToEdit = category;
                this.editVisible = true;
            },
            showDelete(category) {
                this.categoryToDelete = category;
                this.deleteVisible = true;
            }
        },
        mounted() {
            this.getCategories();
            Axios.get(EndPoints.Admin().listCategories, {
                    headers: {
                        Authorization: BusinessAuth.getJWTtoken(),
                    },
                })
                .then((response) => {
                    this.categories = response.data.categories;
                })
                .catch((error) => {
                    this.generalErrors = error.response.data.errors.map((err) => {
                        if (typeof err === 'string') {
                            return err;
                        }
                        return err.msg;
                    });
                });
        },
    
    }
</script>
