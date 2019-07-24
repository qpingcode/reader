import base from "./base.js"
import config from '../config/config.js'


var api = {
    getChapter(novelId, pageNum){
        return base({
            url: config.url.book + "api/novel/" + novelId + "/chapter/" + pageNum,
            method: "post"
        })
    },
    getNovel(novelId){
        return base({
            url: config.url.book + "api/novel/" + novelId,
            method: "post"
        })
    },
}


export default api
