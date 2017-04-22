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
    import {Business} from '../../services/EndPoints';
    import businessAuth from '../../services/auth/businessAuth'

    export default {
        data() {
            return {
                editDialogue: false,
                editForm: {
                    description: '',
                },
                formLabelWidth: '120px',
            };
    
        },
        props: ['imageID'],
    
        methods: {
            editImage(imageID) {
                this.editDialogue = false;
                axios.post(Business().editImage(imageID), this.editForm, {
                        headers: {
                            Authorization: businessAuth.getJWTtoken()
                        }
                    })
                    .then((res) => {
                        this.resetForm();
                        this.$emit('success', res);
                    })
                    .catch(err => {
                        this.$emit('error', err.response.data.errors);
                    });
            },
            resetForm() {
                this.editForm.description = '';
            }
        },
    };
</script>