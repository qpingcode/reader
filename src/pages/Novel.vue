<template>
    <div class="novel-index">
        <Loading v-show="loading"></Loading>

        <div class="container" v-if="!loading">
            <div class="title"> {{novel.title}}</div>
            <div class="author"> 作者：{{novel.author}}</div>
            <div class="intro"> 简介：{{novel.intro}}</div>
            <div class="sort" @click.stop="sort">
                <i class="iconfont book-sort"></i> 倒序
            </div>
            <div class="directory">
                <ul>
                    <li v-for="item in novel.chapters" :key="item.num">
                        <router-link :to="'/novel/' + novel.id + '/chapter/' + item.num">{{item.title}}</router-link>
                    </li>
                </ul>
            </div>
        </div>

    </div>
</template>

<script>
    import bookApi from '../api/book.js'
    import Loading from '../components/Loading.vue'

    export default {
        name: 'Novel',
        components: {Loading},
        data() {
            return {
                loading: true,
                novel: {
                    chapters: []
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
        margin: 0;
        background-color: #fefff7;
        color: #333;
        padding: 20px;

        .sort{
            padding:20px 0;
            border-bottom:1px solid #aaa;
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
            height: 20px;
            line-height: 20px;

            width:100%;
            overflow: hidden;
            text-overflow: ellipsis;

            word-wrap: break-word;
            white-space: nowrap ;
        }
    }
</style>