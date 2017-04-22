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
                                <el-button type="primary" @click="deleteImage(imageID)">Confirm</el-button>
                            </span>
            </el-dialog>
        </div>
    
    </div>
</template>

<script>
    import axios from 'axios';
    import {Service} from '../../services/EndPoints';
    import businessAuth from '../../services/auth/businessAuth'

    
    export default {
        data() {
            return {
                deleteDialog: false,
                errors: [],
            };
    
        },
        props: ['imageID'],
    
        methods: {
            deleteImage(imageID) {
                this.deleteDialog = false;
                console.log(businessAuth.getJWTtoken());
                axios.post(Service().deleteImage(this.$route.params.id, imageID),null, {
                        headers: {
                            Authorization: businessAuth.getJWTtoken()
                        }
                    })
                    .then((res) => {
                        this.$emit('success', res);
                    })
                    .catch(err => {
                        this.$emit('error', err);
                    });
            },
        },
    };
</script>