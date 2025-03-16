# 糊涂蛋uni的歌单
项目网页：[https://uni.bbvup.live/](https://uni.bbvup.live/)
关注糊涂蛋uni喵，关注糊涂蛋uni谢谢喵

## 部署使用

环境需要：Next.JS、python

### 歌单制作

1. 按照uni_song.xlsx制作歌单表格，并上传至金山文档
2. 修改converter.py对应的文档链接
3. 运行 `python3 scripts/converter.py`

### 修改配置文件

1. 修改`config/constants.js`中内容

```js
config = {
  Name: "", // 主页名字
  BiliLiveRoomID: "", // 直播间id
  NetEaseMusicId: "", // 网易云音乐id
  QQMusicId: "", // QQ音乐id
  Footer: "", // 页脚
  Cursor: true, // 使用自定义光标图片

  Mainlang: [], // 语言主分类
  LanguageCategories: [], // 语言分类索引（其他语言 将匹配，主分类内以外的语言）
  RemarkCategories: [], // 标签分类索引

  BannerTitle: "",  // 自我介绍标题

  BannerContent: [
    ``,             // 自我介绍内容
  ],

  // 自定义按钮 （可以复制生成更多）
  CustomButtons: [
    {
      link: "https://space.bilibili.com/397122798",
      name: " 录播组",
      image: "./assets/images/Nako_Avatar.png",
    },

  ],

  UpdateDate: "" // 更新日期 Footer
  ICP: "" // ICP备案号 Footer
};

```

### 启动开发环境

```bash
npm instal
npm run dev
```

### 导出静态网站

```bash
npm run build
npm run export
# or
npm run buildssg
```

Next.JS 自动生成的"out"文件夹可直接用于部署静态网页

## 配置相关

### 鼠标指针

鼠标指针：

资源目录 - `./assets/cursor/` 

配置： config - Cursor  

各个 styles 中的相关样式

## 修改相关

修改自项目：

[song-list-of-nanakaie](https://github.com/alan314m/song-list-of-nanakaie)

[vup-song-list](https://github.com/Akegarasu/vup-song-list)

[vup-song-list-main](https://github.com/Rndlab/vup-song-list-main)

对代码做了一些简单的优化修改，
按个人喜好调整了一些UI，并新增了一些CSS动画，同时做了一套全新的手机UI

本项目遵守 MIT License

