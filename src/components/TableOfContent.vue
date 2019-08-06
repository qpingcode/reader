<template>
    <div class="toc">
        <div class="header">
            <div class="return">
                <i class="iconfont book-prev"></i> 返回
            </div>
            <div class="title" @click.stop>
                目录
            </div>
            <div class="sort" @click.stop="sort">
                <i class="iconfont book-sort"></i> 倒序
            </div>
        </div>
        <div id="directory" class="directory" :style="{'height': listHeight + 'px'}">
            <div v-for="(item) in titleList" :key="item.num" :class="chapterNum == item.num ? 'active': ''" class="row" @click="clickChapter(item.num)">
                {{item.title}}
            </div>
        </div>
    </div>
</template>


<script>
    export default {
        name: 'TableOfContent',
        props: ['chapterNum', 'titleList'],
        data(){
            return {
                clientHeight: null,
                clientWidth: null,
                listHeight: null,
                listWidth: null,
            }
        },
        mounted(){
            this.clientHeight = global.document.documentElement.clientHeight;
            this.clienWidth = global.document.documentElement.clientWidth - 20;
            this.listHeight = this.clientHeight - 50;
            this.listWidth = 400;
            this.scrollToChapterNum()
        },
        updated(){
          this.scrollToChapterNum()
        },
        methods:{
            scrollToChapterNum(){
                document.getElementById("directory").scrollTop = (this.chapterNum - 1) * 54
            },
            sort(){
                this.titleList.reverse();
            },
            clickChapter(chapterNum){
                this.$emit('chapterJump', chapterNum);
            },
        },
    }
</script>

<style lang="scss">

    /** 定义主题颜色 begin **/
    $bg-white: #fefff7;
    $bg-dark: #555;
    /** 定义主题颜色 end **/

    .toc{
        width:400px;

        @media screen and (max-width: 400px) {
            &{
                width:100%;
            }
        }

        top:0;
        left:0;
        position: fixed;
        background:$bg-white;
        box-shadow: 0 -3px 15px 0 rgba(0,0,0,.1);
        .color-dark &{
            background:$bg-dark;
            box-shadow: none;
            .directory .row{
                border-bottom:1px solid #888;
            }
        }
        .header{
            height: 30px;
            padding:10px 10px;
            display: flex;
            justify-content: space-between;

            .title{
                font-weight: 800;
            }
        }

        .directory{
            overflow: scroll;
            width:100%;
            .row{
                width:calc(100% - 20px);
                padding:15px 10px;
                border-bottom:1px solid #eee;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .active{
                color:#FF5151;
            }
        }
    }

</style>