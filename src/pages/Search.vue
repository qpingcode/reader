<template>
    <div class="site-index site-background">
        <SiteHeader></SiteHeader>

        <div class="site-center-wrappter">
            <div class="search">
                <input class="txt" name="searchTxt" v-model="searchTxt" placeholder="请输入想搜索的小说标题">
                <input class="btn" type="button" value="搜索" @click="search"/>
            </div>

            <div class="novel-list">
                <ul>
                    <li :key="item.id" v-for="item in novelList">
                        <div class="novel">
                            <a @click="clickNovel(item.id)">
                                <div class="title">
                                    {{item.title}}
                                </div>
                                <div class="author">作者：{{item.author}}</div>
                                <div class="author">来源：{{item.baseUrl ? item.baseUrl.replace("https://", "").replace("http://", "") : ""}} </div>
                                <div class="author" v-if="item.wordCount">字数：{{(item.wordCount / 10000).toFixed(2)}} 万</div>
                                <div class="author">状态：{{item.complete == 1 ? "已完结" : "连载中"}}</div>
                            </a>
                        </div>
                    </li>

                </ul>
            </div>

            <div class="page" v-if="pager">
                <ul>
                    <li v-bind:key="page" v-for="page in pager.pageNumList">
                        <a v-if="page == pageNum" class="active" href="javascript:void(0)">{{page}}</a>
                        <a v-else @click="goPage(page)">{{page}}</a>
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
        components: {SiteHeader},
        data() {
            return {
                loading: false,
                searchTxt: '',
                novelList: [],
                pager:null,
                totalSize: 0,
                pageNum:0
            }
        },
        mounted(){

            this.searchTxt = this.$route.query.searchTxt;
            this.pageNum = this.$route.query.pageNum;

            if(this.searchTxt){
                this.search();
            }
        },
        methods: {
            goPage(pageNum){
                this.searchTxt = this.searchTxt;
                this.pageNum = pageNum;
                this.search()
            },
            search(){
                bookApi.search(this.searchTxt, this.pageNum).then(v => {

                    if(v.code != 1){
                        alert(v.msg);
                        return;
                    }
                    this.novelList = v.data.pageData.rows
                    this.totalSize = v.data.totalSize
                    this.pageNum = v.data.pager.pageNum
                    this.pager = v.data.pager

                    scrollTo(0,0)
                })
            },
            clickNovel(spiderId){
                this.loading = true
                bookApi.index(spiderId).then(v => {
                    var novelId = v.data.novelId;
                    bookApi.update(novelId)
                    setTimeout(() => {
                        this.$router.push("/novel/" + novelId)
                    },1000)
                })

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
                width:100%;
                height:30px;
                font-size:16px;
                border: 1px solid #dcdfe6;
            }

            .txt{
                width:300px;
            }
            .btn{
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
            }


            @media screen and (max-width: 960px) {
                & li{
                    width: calc(100% - 20px);
                    margin: 0px 10px;
                    margin-top:20px;

                    .novel{
                        .intro{
                            height:60px;
                        }
                    }
                }
            }

        }

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
                height:120px;
                margin-top:10px;
                font-size: 14px;
                color: #888;
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