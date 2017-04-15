<template>
    <div v-show="this.errors.length > 0">
        <div class="error" v-for="error in this.errors">
            <el-alert title="error alert" type="error" :description="error" show-icon>
            </el-alert>
        </div>
    </div>
</template>

<script>
    import auth from '../../services/clientAuth';
    import axios from 'axios';
    export default {
        data() {
            return {
                errors: [],
            }
        },
    
        mounted() {
            axios.post('api/v1/client/auth/logout', null, {
                headers: {
                    'Authorization': auth.getJWTtoken()
                }
            }).then(() => {
                auth.logout();
                this.$router.push('/');
            }).catch((err) => {
                this.errors.push(err.response.data);
            })
        }
    }
</script>