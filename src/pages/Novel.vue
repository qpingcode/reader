<template>
    <div class="novel-index site-background">
        <SiteHeader></SiteHeader>
        <Loading v-show="loading"></Loading>

        <div class="site-center-wrappter mt20" v-if="!loading">
            <div class="title"> {{novel.title}}</div>
            <div class="author"> 作者：{{novel.author}}</div>
            <div class="intro"> 简介：{{novel.intro}}</div>
            <div v-if="chapterNum > 0" class="continue">
                <router-link :to="{path: '/novel/' + novel.id + '/chapter/' + chapterNum}">
                    点击这里继续阅读...
                </router-link>
            </div>
            <div class="sort" @click.stop="sort">
                <i class="iconfont book-sort"></i> 倒序
            </div>
            <div class="directory">
                <ul>
                    <li v-for="item in novel.chapters" :key="item.num">
                        <router-link :to="{path : '/novel/' + novel.id + '/chapter/' + item.num}">{{item.title}}</router-link>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import bookApi from '../api/book.js'
    import Loading from '../components/Loading.vue'
    import SiteHeader from '../components/SiteHeader.vue'

    export default {
        name: 'Novel',
        components: {Loading, SiteHeader},
        data() {
            return {
                loading: true,
                novel: {
                    chapters: [],
                    chapterNum: -1,
                    pageNum: 1
                }
            }
        },
        created(){
            if(this.$route.params) {
                var novelId = this.$route.params.novelId;
                bookApi.getNovel(novelId).then(v => {
                    this.loading = false
                    this.novel = v;
                }).catch(v=>{
                    alert(v)
                    this.loading =false
                })

                var chapterNum =  bookApi.getSetting("chapterNum", novelId)
                if(chapterNum){
                    this.chapterNum = parseInt(chapterNum);
                }
                // var pageNum = bookApi.getSetting("pageNum", novelId)
                // if(pageNum){
                //     this.pageNum = parseInt(pageNum)
                // }
            }
        },
        mounted() {

        },
        methods: {
            sort(){
                if(this.novel && this.novel.chapters){
                    this.novel.chapters.reverse();
                }
            }
        }
    }

</script>

<style lang="scss">
    .novel-index {

        .mt20{
            margin-top: 20px;
        }
        color: #333;

        .sort{
            padding:10px 0;
            border-bottom:1px solid #aaa;
            margin-bottom: 10px;
        }

        ul, li {
            list-style: none;
            padding: 0;
        }

        .directory ul li{
            width: 90%;

        }

        a {
            text-decoration: none;
            color: #333;
        }

        .author, .intro{
            margin-top:10px;
        }

        .title{
            font-weight: 600;
            font-size: 20px;
            height:30px;
            line-height:30px;
        }


        .directory ul li a{
            display: inline-block;
            height: 25px;
            line-height: 25px;

            width:100%;
            overflow: hidden;
            text-overflow: ellipsis;

            word-wrap: break-word;
            white-space: nowrap ;
        }

        .continue{
            margin:10px 0;
            a{
                color:#FF5151;
            }
        }
    }
</style>