import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)


const Index = () => import('@/pages/Index.vue')
const Chapter = () => import('@/pages/Chapter.vue')
const Novel = () => import('@/pages/Novel.vue')

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'Index',
            component: Index
        },
        {
            path: '/novel/:novelId',
            name: 'Novel',
            component: Novel
        },
        {
            path: '/novel/:novelId/chapter/:chapterNum',
            name: 'Chapter',
            component: Chapter
        },
    ]
})