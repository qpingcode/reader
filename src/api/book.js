import base from "./base.js"
import config from '../config/config.js'


var api = {
    saveSetting(key, val, val2){
        if(val2){
            localStorage.setItem(key + "|" + val, val2);
        }else{
            localStorage.setItem(key, val);
        }

    },
    getSetting(key, id){
        if(id){
            return localStorage.getItem(key + "|" + id)
        }else{
            return localStorage.getItem(key)
        }
    },
    search(searchTxt, pageNum){
        return base({
            url: config.url.book + "api/spider/search/" + searchTxt + "/" + pageNum,
            method: "get",
        })
    },
    index(spiderId){
        return base({
            url: config.url.book + "api/spider/index/" + spiderId,
            method: "get",
        })
    },
    update(novelId){
        return base({
            url: config.url.book + "api/spider/update/" + novelId,
            method: "get",
        })
    },
    getNovels(pageNum){
        return base({
            url: config.url.book + "api/novels/" + pageNum,
            method: "post"
        })
    },
    getNovel(novelId){
        return base({
            url: config.url.book + "api/novel/" + novelId,
            method: "post"
        })
    },
    getChapter(novelId, pageNum){
        return base({
            url: config.url.book + "api/novel/" + novelId + "/chapter/" + pageNum,
            method: "post"
        })
    },

}


export default api
