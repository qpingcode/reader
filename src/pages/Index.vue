<template>
    <div class="site-index site-background">
        <SiteHeader></SiteHeader>


        <Loading v-show="loading"></Loading>

        <div class="site-center-wrappter">
            <!--<div class="search">-->
                <!--<form id="form" action="/index" method="get">-->
                    <!--<input name="searchTxt" value="${searchTxt!''}" placeholder="请输入想搜索的小说标题" onkeyup="search">-->
                <!--</form>-->
            <!--</div>-->

            <div class="novel-list">
                <ul>
                    <li :key="item.id" v-for="item in novelList.rows">
                        <div class="novel">
                            <a :href="'/novel/' + item.id">
                                <div class="title">
                                    {{item.title}}
                                </div>
                                <div class="author"> {{item.author}} </div>
                                <div class="intro"> {{item.intro}} </div>
                            </a>
                        </div>
                    </li>

                </ul>
            </div>

            <!--<div class="page">-->
                <!--<ul>-->
                    <!--<li>-->
                        <!--<a class="active" href="/index?page=${pageNo}">${pageNo}</a>-->
                        <!--<a href="/index?page=${pageNo}&searchTxt=${searchTxt!''}">${pageNo}</a>-->
                    <!--</li>-->
                <!--</ul>-->
            <!--</div>-->
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
                novelList: []
            }
        },
        created(){
            bookApi.getNovels(1).then(v =>{
                this.novelList = v;
            })
        },
        mounted() {

        },
        methods: {

        }
    }

</script>

<style lang="scss">
    .site-index {
        a {
            text-decoration: none;
            color: #333;
        }

        .search{
            padding: 20px;
        }

        .search input{
            width:100%;
            height:30px;
            font-size:16px;
        }

        .novel-list{

            min-height: 100vh;

            li{
                margin-top:20px;
                margin-right:20px;
                width:140px;
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
            border:1px solid #aaa;
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
                color: #555;
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
            padding: 20px;
        }

        .page li{
            display: inline-block;
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