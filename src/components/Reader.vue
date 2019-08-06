<template>
    <div class="reader">
        <article v-if="turnMode"
                 :style="{ 'line-height': lineHeight + 'px', 'font-size': fontSize + 'px', 'height': clientHeight + 'px'}">
            <div class="top limit">{{title}}</div>
            <div class="center" :style="{'height': pageHeight + 'px'}">
                <transition :name="turnDirection">
                    <div :key="pageNum" class="slide-box limit" :style="{'height': pageContentHeight + 'px'}">
                        <div :style="{'margin-top': offset + 'px'}">
                            <div class="article-title" :style="{'font-size': ( fontSize + 5 ) + 'px'}"><br>{{title}}<br>&nbsp;
                            </div>
                            <div class="article-content" v-html="content"></div>
                        </div>
                    </div>
                </transition>
            </div>
            <div class="bottom limit">
                <div class="right">
                    第 {{pageNum}} / {{pageTotal}} 页
                </div>
            </div>
        </article>

        <div class="rendering limit" v-if="turnMode && rendering" :style="{ 'line-height': lineHeight + 'px', 'font-size': fontSize + 'px'}">
            <div class="article-title" :style="{'font-size': ( fontSize + 5 ) + 'px'}"><br>{{title}}<br>&nbsp;</div>
            <div class="article-content" v-html="content"></div>
        </div>

        <article class="limit" v-if="!turnMode" :style="{ 'line-height': lineHeight + 'px', 'font-size': fontSize + 'px'}">
            <div class="article-title" :style="{'font-size': ( fontSize + 5 ) + 'px'}"><br>{{title}}<br>&nbsp;</div>
            <div class="article-content" v-html="content"></div>

            <div class="row">
                <div class="btn font-btn" :class="prev ? '': 'disabled'" @click="clickChapterGo(-1)">上一章</div>
                <div class="btn font-btn" :class="next ? '': 'disabled'" @click="clickChapterGo(1)">下一章</div>
            </div>
        </article>

    </div>
</template>


<script>
    export default {
        name: 'Reader',
        props: ['turnToLastPage', 'turnDirection', 'turnMode', 'pageNum', 'title', 'content', 'fontSize', 'lineHeight', 'next', 'prev'],
        data() {
            return {
                clientHeight: null,
                pageLines: null,
                pageHeight: null,
                pageContentHeight: null,
                pageTotal: 0,
                rendering: false
            }
        },
        watch: {
            lineHeight() {
                this.calc()
            },
            turnMode() {
                this.calc()
            }
        },
        mounted() {
            this.calc()

            /*
                keycode   37 = Left
                keycode   38 = Up
                keycode   39 = Right
                keycode   40 = Down
            * */
            window.onkeydown = (e) => {
                var key = (e || window.event).keyCode;

                // 空格 右 下
                if(key == 32 || key == 39 || key == 40){
                    this.$emit('callback', 'pageGo', 1);
                }
                // 上 左
                if(key == 37 || key == 38){
                    this.$emit('callback', 'pageGo', -1);
                }
            }

            // window.onresize = () => {
            //     this.calc()
            //     this.$emit('callback', 'pageNum', 1);
            // }
        },
        computed: {
            offset() {
                return (1 - this.pageNum) * this.pageContentHeight;
            }
        },
        methods: {
            clickChapterGo(arrow) {
                this.$emit('callback', 'chapterGo', arrow);
            },
            clientSize() {

                var pageWidth = window.innerWidth;
                var pageHeight = window.innerHeight;

                if (typeof pageWidth != "number") {
                    //在标准模式下面
                    if (document.compatMode == "CSS1Compat" ) {
                        pageWidth = document.documentElement.clientWidth;
                        pageHeight = document.documentElement.clientHeight;
                    } else {
                        pageWidth = document.body.clientWidth;
                        pageHeight = window.body.clientHeight;
                    }
                }

                return {
                    width: pageWidth,
                    height: pageHeight
                }

                // return {
                //     height: global.document.documentElement.clientHeight,
                //     width: global.document.documentElement.clientWidth
                // }
            },
            calc() {
                if (!this.turnMode) {
                    return;
                }

                this.rendering = true
                this.$nextTick()
                    .then(() => {
                        var top_bottom = 60;
                        // 每页行数
                        this.clientHeight = this.clientSize().height;

                        // 页面高度 - 顶部状态栏高度 - 底部页码栏高度
                        this.pageHeight = this.clientHeight - top_bottom;
                        this.pageLines = Math.floor(this.pageHeight / this.lineHeight);
                        // 页面内容高度
                        this.pageContentHeight = this.pageLines * this.lineHeight ;
                        //
                        var offsetHeight = this.$el.children[1].offsetHeight;
                        // 文章的总行数
                        this.pageTotal = Math.ceil(offsetHeight / this.pageContentHeight)

                        // console.log("clientHeight: " + this.clientHeight + " pageLines: " + this.pageLines + " contentHeight: " + this.pageContentHeight
                        //     + " pageTotal: " + this.pageTotal + " lineHeight: " + this.lineHeight)


                        // 是否渲染中
                        this.rendering = false;

                        // 回掉
                        this.$emit('callback', 'pageTotal',  this.pageTotal);
                        if(this.pageNum == 0){
                            this.$emit('callback', 'pageNum', this.turnToLastPage || (this.pageNum > this.pageTotal) ? this.pageTotal : 1);
                        }

                    })
            }
        },
    }
