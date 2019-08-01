<template>
    <div>
        <div class="toolbar-back">
            <div class="back-btn" @click.stop="goIndex">
                <i class="iconfont book-prev"></i>
                返回首页
            </div>
        </div>

        <div class="toolbar" @click.stop>
            <div class="wrapper">
                <div class="options">
                    <div v-show="tab == 'default'" class="option">
                        <div class="row flex">
                            <div class="btn font-btn" @click="clickChapterGo(-1)">上一章</div>
                            <div class="btn font-btn" @click="clickChapterGo(1)">下一章</div>
                        </div>
                    </div>
                    <div v-show="tab == 'setting'" class="option">
                        <div class="title">字体大小</div>
                        <div class="row flex">
                            <div class="btn font-btn" @click="fontChange(-1)">A -</div>
                            <div class="btn font-btn" @click="fontChange(1)">A +</div>
                        </div>
                        <div class="title">主题颜色</div>
                        <div class="row flex">
                            <div class="btn color-btn color-white" @click="themeColorChange('color-white')"></div>
                            <div class="btn color-btn color-yellow" @click="themeColorChange('color-yellow')"></div>
                            <div class="btn color-btn color-green" @click="themeColorChange('color-green')"></div>
                        </div>
                        <div class="title">翻页效果</div>
                        <div class="row flex">
                            <div class="turn" :class="turnMode == '' ? 'active' : ''">
                                <i class="iconfont book-turn-default" @click="turnModeChange('')"></i>
                            </div>
                            <div class="turn" :class="turnMode == 'horizontal' ? 'active' : ''">
                                <i class="iconfont book-turn-horizontal" @click="turnModeChange('horizontal')"></i>
                            </div>
                            <div class="turn" :class="turnMode == 'vertical' ? 'active' : ''">
                                <i class="iconfont book-turn-vertical" @click="turnModeChange('vertical')"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <ul class="flex">
                    <li @click="showTab('setting')">
                        <span class="icon"><i class="iconfont book-font"></i></span>
                        <span class="icon-info">设置</span>
                    </li>
                    <li v-show="themeCss != 'color-dark'" @click="themeColorChange('color-dark')" >
                        <span class="icon"><i class="iconfont book-moon"></i></span>
                        <span class="icon-info">夜间</span>
                    </li>
                    <li v-show="themeCss == 'color-dark'" @click="themeColorChange('color-white')" >
                        <span class="icon"><i class="iconfont book-sun"></i></span>
                        <span class="icon-info">日间</span>
                    </li>
                    <li @click="showToc">
                        <span class="icon"><i class="iconfont book-toc"></i></span>
                        <span class="icon-info">目录</span>
                    </li>
                    <li @click="showBookInfo">
                        <span class="icon"><i class="iconfont book-info1"></i></span>
                        <span class="icon-info">书籍详情</span>
                    </li>
                </ul>
            </div>
        </div>

    </div>
</template>


<script>
    export default {
        name: 'Reader',
        props: ['themeCss', 'turnMode'],
        data(){
            return {
                tab : "default",
                fontSizeTitle: 26,
                fontSizeContent: 19,
                lineHeight: 32,
                userFontChange: 0,
                theme: "white",
                colors:{
                    white : {
                        cssName: 'color-white',
                        themeColor: '#fefff7'
                    },
                    yellow: {
                        cssName: 'color-yellow',
                        themeColor: '#faebcc'
                    },
                    green: {
                        cssName: 'color-green',
                        themeColor: '#eaebc9'
                    },
                    dark: {
                        cssName: 'color-dark',
                        themeColor: '#333'
                    }
                }
            }
        },
        mounted(){

        },
        methods:{
            goIndex(){
                this.$router.push("/")
            },
            clickChapterGo(arrow){
                this.$emit("callback", "chapterGo", arrow);
            },
            showBookInfo(){
                this.$emit("callback", "showBookInfo");
            },
            showToc(){
                this.$emit("callback", "showToc", true);
            },
            showTab(tab) {
                this.tab = tab
            },
            fontChange(num){
                this.$emit("callback", "fontSizeInterval", num)
            },
            themeColorChange(colorCss){
                this.$emit("callback", "themeCss", colorCss)
            },
            turnModeChange(turnMode){
                this.$emit("callback", "turnMode", turnMode)
            }
        },
    }
</script>

<style lang="scss">

    /** 定义主题颜色 begin **/
    $bg-white: #fefff7;
    $bg-yellow: url(../assets/theme/yellow.png) repeat ;
    $bg-green: url(../assets/theme/green.png) repeat;
    $bg-dark: #333;
    /** 定义主题颜色 end **/

    .toolbar-back{
        height:40px;
        background: $bg-white;
        width:100%;
        display: block;
        top: 0;
        left: 0;
        position: fixed;

        .back-btn{
            padding:10px 10px;
        }

    }

    .toolbar{
        background: $bg-white;
        width:100%;
        display: block;
        bottom: 0;
        left: 0;
        position: fixed;

        .flex{
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .wrapper{
            padding:5px 6%;
        }
        ul{
            width:100%;
            list-style: none;
            padding:0;

            li{
                list-style: none;
                padding:0;
                display: block;
                width:20%;
                height:60px;
                text-align: center;
            }
            li.active{
                border-bottom: 1px solid #df5000;
            }

            .icon{
                display: block;
                font-size: 12px;
            }
            .icon-info{
                font-size: 12px;
            }
            .iconfont{
                font-size:22px;
                width:150px;
                height:150px;
            }
        }

    }

    .options{
        width:90%;
        margin:0 auto;
        .option{
            margin-bottom: 40px;
            margin-top:20px;

            .title{
                color:#888;
                font-size:12px;
                clear:both;
                clear:both;
            }

            .row{
                margin-top: 8px;
                margin-bottom: 20px;

                .turn{
                    padding:10px 0;
                }

                .active{
                    border:1px solid #999;
                }
            }

            .btn{
                display: block;
                border: 1px solid #333;
                height:40px;
                line-height:40px;
            }
            .font-btn{
                width:40%;
                margin-right:5%;
                text-align: center;
            }

            .font-btn.disabled{
                border: 1px solid #aaa;
                color: #aaa;
            }

            .color-btn{
                width:25%;
                margin-right:5%;
            }

            .turn{
                text-align: center;
                display: inline-block;
                width:25%;
                margin-right:5%;

                .iconfont{
                    font-size:26px;
                }
            }
        }
    }


    /* 翻页样式 begin */
    .chapter_go{
        margin-bottom: 200px;
        margin-top:30px;

        .prev{
            margin-left:20px;
            float:left;
        }
        .next{
            margin-right:30px;
            float:right;
        }
    }
    /* 翻页样式 end */


    /* 主题样式 begin */
    %color-common {
        & .toolbar{
            background-color: #fefff7;
            box-shadow: 0 -3px 15px 0 rgba(0,0,0,.1);
        }

        & .toolbar-back{
            background-color: #fefff7;
            box-shadow: 0 -3px 15px 0 rgba(0,0,0,.1);
        }
        color: #333;
    }

    .color-white{
        @extend %color-common;
        background: $bg-white;
    }

    .color-yellow{
        @extend %color-common;
        background: $bg-yellow;
    }

    .color-green{
        @extend %color-common;
        background: $bg-green;
    }

    .color-dark{
        background-color:$bg-dark;
        color:#bbb;
        .toolbar{
            background-color:#555;
            box-shadow: none;
        }
        .toolbar-back{
            background-color:#555;
            box-shadow: none;
        }
        .font-btn{
            border: 1px solid #eee;
        }
    }
    /* 主题样式 end */
</style>