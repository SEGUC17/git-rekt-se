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

>>>>>>> 5211e387dd7e8286df3374180f4e045bb79b6cc1
            <span class="nav-toggle">
                <span></span>
                <span></span>
                <span></span>
            </span>

            <!-- Navigation bar Center -->
            <div class="nav-center nav-menu">
<<<<<<< HEAD
                <router-link to="/" class="nav-item">Home</router-link>
=======
                <router-link to="/#" class="nav-item">Home</router-link>
>>>>>>> 5211e387dd7e8286df3374180f4e045bb79b6cc1
                <router-link to="/about" class="nav-item">About Us</router-link>
                <router-link to="/categories" class="nav-item">Categories</router-link>
                <router-link to="/contact" class="nav-item">Contact</router-link>
            </div>
<<<<<<< HEAD
    
=======

>>>>>>> 5211e387dd7e8286df3374180f4e045bb79b6cc1
            <!-- Navigation bar Right -->
            <div class="nav-right nav-menu">
                <a class="button is-default gr-nav-button">
                    <span class="icon">
                            <i class="fa fa-user"></i>
                        </span>
<<<<<<< HEAD
                    <span>Signup</span>
                </a>
    
=======
                    <router-link to="/signup" class="nav-item">Signup</router-link>
                </a>

>>>>>>> 5211e387dd7e8286df3374180f4e045bb79b6cc1
                <a class="button is-danger gr-nav-button">
                    <span class="icon">
                            <i class="fa fa-sign-in"></i>
                        </span>
<<<<<<< HEAD
                    <span>Login</span>
=======
                    <router-link to="/login" class="nav-item no-link">Login</router-link>
>>>>>>> 5211e387dd7e8286df3374180f4e045bb79b6cc1
                </a>
            </div>
        </nav>
    </header>
</template>

<<<<<<< HEAD
<script>
    export default {
        methods:{
        }
    };
</script>

=======
>>>>>>> 5211e387dd7e8286df3374180f4e045bb79b6cc1
<style>
    .gr-nav-button {
        margin: 10px;
    }
<<<<<<< HEAD
=======

    .no-link {
        color: white !important;
    }
>>>>>>> 5211e387dd7e8286df3374180f4e045bb79b6cc1
</style>
