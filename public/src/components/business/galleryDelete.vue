<template>
    <div>
        <div>
            <a class="button is-danger is-outlined" @click="deleteDialogue = true">
                <span>Delete</span>
                <span class="icon is-small">
                  <i class="fa fa-times"></i>
                </span>
            </a>
            <el-dialog title="Delete Image" v-model="deleteDialogue">
                <span slot="footer" class="dialog-footer">
                                <el-button @click="deleteDialogue = false">Cancel</el-button>
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
                deleteDialogue: false,
                imageID: '58f62f053d83196d9cfae112',
                errors: [],
            };
    
        },
        props: ['imageID'],
    
        methods: {
            deleteImage(imageID) {
                this.deleteDialogue = false;
                axios.post(EndPoints.Business().deleteImage(this.$route.params.id, imageID))
                    .then(() => {
                        this.$emit('imageDelete');
                        this.$notify({
                            title: 'Success!',
                            message: 'Image Deleted!',
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
        },    
    };
</script>