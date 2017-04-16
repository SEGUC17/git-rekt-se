<template>
    <header>
        <nav class="nav">
<<<<<<< HEAD
    
            <!-- Navigation bar Center -->
    
            <div class="nav-left">
                <a class="nav-item">
                    <img src="assets/imgs/logo.svg" alt="Bulma logo">
                </a>
            </div>
            
=======

            <!-- Navigation bar Center -->

            <div class="nav-left">
                <router-link to="/#" class="nav-item"><img src="assets/imgs/logo.svg" alt="Bulma logo"></router-link>
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
                <a class="button is-default gr-nav-button" v-if="!user.authenticated">
                    <span class="icon">
                            <i class="fa fa-user"></i>
                        </span>
                    <router-link to="/signup" class="nav-item">Signup</router-link>
                </a>

                <a class="button is-danger gr-nav-button">
                <a class="button is-danger gr-nav-button" v-if="!user.authenticated">
                    <span class="icon">
                            <i class="fa fa-sign-in"></i>
                        </span>
                    <span>Login</span>
                    <router-link to="/login" class="nav-item no-link">Login</router-link>
                </a>

                <a class="button is-danger gr-nav-button" v-if="user.authenticated">
                    <span class="icon">
                            <i class="fa fa-sign-out"></i>
                        </span>
                    <router-link to="/logout" class="nav-item no-link">Logout</router-link>
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
        mounted() {
            auth.refreshAuth();
        }
    };
</script>


<style>
    .gr-nav-button {
        margin: 10px;
    }

    .no-link {
        color: white !important;
    }
</style>
