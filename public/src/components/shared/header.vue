<template>
    <header>
        <nav class="nav">
    
            <!-- Navigation bar Center -->
    
            <div class="nav-left">
                <a class="nav-item">
                    <img src="assets/imgs/logo.svg" alt="Bulma logo">
                </a>
            </div>
    
            <span class="nav-toggle">
                            <span></span>
            <span></span>
            <span></span>
            </span>
    
            <!-- Navigation bar Center -->
            <div class="nav-center nav-menu">
                <router-link to="/" class="nav-item">Home</router-link>
                <router-link to="/about" class="nav-item">About Us</router-link>
                <router-link to="/categories" class="nav-item">Categories</router-link>
                <router-link to="/contact" class="nav-item">Contact</router-link>
            </div>
    
            <!-- Navigation bar Right -->
            <div class="nav-right nav-menu">
                <a class="button is-default gr-nav-button" v-if="!user.authenticated">
                    <span class="icon">
                                        <i class="fa fa-user"></i>
                                    </span>
                    <span>Signup</span>
                </a>
    
                <a class="button is-danger gr-nav-button" v-if="!user.authenticated">
                    <span class="icon">
                                        <i class="fa fa-sign-in"></i>
                                    </span>
                    <span>
                                <router-link to="/client/login">
                                    Login
                                </router-link>
                            </span>
                </a>
    
                <a class="button is-danger gr-nav-button" v-if="user.authenticated">
                    <span class="icon">
                        <i class="fa fa-logout"></i>
                    </span>
                    <span> <router-link to="/client/logout">
                                    Logout
                                </router-link></span>
                </a>
    
            </div>
        </nav>
    </header>
</template>

<script>
    import auth from '../../services/clientAuth'
    export default {
        data() {
            return {
                user: auth.user
            }
        },
    
        methods: {}
    };
</script>

<style>
    .gr-nav-button {
        margin: 10px;
    }
</style>