</script>

<style lang="scss">
    .reader {

        .limit{
            width:800px;
            padding:0 calc(50% - 400px);
        }
        @media screen and (max-width: 960px) {
            .limit{
                width:calc(100% - 40px);
                padding:0 20px;
            }
        }

        .article-title{
            font-weight: 600;
            word-break: break-all;
        }
        .article-content{
            word-break: break-all;
        }

        article {
            .top, .bottom {
                height: 30px;
                line-height: 30px;
                font-size: 10px;
                color: #aaa;
            }
            .bottom .right {
                text-align: right;
                overflow: hidden;
                position: absolute;
                right: 10px;
            }
            .center {
                position: relative;
                overflow: hidden;
                .slide-box {
                    display: inline-block;
                    overflow: hidden;
                    position: absolute;
                }
            }
        }

        .row {
            padding: 60px 0 100px 0;
            .btn{
                display: inline-block;
                border: 1px solid #333;
                height:40px;
                line-height:40px;
                &.disabled{
                    border: 1px solid #bbb;
                    color: #bbb;
                }
                .color-dark &{
                    border: 1px solid #bbb;
                }
                .color-dark &.disabled{
                    border: 1px solid #888;
                    color: #888;
                }
            }
            .font-btn{
                width:35%;
                margin-left:10%;
                text-align: center;
            }
        }

        /* ---------------------- 水平移动动画 begin --------------------- */
        $move-time: .5s;
        .slide-left-enter-active {
            animation: leftEnter $move-time;
        }
        .slide-left-leave-active {
            animation: leftLeave $move-time;
        }

        .slide-right-enter-active {
            animation: rightEnter $move-time;
        }

        .slide-right-leave-active {
            animation: rightLeave $move-time;
        }
        @keyframes leftEnter {
            0% {
                transform: translate(-100%, 0)
            }
        }
        @keyframes leftLeave {
            100% {
                transform: translate(100%, 0)
            }
        }
        @keyframes rightEnter {
            0% {
                transform: translate(100%, 0)
            }
        }

        @keyframes rightLeave {
            100% {
                transform: translate(-100%, 0)
            }
        }
        /* ---------------------- 水平移动动画 end --------------------- */

        /* ---------------------- 垂直移动动画 begin --------------------- */
        $v-move-time: .3s;
        .slide-up-enter-active {
            animation: upEnter $v-move-time;
        }

        .slide-up-leave-active {
            animation: upLeave $v-move-time;
        }

        .slide-down-enter-active {
            animation: downEnter $v-move-time;
        }

        .slide-down-leave-active {
            animation: downLeave $v-move-time;
        }

        @keyframes upEnter {
            0% {
                transform: translate(0, -100%)
            }
        }
        @keyframes upLeave {
            100% {
                transform: translate(0, 100%)
            }
        }
        @keyframes downEnter {
            0% {
                transform: translate(0, 100%)
            }
        }
        @keyframes downLeave {
            100% {
                transform: translate(0, -100%)
            }
        }
        /* ---------------------- 垂直移动动画 end --------------------- */

    }
</style>