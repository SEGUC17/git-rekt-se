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
                this.addDialogue = false;

                let data = new FormData();
                data.append('path', this.form.path);
                data.append('description', this.form.description);

                this.form.errors.clear();
                this.addImage(data);
            },
            fileChanged(e) {
                const files = e.target.files || e.dataTransfer.files;
                if (files.length > 0) {
                    this.form.path = files[0];
                }
            },
            addImage(formName) {
                this.addDialogue = false;
                axios.post(EndPoints.Business().addImage(this.$route.params.id), formName)
                    .then(() => {
                        this.form.reset();
                        this.$emit('imageAdd');
                        this.$notify({
                            title: 'Success!',
                            message: 'Image Added!',
                            type: 'success'
                        });
                    })
                    .catch(err => {
                        for (var i = 0; i < err.response.data.errors.length; i++) {
                            this.errors.push(err.response.data.errors[i]);
                        };
                        document.body.scrollTop = document.documentElement.scrollTop = 0;
                    });
            },
    
        }
    }
</script>
