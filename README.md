# 安装与使用
```
// 安装依赖 
npm install

// 开发时运行 
npm run serve

// 发布正式版本 
npm run build-prod

```


# 配置文件
配置文件路径为: /src/config/config.js，其中使用了 process.env.VUE_APP_BASE_URL 变量，用于区分环境的差异，这个变量定义在 .env.prod 中


# 百度统计
增加了百度统计(2019-08-06)，请注意移除或者修改，影响代码：
* npm install vue-ba --save
* main.js 中 新增代码
``` js
import ba from 'vue-ba'
Vue.use(ba, '764983231767f686c84e1180cd32e85b')  // 此处可改为你自己的百度统计SiteId
```
* Index.vue / Novel.vue 增加代码
```js
 this.$ba.trackPageview(chapterURL)
```
* Chapter.vue reader组件上增加代码
```html
<reader ... 
    v-track-pageview="'/novel/' + novelId + '/chapter/' + chapterNum"
    >
</reader>
```

# 更新日志
2019-08-06: 修复目录下拉到底后文章跟着滚动bug，首页增加小说是否更新的标志
