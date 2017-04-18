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
                axios.post(EndPoints.Business().editImage(this.$route.params.id, imageID), this.editForm)
                    .then(() => {
                        this.resetForm();
                        this.$emit('imageEdit');
                        this.$notify({
                            title: 'Success!',
                            message: 'Description Edited!',
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
            resetForm() {
                this.editForm.description = '';
            }
        },    
    };
</script>