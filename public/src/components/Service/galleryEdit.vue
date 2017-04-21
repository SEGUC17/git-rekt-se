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
    import businessAuth from '../../services/auth/businessAuth'

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
                axios.post(EndPoints.Service().editImage(this.$route.params.id, imageID), this.editForm, {
                        headers: {
                            Authorization: businessAuth.getJWTtoken()
                        }
                    })
                    .then((res) => {
                        this.resetForm();
                        this.$emit('success', res);
                    })
                    .catch(err => {
                        this.$emit('error', err);
                    });
            },
            resetForm() {
                this.editForm.description = '';
            }
        },
    };
</script>