<template>
    <div>
        <el-button class="button is-primary" @click="addDialogue = true">Add Image</el-button>
        <el-dialog title="Add an Image" v-model="addDialogue">
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
    </div>
</template>

<script>
    import axios from 'axios';
    import EndPoints from '../../services/EndPoints';
    import Form from '../../services/Form';
    import businessAuth from '../../services/auth/businessAuth'

    export default {
        data() {
            return {
                errors: [],
                form: new Form({
                    description: '',
                    path: '',
                }),
                addDialogue: false,
            }
        },
    
        methods: {
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
            addImage(formName) {
                this.addDialogue = false;
                axios.post(EndPoints.Business().addImage(this.$route.params.id), formName, {
                        headers: {
                            Authorization: businessAuth.getJWTtoken()
                        }
                    })
                    .then(() => {
                        this.form.reset();
                        this.$emit('imageAdd', res);
                        this.$notify({
                            title: 'Success!',
                            message: res.body.message,
                            type: 'success'
                        });
                    })
                    .catch(err => {
                        this.errors = err.response.data.errors
                        document.body.scrollTop = document.documentElement.scrollTop = 0;
                    });
            },
    
        }
    }
</script>
