<template>
<div>
    <div>
        <div v-show="errors.length>0">
            <div class="error" v-for="(error,idx) in errors">
                <el-alert @close="closeError(idx)" :title="error" type="error" show-icon></el-alert>
            </div>
        </div>
    </div>
    <addButton @success="onSuccess" @error="onError"></addButton>
    <template>
                    <el-row>
                        <el-col :span="8" v-for="image in images":key="image._id" v-bind:data="image">
                            <el-card :body-style="{ padding: '0px' }">
                                <img :src="'/uploads/' + image.path" class="image">
                                <div style="padding: 14px;">
                                    <span>{{image.description}}</span>
                                    <div class="bottom clearfix">
                                        <editButton v-if="business.authenticated" @success="onSuccess" @error="onError":key="image._id" :imageID="image._id"></editButton>
                                        <deleteButton v-if="business.authenticated" @success="onSuccess" @error="onError" :key="image._id" :imageID="image._id"></deleteButton>
                                    </div>
                                </div>
                            </el-card>
                        </el-col>
                    </el-row>
</template>
</div>

</template>

<script>
    import axios from 'axios';
    import {Business} from '../../services/EndPoints';
    import businessAuth from '../../services/auth/businessAuth';
    import addButton from './galleryAdd.vue';
    import editButton from './galleryEdit.vue';
    import deleteButton from './galleryDelete.vue';
    
    export default {
        data() {
            return {
                business: businessAuth.user,
                images: [],
                errors: [],
            }
        },
        components: {
            addButton: addButton,
            editButton: editButton,
            deleteButton: deleteButton,
        },
    
        mounted() {
            this.getGallery();
        },
        methods: {
            getGallery() {
                axios.get(Business().viewGallery, {
                        headers: {
                            Authorization: businessAuth.getJWTtoken()
                        }
                    })
                    .then((res) => {
                        this.images = res.data.results;
                        this.errors = [];
                    })
                    .catch(err => {
                        this.errors = err.response.data.errors;
                        document.body.scrollTop = document.documentElement.scrollTop = 0;
                    });
            },
            onError(err) {
                this.errors = err;
            },
            onSuccess(res) {
                this.errors = [];
                this.getGallery();
                this.$notify({
                    title: 'Success!',
                    message: res.data.message,
                    type: 'success'
                });
            },
        }
    }
</script>
