<template>
    <div class="site-header">
        <div class="site-center-wrappter flex-row-space-between">
            <div class="menu-container">
                <ul class="menu">
                    <a href="/">
                        <li class="menu-item">首页</li>
                    </a>
                </ul>
            </div>
            <div class="user"></div>
        </div>
    </div>
</template>


<style lang="scss">
    .site-header{
        height:35px;
        line-height:35px;
        border-bottom:1px solid #eee;
        box-shadow: 0 0px 5px 0 rgba(0,0,0,.1);

        .menu{
            float:left;

            .menu-item{
                padding:0 10px;
                display: inline-block;
            }
        }

        .user{
            padding:0 20px;
        }
    }
</style>