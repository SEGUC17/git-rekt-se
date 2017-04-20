<template>
    <div>
        <div>
            <el-button class="button is-primary" @click="editDialogue = true">Edit Image</el-button>
            <el-dialog title="Edit Image" v-model="editDialogue">
                <el-form :model="editForm">
                    <el-form-item label="Image Description" :label-width="formLabelWidth">
                        <el-input v-model="editForm.description" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                                <el-button @click="editDialogue = false">Cancel</el-button>
                                <el-button type="primary" @click="editImage(imageID)">Confirm</el-button>
                            </span>
            </el-dialog>
        </div>
    
    
    </div>
</template>

<script>
    import axios from 'axios';
    import EndPoints from '../../services/EndPoints';
    import businessAuth from '../../services/auth/businessAuth'

    export default {
        data() {
            return {
                editDialogue: false,
                deleteDialogue: false,
                imageID: '58f62f053d83196d9cfae112',
                editForm: {
                    description: '',
                },
                formLabelWidth: '120px',
                errors: [],
            };
    
        },
        // props: ['imageID'],
    
        methods: {
            editImage(imageID) {
                this.editDialogue = false;
                axios.post(EndPoints.Business().editImage(this.$route.params.id, imageID), this.editForm, {
                        headers: {
                            Authorization: businessAuth.getJWTtoken()
                        }
                    })
                    .then((res) => {
                        this.resetForm();
                        this.$emit('imageEdit', res);
                        this.$notify({
                            title: 'Success!',
                            message: res.body.message,
                            type: 'success'
                        });
                    })
                    .catch(err => {
                        this.errors = err.response.data.errors;
                        document.body.scrollTop = document.documentElement.scrollTop = 0;
                    });
            },
            resetForm() {
                this.editForm.description = '';
            }
        },
    };
</script>