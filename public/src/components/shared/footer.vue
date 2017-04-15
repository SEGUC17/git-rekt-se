<template>
    <footer class="footer columns">
        <div class="column is-9 left-footer2">
            &copy; 2016 Backbone - All Rights Reserved.
        </div>
        <div class="column is-3 right-footer2">
            <a href="#" class="icon-link">
                <div class="img-icons-2 is-danger"><i class="fa fa-facebook">&nbsp;</i></div>
            </a>
            <a href="#" class="icon-link">
                <div class="img-icons-2"><i class="fa fa-google-plus">&nbsp;</i></div>
            </a>
            <a href="#" class="icon-link">
                <div class="img-icons-2"><i class="fa fa-twitter">&nbsp;</i></div>
            </a>
            <a href="#" class="icon-link">
                <div class="img-icons-2"><i class="fa fa-linkedin">&nbsp;</i></div>
            </a>
        </div>
        <div class="clearfix"></div>
    </footer>
</template>

<script>
    export default {
    
    };
</script>

<style>
    .footer {
        padding: 1.5rem 0.5rem 0rem !important;
    }
    
    .white {
        color: #fff;
    }
    
    .footer-icons {
        padding: 5px;
    }
    
    .img-icons-2 {
        display: inline-block;
        width: 32px;
        height: 32px;
        padding-left: 3px;
        line-height: 32px;
        font-size: 16px;
        text-align: center;
    }   
    .icon-link{
        border: 1px solid rgba(0, 0, 0, 0.4);
        padding-top:15px !important;    
    }
    .right-footer2{
        text-align: right;
    }

    .left-footer2{
        padding-left:30px;
        text-align: left;
    }
</style>
