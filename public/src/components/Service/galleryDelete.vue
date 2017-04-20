<template>
    <div>
        <div>
            <a class="button is-danger is-outlined" @click="deleteDialog = true">
                <span>Delete</span>
                <span class="icon is-small">
                  <i class="fa fa-times"></i>
                </span>
            </a>
            <el-dialog title="Delete Image" v-model="deleteDialog">
                <span slot="footer" class="dialog-footer">
                                <el-button @click="deleteDialog = false">Cancel</el-button>
                                <el-button type="primary" @click="deleteImage(this.imageID)">Confirm</el-button>
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
                deleteDialog: false,
                imageID: '58f62f053d83196d9cfae112',
                errors: [],
            };
    
        },
        // props: ['imageID'],
    
        methods: {
            deleteImage(imageID) {
                this.deleteDialog = false;
                axios.post(EndPoints.Service().deleteImage(this.$route.params.id, imageID))
                    .then((res) => {
                        this.$emit('imageDelete');
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
        },    
    };
</script>