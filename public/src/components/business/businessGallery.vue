<template>
    <div>
        <el-button class="button is-primary" @click="dialogFormVisible = true">Add Image</el-button>
        <el-dialog title="Add an Image" v-model="dialogFormVisible">
            <el-form :model="form" :rules="rules">
                <el-form-item label="Image Description" :label-width="formLabelWidth">
                    <el-input v-model="form.description" auto-complete="off"></el-input>
                </el-form-item>
                <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" :file-list="fileList"  v-model="form.path">
                    <el-button size="small" type="primary" :before-upload="validateFile">Click to upload</el-button>
                    <div slot="tip" class="el-upload__tip">jpg/png files with a size less than 2MB</div>
                </el-upload>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">Cancel</el-button>
            <el-button type="primary" @click="submitForm('form')">Confirm</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
    import axios from 'axios';
    import EndPoints from '../../services/EndPoints';
    
    export default {
        data() {
            return {
                dialogFormVisible: false,
                fileList: [],
                Images: [],
    
                form: {
                    description: '',
                    path: '',
                },
                rules: {
                    path: [{
                        required: true,
                        message: 'Please select an Image',
                        trigger: 'blur'
                    }, ],
                },
                formLabelWidth: '120px'
            };
        },
    
        methods: {
            validateFile() {
                if (this.fileList.length > 0) {
                    this.$notify({
                        title: 'Warning',
                        message: 'You can only upload one image at a time.',
                        type: 'warning'
                    });
                }
            },
            fetchImages() { // this.$router.params.id
                axios.get(EndPoints.Business().viewGallery('58f3dbdb11decb1efc8997d8'))
                    .then((res) => {
                        console.log(res.data);
                        this.Images = res.data;
                    })
                    .catch(err => console.log(err));
            },
            submitForm(formName) {
                this.dialogFormVisible = false;
                console.log(this.form);
                this.$refs[formName].validate((valid) => {
                    if (valid) { // this.$router.params.id
                        axios.post(EndPoints.Business().addImage('58f3dbdb11decb1efc8997d8'), this.form)
                            .then(() => {
                                this.resetForm(formName);
                                this.fetchImages();
                                alert('Added!');
                            })
                            .catch(err => console.log(err));
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
        },
        mounted() {
            this.fetchImages();
        },
    
    };
</script>