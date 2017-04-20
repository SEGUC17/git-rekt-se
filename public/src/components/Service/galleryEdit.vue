<template>
    <div>
        <div>
            <el-button class="button is-primary" @click="editDialog = true">Edit Image</el-button>
            <el-dialog title="Edit Image" v-model="editDialog">
                <el-form :model="editForm">
                    <el-form-item label="Image Description" :label-width="formLabelWidth">
                        <el-input v-model="editForm.description" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                        <el-button @click="editDialog = false">Cancel</el-button>
                        <el-button type="primary" @click="editImage(imageID)">Confirm</el-button>
                    </span>
            </el-dialog>
        </div>
      
    
    </div>
</template>

<script>
    import axios from 'axios';
    import EndPoints from '../../services/EndPoints';
    
    export default {
        data() {
            return {
                editDialog: false,
                deleteDialog: false,
                imageID: '58f62f053d83196d9cfae112',
                editForm: {
                    description: '',
                },
                formLabelWidth: '120px',
            };
    
        },
    
        methods: {
            editImage(imageID) {
                this.editDialog = false;
                axios.post(EndPoints.Service().editImage(this.$route.params.id, imageID), this.editForm)
                    .then((res) => {
                        this.resetForm();
                        this.$emit('imageEdit');
                        this.$notify({
                            title: 'Success!',
                            message: res.data.message,
                            type: 'success'
                        });
                    })
                    .catch(err => {
                        this.$emit('imageEditError', err.response.data.errors);
                    });
            },
            resetForm() {
                this.editForm.description = '';
            }
        },    
    };
</script>