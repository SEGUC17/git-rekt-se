<template>
    <div>
        <el-button class="button is-primary" @click="dialogFormVisible = true">Add Image</el-button>
        <el-dialog title="Add an Image" v-model="dialogFormVisible">
            <el-form :model="form" :rules="rules">
                <el-form-item label="Image Description" :label-width="formLabelWidth">
                    <el-input v-model="form.description" auto-complete="off"></el-input>
                </el-form-item>
                <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" :file-list="fileList" v-model="form.path">
                    <el-button size="small" type="primary" :before-upload="validateFile">Click to upload</el-button>
                    <div slot="tip" class="el-upload__tip">jpg/png files with a size less than 2MB</div>
                </el-upload>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">Cancel</el-button>
                <el-button type="primary" @click="submitForm('form')">Confirm</el-button>
              </span>
        </el-dialog>

        <!--<el-row>
  <el-col :span="8" v-for="image in Images" :key="path" :offset="index*2">
    <el-card :body-style="{ padding: '0px' }">
      <img src= class="image">
      <div style="padding: 14px;">
        <span>path</span>
        <div class="bottom clearfix">
          <time class="time">{{ currentDate }}</time>
          <el-button type="text" class="button">Operating button</el-button>
        </div>
      </div>
    </el-card>
  </el-col>
</el-row>-->

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
                formLabelWidth: '120px',
                errors: [],
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
                axios.get(EndPoints.Business().viewGallery('58f4c29376cbd145e45b7b07'))
                    .then((res) => {
                        this.Images = res.data;
                    })
                    .catch(err => console.log(err));
            },
            submitForm(formName) {
                this.dialogFormVisible = false;
                console.log(this.form);
                this.$refs[formName].validate((valid) => {
                    if (valid) { // this.$router.params.id
                        axios.post(EndPoints.Business().addImage('58f4c29376cbd145e45b7b07'), this.form)
                            .then(() => {
                                this.resetForm(formName);
                                this.fetchImages();
                                this.$notify({
                                    title: 'Success!',
                                    message: 'Image Added!',
                                    type: 'success'
                                });
                            })
                            .catch(err => console.log(err));
                    } else {
                        this.errors.push('Invalid Input(s)')
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

<style>
  .time {
    font-size: 13px;
    color: #999;
  }
  
  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  
  .clearfix:after {
      clear: both
  }
</style>