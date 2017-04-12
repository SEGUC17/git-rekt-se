<template>
    <header>
        <el-menu mode="horizontal" class="el-menu-header" :router="true">
            <el-menu-item index="/" class="logo"><img class="logo" src="assets/imgs/logo.svg" width="200px"></el-menu-item>
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
        margin-top: 12px;
    }
    
    .el-menu-header {
        border-radius: 0;
    }
    
    .el-menu-item,
    .el-submenu__title {
        color: #333333;
        transition: background-color .3s, color .3s;
    }
    
    .el-menu {
        background-color: #fff;
    }
    
    .el-menu--horizontal .el-menu-item {
        border-bottom: 0;
    }
    
    .el-menu--horizontal .el-menu-item:hover,
    .el-menu--horizontal .el-submenu__title:hover {
        background-color: inherit;
        color: #0ebcff;
    }
    
    .el-menu--horizontal>.el-menu-item:hover,
    .el-menu--horizontal>.el-submenu.is-active .el-submenu__title,
    .el-menu--horizontal>.el-submenu:hover .el-submenu__title {
        border-bottom: 0;
    }
    
    .el-submenu.is-active .el-submenu__title {
        border-bottom-color: 0;
    }
</style>
