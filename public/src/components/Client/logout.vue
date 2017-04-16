<template>
    <div>
        <div v-show="errors.length > 0">
            <div class="error" v-for="error in errors">
                <el-alert :title="error" type="error" show-icon>
                </el-alert>
            </div>
        </div>
    
        <div v-show="success">
            <el-alert :title="logoutSuccess" type="success" show-icon>
            </el-alert>
        </div>
    
    </div>
</template>

<script>
    import auth from '../../services/clientAuth';
    
    export default {
        data() {
            return {
                errors: [],
                logoutSuccess: '',
                success: false,
            }
        },
    
        mounted() {
            auth.logout((responseErrs, response) => {
                if (responseErrs) {
                    this.errors = responseErrors.errors;
                } else {
                    this.success = true;
                    this.logoutSuccess = response.message;
                    setTimeout(() => {
                        this.$router.push('/')
                    }, 500);
                }
            });
        }
    }
</script>