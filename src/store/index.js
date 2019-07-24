import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
    state:{
        turnDirection: '', // turnDirection
        chapter:{
            novelId: -1,
            num: -1,
            prev: null,
            next: null
        },
        setting:{
            fontSize: 16,
            lineHeight: 30
        }
    },
    mutations:{
        fontSize(state, increment){
            state.setting.fontSize += increment;
        },
        lineHeight(state, increment){
            state.setting.lineHeight += increment;
        },
        turnMode(state, turnModeType){
            state.turnMode = turnModeType;
        },
        pageNum(state, pageNum){
            state.chapter.pageNum = pageNum;
        },
        turnDirection(state, pageNumIncrement){
            if(state.setting.turnMode == 'horizontal'){
                state.turnDirection = pageNumIncrement > 0 ? "slide-right" : "slide-left";
            }else{
                state.turnDirection = pageNumIncrement > 0 ? "slide-down" : "slide-up";
            }
        },
        resetTurnDirection(state){
            state.turnDirection = "";
        },
        chapter(state, chapter){
            state.chapter = chapter
        }
    },
    getters: {

    },
    actions: {
        changeFont(context, increment){
            context.commit("fontSize", increment)
            context.commit("lineHeight", increment)
        },
        changeTurnMode(context, turnModeType){
            context.commit("turnMode", turnModeType)
        },
        changePageNum(context, pageNumIncrement){
            if(!context.state.setting.turnMode) {
                return
            }
            context.commit("turnDirection", pageNumIncrement)
            context.commit("pageNum", context.state.chapter.pageNum + pageNumIncrement)
        },
        resetPageNum(context){
            context.commit("pageNum", 1)
            context.commit("resetTurnDirection")
        },
        changeChapter(context, chapter){
            context.commit("chapter", chapter)
        }
    },
    strict: debug,
})