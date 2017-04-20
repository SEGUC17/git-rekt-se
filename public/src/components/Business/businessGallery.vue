<template>
    <div>
        <div v-show="errors.length>0">
            <div class="error" v-for="(error,idx) in errors">
                <el-alert @close="closeError(idx)" :title="error" type="error" show-icon></el-alert>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import EndPoints from '../../services/EndPoints';
    import businessAuth from '../../services/auth/businessAuth'
    import galleryAdd from './galleryAdd.vue'
    
    export default {
        data() {
            return {
                images: [],
                errors: [],
            }
        },
        methods: {
            closeError(idx) {
                this.errors.splice(idx, 1);
            },
            fetchImages() {
                axios.get(EndPoints.Business().viewGallery(this.$route.params.id), {
                        headers: {
                            Authorization: businessAuth.getJWTtoken()
                        }
                    })
                    .then((res) => {
                        this.images = res.data;
                    })
                    .catch(err => {
                        this.errors = err.response.data.errors;
                        document.body.scrollTop = document.documentElement.scrollTop = 0;
                    });
            },
            mounted() {
                this.fetchImages();
            },
    
        }
    }
</script>
