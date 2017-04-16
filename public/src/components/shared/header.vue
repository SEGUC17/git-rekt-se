<template>
    <header>
        <nav class="nav">
    
            <!-- Navigation bar Center -->
    
            <div class="nav-left">
                <router-link to="/#" class="logo nav-item"><img src="assets/imgs/logo.svg" alt="logo"></router-link>
            </div>
    
            <span class="nav-toggle">
                                <span></span>
            <span></span>
            <span></span>
            </span>
    
            <!-- Navigation bar Center -->
            <div class="nav-center nav-menu">
                <router-link to="/#" class="nav-item">Home</router-link>
                <router-link to="/about" class="nav-item">About Us</router-link>
                <router-link to="/categories" class="nav-item">Categories</router-link>
                <router-link to="/contact" class="nav-item">Contact</router-link>
            </div>
    
            <!-- Navigation bar Right -->
            <div class="nav-right nav-menu">
                <a class="button is-default gr-nav-button" v-if="!client.authenticated">
                    <span class="icon">
                                <i class="fa fa-user"></i>
                        </span>
                    <router-link to="/signup" class="nav-item">Signup</router-link>
                </a>
    
                <a class="button is-danger gr-nav-button" v-if="!client.authenticated">
                    <span class="icon">
                                    <i class="fa fa-sign-in"></i>
                            </span>
                    <router-link to="/login" class="nav-item no-link">Login</router-link>
                </a>
    
                <a class="button is-danger gr-nav-button" @click="clientLogout" v-if="client.authenticated">
                    <span class="icon">
                            <i class="fa fa-sign-out"></i>
                    </span>
                    &nbsp;&nbsp;Logout
                </a>
            </div>
        </nav>
    </header>
</template>

<script>
    import clientAuth from '../../services/clientAuth'
    
    export default {
        data() {
            return {
                client: clientAuth.user,
            }
        },
        methods: {
            clientLogout() {
                clientAuth.refreshAuth();
                if (!clientAuth.user.authenticated) {
                    this.$router.push('/');
                } else {
                    clientAuth.logout((responseErrs, response) => {
                        let message;
                        if (responseErrs) {
                            message = responseErrors.errors[0];
                        } else {
                            message = response.message;
                        }
    
                        this.$toast.open({
                            message: response.message,
                            type: 'is-primary',
                            position: 'bottom',
                        });
                    });
                }
            },
        },
        mounted() {
            clientAuth.refreshAuth();
        }
    };
</script>

<style>
    .logo {
        overflow: hidden;
    }
    
    .gr-nav-button {
        margin: 10px;
    }
    
    .nav {
        border-bottom: 1px solid #eee;
    }
    
    .no-link {
        color: white !important;
    }
</style>
