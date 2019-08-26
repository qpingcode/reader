<template>
    <div class="site-index site-background">
        <SiteHeader></SiteHeader>


        <Loading v-show="loading"></Loading>

        <div class="site-center-wrappter">
            <div v-if="searchEnable" class="search">
                <input class="txt" name="searchTxt" v-model="searchTxt" placeholder="当前小说库中共 100609 本书">
                <div class="btn" @click="goSearch">搜索</div>
            </div>

            <div class="novel-list">
                <ul>
                    <li :key="item.id" v-for="item in novelList">
                        <div class="novel">
                            <a @click="clickNovel(item.id)">
                                <div class="title">
                                    {{item.title}} <i v-if="isUpdated(item.id, item.latestChapterNum)" class="iconfont book-xin new"></i>
                                </div>
                                <div class="author"> {{item.author}} {{unread(item.id, item.latestChapterNum)}} </div>
                                <div class="intro">{{item.latestChapterTitle}} </div>
                            </a>
                        </div>
                    </li>

                </ul>
            </div>

            <div class="page" v-if="pager">
                <ul>
                    <li v-bind:key="page" v-for="page in pager.pageNumList">
                        <a v-if="page == pageNum" class="active" href="javascript:void(0)">{{page}}</a>
                        <a v-else @click="init(page)">{{page}}</a>
                    </li>
                    <li> 共 {{totalSize}} 条记录</li>
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
                loading: false,
                searchEnable: true,
                searchTxt: '',
                novelList: [],
                totalSize: 0,
                pageNum: 1,
                pager: null,
            }
        },
        created(){
            this.init(1)
        },
        mounted() {
            // 增加百度统计代码
            var pre = process.env.VUE_APP_BASE_URL ? process.env.VUE_APP_BASE_URL : "";
            this.$ba.trackPageview(pre + "/")
        },
        methods: {
            init(page){

                this.pageNum = page

                bookApi.getNovels(page).then(v =>{
                    if(v.code != 1){
                        alert(v.msg);
                        return;
                    }

                    this.novelList = v.data.pageData.rows
                    this.totalSize = v.data.pageData.total
                    this.pager = v.data.pager

                    scrollTo(0,0)
                })
            },
            goSearch(){
                this.$router.push({path: "/search", query:{searchTxt: this.searchTxt, pageNum : 1}})
            },
            unread(novelId, lastest){
                let chapterNum = bookApi.getSetting("chapterNum", novelId)
                if(!chapterNum) return ' - 未读过';

                var unreadCount = lastest - chapterNum;

                if(unreadCount == 0) return "";


                return " - " + (unreadCount) + "章未读";

            },
            isUpdated(novelId, lastest){
                let chapterNum = bookApi.getSetting("chapterNum", novelId)
                if(!chapterNum || !lastest) return false;
                return lastest > chapterNum ;
            },
            clickNovel(novelId){
                let chapterNum = bookApi.getSetting("chapterNum", novelId)

                var chapterURL = "/novel/" + novelId;
                if(chapterNum){
                    chapterURL += "/chapter/" + chapterNum;
                }
                this.$router.push(chapterURL)
            }
        }
    }

</script>

<style lang="scss">
    .site-index {

        a {
            text-decoration: none;
            color: #333;
        }
        .new{
            color:orangered;
            font-size: 18px;
            font-weight: normal
        }

        .search{
            margin: 0px 0px;
            margin-top:20px;
            width:760px;

            input{
                font-size:16px;
                text-indent: 7px;
                color: #606266;
                border-radius:4px;
                transition: border-color .2s cubic-bezier(.645,.045,.355,1);
                outline: none;
                border: none;
                appearance: none;
                padding:0;
                margin: 0;
                height:30px;
                font-size:16px;
                border: 1px solid #dcdfe6;
            }

            .txt{
                width:200px;
                vertical-align: middle;
            }
            .btn{
                vertical-align: middle;
                border-radius:4px;
                margin-left:10px;
                display: inline-block;
                border: 1px solid #dcdfe6;
                background: white;
                text-align: center;
                height:30px;
                line-height: 30px;
                width:80px;
            }

            input:focus{
                border: 1px solid #409EFF;
            }



            @media screen and (max-width: 600px) {
                &{
                    width: calc(100% - 20px);
                    margin: 0px 10px;
                    margin-top:20px;
                }
            }
        }

        .novel-list{

            li{
                margin-top:20px;
                margin-right:20px;
                width:240px;
                display: inline-block;

                .novel{
                    padding:12px;
                    background-color: white;
                    border:1px solid #ccc;
                    .author,.title{
                        white-space:nowrap;
                        overflow: hidden;
                        word-break: break-all;
                        text-overflow: ellipsis;
                        height:20px;
                        line-height:20px;
                    }

                    .title{
                        font-weight: 600;
                        font-size: 18px;
                    }

                    .author{
                        font-size: 14px;
                        color: #888;
                        margin-top:5px;
                    }

                    .intro{
                        overflow: hidden;
                        word-break: break-all;
                        text-overflow: ellipsis;
                        font-size: 14px;
                        color: #888;
                        height:20px;
                    }
                }
            }


            @media screen and (max-width: 960px) {
                & li{
                    width: calc(100% - 20px);
                    margin: 0px 10px;
                    margin-top:20px;
                }
            }

        }

        .page{
            padding: 30px 10px;
        }

        .page li{
            display: inline-block;
            margin-left:10px;
        }

        .page li a{
            padding:5px 10px;
            border:1px solid #aaa;
            width:30px;
            height:30px;
            line-height: 30px;
            color: #000;
            background-color: #fff;
        }

        .page li a.active{
            color: #fff;
            background-color: #df5000;
            border:none;
        }
    }
</style>