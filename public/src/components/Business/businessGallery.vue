<template>
    <div>
        <div v-show="errors.length>0">
            <div class="error" v-for="error in errors">
                <el-alert :title="error" type="error" show-icon></el-alert>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import EndPoints from '../../services/EndPoints';
    import galleryAdd from './galleryAdd.vue'
    export default {
        data() {
            return {
                images: [],
                errors: [],
            }
        },
        methods: {
            fetchImages() {
                axios.get(EndPoints.Business().viewGallery(this.$route.params.id))
                    .then((res) => {
                        this.images = res.data;
                    })
                    .catch(err => {
                        for (var i = 0; i < err.response.data.errors.length; i++) {
                            this.errors.push(err.response.data.errors[i]);
                        };
                        document.body.scrollTop = document.documentElement.scrollTop = 0;
                    });
            },
            mounted() {
                this.fetchImages();
            },
    
        }
    }
</script>
