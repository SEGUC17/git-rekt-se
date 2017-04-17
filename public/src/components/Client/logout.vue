<template>
    <div class="columns is-mobile">
        <div class="column is-half is-offset-one-quarter">
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
    </div>
</template>

<script>
    import clientAuth from '../../services/auth/clientAuth';
    
    export default {
        data() {
            return {
                errors: [],
                logoutSuccess: '',
                success: false,
            }
        },
    
        mounted() {
            clientAuth.refreshAuth();
            if (!clientAuth.user.authenticated) {
                this.$router.push('/');
            } else {
                clientAuth.logout((responseErrs, response) => {
                    if (responseErrs) {
                        this.errors = responseErrs.errors;
                    } else {
                        this.success = true;
                        this.logoutSuccess = response.message;
                        setTimeout(() => {
                            this.$router.push('/')
                        }, 1000);
                    }
                });
            }
        }
    }
</script>

<style>
    .error {
        margin-top: 20px;
    }
    
    .error:first-child {
        margin-top: none;
    }
</style>