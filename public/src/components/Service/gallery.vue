<template>
    <div>
        <div v-show="errors.length>0">
            <div class="error" v-for="(error,idx) in errors">
                <el-alert @close="closeError(idx)" :title="error" type="error" show-icon></el-alert>
            </div>
        </div>
        <el-button class="button is-primary" @click="addDialog = true">Add Image</el-button>
        <el-dialog title="Add an Image" v-model="addDialog">
            <form method="post" @submit.prevent="onSubmit" enctype="multipart/form-data">
    
                <label class="label">Description</label>
                <p class="control">
                    <input class="form-control" type="String" v-model="form.description">
                </p>
    
                <label class="label">Image</label>
                <p class="control has-icon has-icon-right">
                    <input type="file" name="image" class="form-control" accept="image/*" @change="fileChanged">
                </p>
                <p class="control">
                    <button type="submit" class="button is-primary">Submit</button>
                </p>
            </form>
        </el-dialog>
        <template>
        <el-row>
            <el-col :span="8" v-for="image in images":key="image._id" v-bind:data="image">
                <el-card :body-style="{ padding: '0px' }">
                    <img src="image.path" class="image">
                    <div style="padding: 14px;">
                        <span>{{image.description}}</span>
                        <div class="bottom clearfix">
                            <!--<editButton :key="image._id" :imageID="image._id"></editButton>
                            <deleteButton :key="image._id" :imageID="image._id"></deleteButton>-->
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
</template>
        
    </div>
</template>

<script>
    import axios from 'axios';
    import EndPoints from '../../services/EndPoints';
    import Form from '../../services/Form';
    import businessAuth from '../../services/auth/businessAuth'
    import editButton from '../Service/galleryEdit.vue'
    import deleteButton from '../Service/galleryDelete.vue'
    
    export default {
        data() {
            return {
                errors: [],
                images: [],
                form: new Form({
                    description: '',
                    path: '',
                }),
                addDialog: false,
            }
        },
        mounted() {
            this.getGallery();
        },
        methods: {
            closeError(idx) {
                this.errors.splice(idx, 1);
            },
            onSubmit() {
                this.addDialog = false;
                if (this.form.path) {
                    if (this.isImage(this.form.path)) {
                        let data = new FormData();
                        data.append('path', this.form.path);
                        data.append('description', this.form.description);
    
                        this.form.errors.clear();
                        this.addImage(data);
                    } else {
                        this.errors = ['You can only submit Images.'];
                        this.form.path = '';
                    }
                } else {
                    this.errors = ['Image is required.'];
                }
            },
            fileChanged(e) {
                const files = e.target.files || e.dataTransfer.files;
                if (files.length > 0) {
                    this.form.path = files[0];
                    // the path is changed to the possibly illegal file for consistency with submission
                    if (this.isImage(files[0])) {
                        this.errors = [];
                    } else {
                        this.errors = ['Only Images are allowed.'];
                    }
                }
            },
            isImage(file) {
                if (file.type.split('/')[0] === 'image') {
                    return true;
                } else {
                    return false
                }
            },
            getGallery() {
                axios.get(EndPoints.Service().viewGallery(this.$route.params.id), {
                        headers: {
                            Authorization: businessAuth.getJWTtoken()
                        }
                    })
                    .then((res) => {
                        this.images = res.data;
                        this.errors = [];
                    })
                    .catch(err => {
                        this.errors = err.response.data.errors;
                        document.body.scrollTop = document.documentElement.scrollTop = 0;
                    });
            },
            addImage(data) {
                this.addDialog = false;
                axios.post(EndPoints.Service().addImage(this.$route.params.id), data, {
                        headers: {
                            Authorization: businessAuth.getJWTtoken()
                        }
                    })
                    .then((res) => {
                        this.form.reset();
                        this.$emit('imageAdd');
                        this.$notify({
                            title: 'Success!',
                            message: res.data.message,
                            type: 'success'
                        });
                    })
                    .catch(err => {
                        this.errors = err.response.data.errors;
                        document.body.scrollTop = document.documentElement.scrollTop = 0;
                    });
            },
        }
    }
</script>
