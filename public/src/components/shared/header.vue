<template>
    <header>
        <el-menu mode="horizontal" class="el-menu-header" :router="true">
            <el-menu-item index="/"><img class="logo" src="assets/imgs/logo.svg" width="200px"></el-menu-item>
            <el-menu-item index="/about">About Us</el-menu-item>
            <el-submenu index="/categories">
                <template slot="title">Categories</template>
                <el-menu-item index="/categories/services">Services</el-menu-item>
                <el-menu-item index="/categories/business">Businesses</el-menu-item>
            </el-submenu>
            <el-menu-item index="/contact">Contact Us</el-menu-item>
            <el-menu-item index="/signup" class="el-menu-item-right">Signup</el-menu-item>
            <el-menu-item index="/login" class="el-menu-item-right">Login</el-menu-item>
        </el-menu>
    </header>
</template>

<script>
    export default {
    
    };
</script>

<style>
    .el-menu-item-right {
        float: right !important;
    }
    
    .logo {
        margin: 5px;
    }
    
    .el-menu-header {
        border-radius: 0;
    }
</style>
