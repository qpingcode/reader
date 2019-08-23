# 演示地址
[点击进入演示系统，仅供参考](http://demo.qping.me/reader)

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
* Index.vue / Novel.vue / Chapter.vue 增加代码
```js
 this.$ba.trackPageview(chapterURL)
```


# 后端API
后端API地址：http://demo.qping.me/reader/api


| 接口说明                           | 说明                                           | 例子                                |
| ---------------------------------- | ---------------------------------------------- | ----------------------------------- |
| /api/spider/search/搜索关键字/页码   | 搜索接口                                     | /api/spider/search/回到明朝当王爷/1           |
| /api/spider/index/爬虫ID           | 索引接口，爬虫ID由搜索接口返回                   | /api/spider/index/97237  |
| /api/spider/update/小说ID          | 爬取小说章节信息，小说ID由索引接口返回           |  /api/spider/update/1                |
| /api/novels/页码                   | 显示所有已爬小说列表                            | /api/novels/1                       |
| /api/novel/小说ID                  | 显示小说主页，展示目录、简介、标题、作者等信息     |  /api/novel/1                        |
| /api/novel/小说ID/chapter/章节页码  | 获取章节内容                                   | /api/novel/1/chapter/1              |



# 更新日志
* 2019-08-06: 修复目录下拉到底后文章跟着滚动bug，首页增加小说是否更新的标志
* 2019-08-07: 首页增加未读章节数量显示，当没有下一章时下一章按钮置灰（上一章同样处理）
* 2019-08-23: 增加了搜索功能
