<template>
    <div id="chapter" class="theme" :class="themeCss" @click="clickPage" >
        <Loading v-show="loading"></Loading>

        <reader v-if="!loading"

                :title="title"
                :content="text"
                :page-num="pageNum"
                :turn-direction="turnDirection"
                :turn-mode="turnMode"
                :line-height="lineHeight"
                :font-size="fontSize"
                :turn-to-last-page="turnToLastPage"
                :next="next"
                :prev="prev"

                v-swipeleft="(e)=>vueTouch('left',e)"
                v-swiperight="(e)=>vueTouch('right',e)"
                v-swipedown="(e)=>vueTouch('down',e)"
                v-swipeup="(e)=>vueTouch('up',e)"

                @callback="callback"
        ></reader>

        <toolbar v-if="showToolbar"
                 :themeCss="themeCss"
                 :turnMode="turnMode"
                 :next="next"
                 :prev="prev"

                 @callback="callback"
        ></toolbar>

        <table-of-content v-if="showToc"
                          :titleList="titleList"
                          :chapterNum="chapterNum"
                          @chapterJump="chapterJump"
        ></table-of-content>
    </div>
</template>

<script>
    import Loading from '../components/Loading.vue'
    import Reader from '../components/Reader.vue'
    import Toolbar from '../components/Toolbar.vue'
    import TableOfContent from '../components/TableOfContent.vue'
    import bookApi from '../api/book.js'


    export default {
        name: 'Chapter',
        components: {
            Loading,Reader,Toolbar,TableOfContent
        },
        data(){
          return {
              loading: true,
              showToolbar: false,
              showToc: false,
              turnMode: "",        // vertical or horizontal
              turnDirection: "",
              /* --------------- chapter ---------------- */
              titleList:[],
              novelId: -1,
              chapterNum: 1,
              pageNum: 1,
              pageTotal: 0,
              title: "",
              text: "",
              next: null,
              prev: null,
              turnToLastPage: false,
              /* --------------- setting ---------------- */
              fontSizeInterval: 0,
              lineHeight: 30,
              fontSize: 16,
              themeCss: 'color-white'
          }
        },
        created(){
            if(this.$route.params){
                this.novelId = this.$route.params.novelId;
                this.loadNovel();

                var chapterNum = this.$route.params.chapterNum;
                this.loadChapter(chapterNum)
            }

            this.loadSetting()

        },
        mounted(){
        },
        methods:{
            loadSetting(){

                // 字体大小
                var fontSizeInterval = bookApi.getSetting("fontSizeInterval");
                if(fontSizeInterval){
                    var i = parseInt(fontSizeInterval)
                    this.fontSize += i;
                    this.lineHeight += i;
                    this.fontSizeInterval = i;
                }

                var themeCss =  bookApi.getSetting("themeCss")
                if(themeCss){
                    this.themeCss = themeCss;
                }

                var turnMode =  bookApi.getSetting("turnMode")
                if(turnMode){
                    this.turnMode = turnMode;
                }

            },
            vueTouch(type){

                if(!this.turnMode){
                    return
                }

                if(type == 'left' && this.turnMode == 'horizontal'){
                    this.pageGo(-1)
                }else if(type == 'right' && this.turnMode == 'horizontal'){
                    this.pageGo(1)
                }else if(type == 'up' && this.turnMode == 'vertical'){
                    this.pageGo(1)
                }else if(type == 'down' && this.turnMode == 'vertical'){
                    this.pageGo(-1)
                }
            },
            callback(key, val){
                if(key == "showBookInfo"){
                    this.$router.push("/novel/" + this.novelId)
                    return
                }
                if(key == 'fontSizeInterval'){
                    this.fontSize += val;
                    this.lineHeight += val;
                    this.fontSizeInterval += val;
                    bookApi.saveSetting("fontSizeInterval", this.fontSizeInterval)
                }
                if(key == 'themeCss'){
                    this.themeCss = val;
                    bookApi.saveSetting("themeCss", val)
                }
                if(key == 'turnMode'){
                    bookApi.saveSetting("turnMode", val)
                    this.turnMode = val
                }
                if(key == 'showToc'){
                    this.showToc = val
                    this.showToolbar = false
                }
                if(key == 'pageTotal'){
                    this.pageTotal = val;
                }
                if(key == 'pageNum'){
                    this.pageNum = val;
                    bookApi.saveSetting("pageNum", this.novelId, this.pageNum)
                }
                if(key == 'pageGo'){
                    this.pageGo(val)
                }
                if(key == 'chapterGo'){
                    this.turnDirection = ""
                    if(val == -1){
                        this.loadChapter(this.prev)
                    }else{
                        this.loadChapter(this.next)
                    }
                }
            },
            setShowToc(){
                this.showToc = true;
            },
            loadNovel(){
                bookApi.getNovel(this.novelId).then(v=>{
                    if(v){
                        this.titleList = v.chapters;
                    }
                })
            },
            loadChapter(chapterNum, turnToLastPage){
                if(!chapterNum){
                    return;
                }

                this.turnToLastPage = turnToLastPage;
                this.loading = true;
                this.pageNum = 0;   // 只有当pageNum发生改变时才会触发滚动动画，pageNum初始值为0，Reader加载完成后更新为1，触发动画
                bookApi.getChapter(this.novelId, chapterNum).then(v => {
                    this.title = v.title;
                    this.text = v.text;
                    this.next = v.next;
                    this.prev = v.prev;
                    this.chapterNum = chapterNum;

                    this.loading = false

                    bookApi.saveSetting("chapterNum", this.novelId, chapterNum)

                    // 跳转章节后同步修改浏览器地址栏
                    var pre = process.env.VUE_APP_BASE_URL ? process.env.VUE_APP_BASE_URL : "";
                    var chapterURL = pre + "/novel/" + this.novelId + "/chapter/" + this.chapterNum;
                    history.replaceState({}, null, chapterURL);

                    // 增加百度统计
                    this.$ba.trackPageview(chapterURL)

                }).catch(ex => {
                    alert(ex)
                    this.turnDirection = ""
                    this.loading = false
                })
            },
            chapterJump(chapterNum){
                this.turnDirection = ""
                this.showToc = false
                this.showToolbar = false
                this.loadChapter(chapterNum)
            },
            chapterGo: function(arrow){
                this.turnDirection = ""

                if(arrow == -1){
                    this.loadChapter(this.prev)
                }else{
                    this.loadChapter(this.next)
                }
            },
            pageGo: function(arrow){

                if(this.turnMode == 'horizontal'){
                    this.turnDirection = arrow > 0 ? "slide-right" : "slide-left";
                }else{
                    this.turnDirection = arrow > 0 ? "slide-down" : "slide-up";
                }
                if(this.pageNum + arrow < 1){
                    // 加载上一章最后一页面
                    this.loadChapter(this.prev, true);
                    return;
                }

                if(this.pageNum + arrow > this.pageTotal){
                    // 加载下一章第一页
                    this.loadChapter(this.next);
                    return;
                }

                this.pageNum += arrow
                bookApi.saveSetting("pageNum", this.novelId, this.pageNum)
            },
            clickPage: function (e) {
                if(this.loading){
                    return
                }
                var posType = this.getScreenPostionType(e);

                // 如果已经打开toolbar 则关闭toolbar
                if(this.showToolbar){
                    this.showToolbar = false;
                    return;
                }

                if(this.showToc){
                    this.showToc = false;
                    return;
                }

                // 点击上半部分进入上一页
                if(posType == 1 && this.turnMode){
                    this.pageGo(-1)
                }
                // 点击中间弹出设置设置
                if(posType == 2){
                    this.showToolbar = !this.showToolbar;
                }
                // 点击下半部分进入下一页
                if(posType == 3 && this.turnMode){
                    this.pageGo(1)
                }
            },
            getScreenPostionType: function(e){
                var clientHeight = document.documentElement.clientHeight;
                var clientWidth =  document.documentElement.clientWidth;

                var clientY = e.clientY;
                var clientX = e.clientX;

                var y = Math.ceil(clientY / (clientHeight / 3));
                var x = Math.ceil(clientX / (clientWidth / 3))

                // 判断是否是下一页
                if(y == 3 || (y == 2 && x == 3)){
                    return 3;
                }
                // 判断是否是点击设置
                else if(y == 2 && x == 2){
                    return 2;
                }
                // 判断是否上一页
                else{
                    return 1;
                }
            }
        }

    }
</script>

<style lang="scss">
    body{
        margin: 0;
        padding: 0;
    }
    #chapter {

        @media screen and (max-width: 960px) {
            .book-btn{
                display:none;
            }
        }

        .book-btn{
            position: absolute;
            width:100px;
            height:100px;
            line-height:100px;
            text-align:center;
            top:50%;
            z-index: 999;
            .iconfont{
                font-size:50px;
            }
        }

        .left{
            left:20px;
        }

        .right{
            right:20px;
        }
    }
</style>
