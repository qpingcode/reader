<template>
    <div id="app" class="theme" :class="themeCss" @click="clickPage" >
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

                v-swipeleft="(e)=>vueTouch('left',e)"
                v-swiperight="(e)=>vueTouch('right',e)"
                v-swipedown="(e)=>vueTouch('down',e)"
                v-swipeup="(e)=>vueTouch('up',e)"

                @callback="callback"
        ></reader>

        <toolbar v-if="showToolbar"
                 :themeCss="themeCss"
                 :turnMode="turnMode"
                 @callback="callback"
        ></toolbar>

        <table-of-content v-if="showToc"
                          :titleList="titleList"
                          @chapterTo="chapterTo"
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
        name: 'app',
        components: {
            Loading,Reader,Toolbar,TableOfContent
        },
        data(){
          return {
              loading: true,
              showToolbar: false,
              showToc: false,
              turnMode: "horizontal",        // vertical or horizontal
              turnDirection: "",
              /* --------------- chapter ---------------- */
              titleList:[],
              novelId: 1,
              pageNum: 1,
              pageTotal: 0,
              title: "",
              text: "",
              next: null,
              prev: null,
              turnToLastPage: false,
              /* --------------- setting ---------------- */
              lineHeight: 30,
              fontSize: 16,
              themeCss: 'color-white'
          }
        },
        created(){
            if(this.$route.params){
                this.novelId = this.$route.params.novelId;
                var chapterNum = this.$route.params.chapterNum;

                this.loadNovel();
                this.loadChapter(chapterNum)
            }

        },
        methods:{
            vueTouch(type){

                if(!this.turnMode){
                    return
                }
                
                if(type == 'left' && this.turnMode == 'horizontal'){
                    this.pageGo(-1)
                }else if(type == 'right' && this.turnMode == 'horizontal'){
                    this.pageGo(1)
                }else if(type == 'up' && this.turnMode == 'vertical'){
                    this.pageGo(-1)
                }else if(type == 'down' && this.turnMode == 'vertical'){
                    this.pageGo(1)
                }
            },
            callback(key, val){
                if(key == 'fontSizeInterval'){
                    this.fontSize += val;
                    this.lineHeight += val;
                }
                if(key == 'themeCss'){
                    this.themeCss = val;
                }
                if(key == 'turnMode'){
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
                bookApi.getChapter(this.novelId, chapterNum).then(v => {
                    this.title = v.title;
                    this.text = v.text;
                    this.pageNum = 0;           // 只有当pageNum发生改变时才会触发滚动动画，pageNum初始值为0，Reader加载完成后更新为1，触发动画
                    this.next = v.next;
                    this.prev = v.prev;

                    this.loading = false

                }).catch(ex => {
                    alert(ex)
                    this.turnDirection = ""
                    this.loading = false
                })
            },
            chapterTo(chapterNum){
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
    #app {
    }
</style>
