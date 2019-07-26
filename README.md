#### 业务场景
##### 在微信中  小程序无法分享到朋友圈，目前大部分的解决方案都是，canvas动态绘制 生成图片后，保存到用户相册，用户进行分享照片到朋友圈，朋友圈打开图片后识别二维码进入小程序，达到分享目的


#### github源码链接
https://github.com/richard1015/canvas
#### 微信IDE代码预览
https://developers.weixin.qq.com/s/DBZhf8mB7qaD

#### 海报需求设计图分析

###### 图1分析： 可以看到海报 要求宽750 高1218（当然了数据是动态的，高度肯定不会固定值，需要我们动态去计算）
![图1](https://user-gold-cdn.xitu.io/2019/7/26/16c2bf213627557d?w=494&h=748&f=png&s=78579)
##### 图2分析：矩形框 宽高为固定值 320 背景颜色#fff 圆角10
![图2](https://user-gold-cdn.xitu.io/2019/7/26/16c2bf261b9b1e94?w=792&h=781&f=png&s=119078)
##### 图3分析：矩形框 上半部分 宽320 高125 背景颜色#f7f7f7
![图3](https://user-gold-cdn.xitu.io/2019/7/26/16c2bf280688a23e?w=773&h=721&f=png&s=112158)

#### 代码逻辑实现

##### 1.模板逻辑 wxml添加canvas公用组件
```Html
<!--pages/index/index.wxml-->
<view class='index'>

  <!-- 公用canvas share -->
  <import src="../common/canvasShare.wxml" />
  <template data="{{shareCanvasItem}}" is="canvas-share" />

  <!-- content 内容预显示 begin -->
  <view class='content'>
    <view class='content_header'>
      <view class='left' bindtap='toChoiceBank'>
        <text>中国银行（测试数据）</text>
      </view>
    </view>
    <view class='content_item'>
      ...此处省略
    </view>
  </view>
  <!-- content end -->
  <import src="../common/footerShare.wxml" />
  <template is="footer-share" />
</view>
```
##### 2.canvas公用模板设计
```Html
<template name="canvas-share">
  <!-- <view style='width:0px;height:0px;overflow:hidden;opacity: 0;'> -->
    <canvas style="height:{{shareCanvasItem.Height}}px !important;" class='shareCanvas' canvas-id="shareCanvas" binderror="canvasIdErrorCallback"></canvas>
  <!-- </view> -->
</template>
```

#### 3.js 逻辑实现
```JavaScript
// 调用公用组件
let {
  CanvasUtil,
  util
} = getApp();
// 测试数据引入
const testData= require('../../test.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    shareCanvasItem: {
      Height: 5000
    },//初始canvas高度，设置背景黑，此高度必须大于 动态生成内容高度，否则 无法全面覆盖背景
    items: [],
  },
  onLoad: function() {
    this.getList();
  },
  //获取列表数据
  getList() {
    var self = this;

    // purchasePrice 汇买价
    // cashPrice 钞买价
    // sellingPrice 汇卖价
    // banknotePrice 钞卖价
    //赋值过滤健全item
    self.setData({
      items: testData
    });
  },

  /* 分享事件 */
  share: function() {
    console.log('分享');
    var self = this;

    let titleTemp = `今日中行外汇牌价`;

    let tips = '*以上为保存时间的牌价，成交价格以实际交易为准';
    // 获取设备宽高
    var res = wx.getSystemInfoSync();
    var canvasWidth = res.windowWidth;
    var canvasHeight = self.data.shareCanvasItem.Height;
    // 获取canvas的的宽  自适应宽（设备宽/750) px
    var Rpx = (canvasWidth / 750).toFixed(2);
    //上边距
    var paddingTop = Rpx * 20;
    //左边距
    var paddingLeft = Rpx * 20;
    //右边距
    var paddingRight = Rpx * 20;
    //当前编写高
    var currentLineHeight = Rpx * 33;

    var context = wx.createCanvasContext('shareCanvas');

    //全局背景颜色默认填充
    context.setFillStyle('#333333');
    context.fillRect(0, 0, canvasWidth, canvasHeight);

    //字体颜色
    context.setFillStyle('#999999');
    context.setTextAlign('center');
    context.font = `${(Rpx * 36).toFixed(0)}px PingFangSC-Regular`;
    //内容行边距计算
    currentLineHeight += Rpx * 36;

    //标题文本 绘制
    context.fillText(titleTemp, canvasWidth / 2, currentLineHeight);
    context.setTextAlign('left');

    //内容行边距计算
    currentLineHeight += Rpx * 34;

    //item白色背景 矩形左右边距
    let padingLeftRightRect = Rpx * 40,
      rectRadius = Rpx * 10, //圆角10
      rectWidth = Rpx * 320, //宽
      rectHeight = Rpx * 320, //高
      topRectHeight = Rpx * 125; //美元上部分


    self.data.items.forEach((item, index) => {
      //保存上次绘制图，进行本次操作
      // context.save();
      //每两次进行换行逻辑
      if (index > 1 && index % 2 === 0) {
        //行高换行
        currentLineHeight += rectHeight + Rpx * 40;
        //边距重置
        padingLeftRightRect = Rpx * 40;
      }
      //局部 y  currentLineHeight
      //局部 x  padingLeftRightRect

      // 偶数为 left 处理逻辑  奇数为right 处理逻辑
      //left
      if (index % 2 === 0) {

      } else {
        //right 坐标 =  加矩形宽  + 中间距30
        padingLeftRightRect += rectWidth + Rpx * 30;
      }
      //矩形颜色设置
      context.setFillStyle('#ffffff');
      //调用绘制圆角矩形
      CanvasUtil.drawRoundedRect(context, padingLeftRightRect, currentLineHeight, rectWidth, rectHeight, rectRadius, true);
      //矩形上变背景颜色生成
      context.setFillStyle('#f7f7f7');
      //调用绘制圆角矩形
      CanvasUtil.drawRoundedRect(context, padingLeftRightRect, currentLineHeight, rectWidth, topRectHeight, rectRadius, true);

      //币种字体颜色
      context.setFillStyle('#333333');
      context.font = `${(Rpx * 34).toFixed(0)}px PingFangSC-Regular`;
      //币种文本绘制
      context.fillText(item.chName, padingLeftRightRect + Rpx * 26, currentLineHeight + Rpx * 30 + Rpx * 34);
      //币种英文绘制
      context.fillText(item.abridge, padingLeftRightRect + Rpx * 26, currentLineHeight + Rpx * 30 + Rpx * 34 * 2 + Rpx * 10);
      //绘制币种图案
      context.drawImage(`/currencyImg/${item.iconName}`, padingLeftRightRect + Rpx * 226, currentLineHeight + Rpx * 35, Rpx * 64, Rpx * 64);

      //价格字体颜色
      context.setFillStyle('#666666');
      context.font = `${(Rpx * 26).toFixed(0)}px PingFangSC-Regular`;
      context.fillText('钞买价', padingLeftRightRect + Rpx * 26, currentLineHeight + Rpx * 30 + Rpx * 34 * 2 + Rpx * 70, currentLineHeight + Rpx * 30 + Rpx * 34 * 2 + Rpx * 10);

      context.fillText('汇买价', padingLeftRightRect + Rpx * 26, currentLineHeight + Rpx * 30 + Rpx * 34 * 2 + Rpx * 110, currentLineHeight + Rpx * 30 + Rpx * 34 * 2 + Rpx * 10);

      context.fillText('钞卖价', padingLeftRightRect + Rpx * 26, currentLineHeight + Rpx * 30 + Rpx * 34 * 2 + Rpx * 150, currentLineHeight + Rpx * 30 + Rpx * 34 * 2 + Rpx * 10);

      context.fillText('汇卖价', padingLeftRightRect + Rpx * 26, currentLineHeight + Rpx * 30 + Rpx * 34 * 2 + Rpx * 190, currentLineHeight + Rpx * 30 + Rpx * 34 * 2 + Rpx * 10);
      //价格值字体颜色
      context.setFillStyle('#333333');
      //钞买价
      context.fillText(item.cashPrice, padingLeftRightRect + Rpx * 204, currentLineHeight + Rpx * 30 + Rpx * 34 * 2 + Rpx * 70, currentLineHeight + Rpx * 30 + Rpx * 34 * 2 + Rpx * 10);
      // 汇买价
      context.fillText(item.purchasePrice, padingLeftRightRect + Rpx * 204, currentLineHeight + Rpx * 30 + Rpx * 34 * 2 + Rpx * 110, currentLineHeight + Rpx * 30 + Rpx * 34 * 2 + Rpx * 10);
      //钞卖价
      context.fillText(item.banknotePrice, padingLeftRightRect + Rpx * 204, currentLineHeight + Rpx * 30 + Rpx * 34 * 2 + Rpx * 150, currentLineHeight + Rpx * 30 + Rpx * 34 * 2 + Rpx * 10);
      //汇卖价
      context.fillText(item.sellingPrice, padingLeftRightRect + Rpx * 204, currentLineHeight + Rpx * 30 + Rpx * 34 * 2 + Rpx * 190, currentLineHeight + Rpx * 30 + Rpx * 34 * 2 + Rpx * 10);

      //操作完成后恢复上次值
      // context.restore();
    });
    //行高换行
    currentLineHeight += rectHeight + Rpx * 40;



    //字体颜色
    context.setFillStyle('#999999');
    context.setTextAlign('center');
    context.font = `${(Rpx * 28).toFixed(0)}px PingFangSC-Regular`;
    //领取提示文本 绘制
    context.fillText(tips, canvasWidth / 2, currentLineHeight);

    //行高换行
    currentLineHeight += Rpx * 30;

    //qrcode生成图片
    context.drawImage('/imgs/qrcode.png', paddingLeft, currentLineHeight, canvasWidth - paddingLeft - paddingRight, Rpx * 200);

    context.setTextAlign('left');
    //字体颜色
    context.setFillStyle('#EEC62E');
    context.font = `${(Rpx * 32).toFixed(0)}px PingFangSC-Regular`;
    //领取提示文本 绘制
    context.fillText('测试canvas', paddingLeft + Rpx * 43, currentLineHeight + Rpx * 90);

    //字体颜色
    context.setFillStyle('#999999');
    context.font = `${(Rpx * 28).toFixed(0)}px PingFangSC-Regular`;
    //领取提示文本 绘制
    context.fillText('出境游、炒汇必备神器', paddingLeft + Rpx * 43, currentLineHeight + Rpx * 130);

    //内容行高控制
    currentLineHeight += Rpx * 220;


    //设置最终canvas高度
    self.setData({
      shareCanvasItem: {
        Height: currentLineHeight
      }
    });
    //绘制完成
    context.draw();
    //调用公共组件保存图片
    util.saveImg();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {}
})
```
#### CanvasUtil testData 数据代码省略... 请查看顶部源码链接