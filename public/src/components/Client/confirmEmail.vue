<template>
    <div>
        <div v-show="this.errors.length > 0">
            <div class="error" v-for="error in this.errors">
                <el-alert title="error alert" type="error" :description="error" show-icon>
                </el-alert>
            </div>
        </div>
    
        <div v-show="confirmed">
            <el-alert title="success alert" type="success" :description="confirmationSuccess" show-icon>
            </el-alert>
        </div>
    </div>
</template>

<script>
    import clientAuth from '../../services/clientAuth';
    
    export default {
        data() {
            return {
                confirmationSuccess: '',
                confirmed: false,
                errors: [],
            }
        },
        mounted() {
            clientAuth.confirmEmail(this.$route.params.token, (responseErrs, response) => {
                if (responseErrs) {
                    responseErrs.errors.forEach((err) => {
                        this.errors.push(err);
                    });
                } else {
                    this.confirmationSuccess = response.message;
                    this.confirmed = true;
                }
            });
        }
    }
</script>
