// pages/index/index.js
let {
  CanvasUtil,
  util
} = getApp();
const testData= require('../../test.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    shareCanvasItem: {
      Height: 5000
    },//初始canvas高度，设置背景黑，防止动态生成内容过高
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

    //背景颜色默认填充
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
      CanvasUtil.drawRoundedRect(context, padingLeftRightRect, currentLineHeight, rectWidth, rectHeight, rectRadius, true);
      //矩形上变背景颜色生成
      context.setFillStyle('#f7f7f7');
      CanvasUtil.drawRoundedRect(context, padingLeftRightRect, currentLineHeight, rectWidth, topRectHeight, rectRadius, true);

      //字体颜色
      context.setFillStyle('#333333');
      context.font = `${(Rpx * 34).toFixed(0)}px PingFangSC-Regular`;
      context.fillText(item.chName, padingLeftRightRect + Rpx * 26, currentLineHeight + Rpx * 30 + Rpx * 34);
      context.fillText(item.abridge, padingLeftRightRect + Rpx * 26, currentLineHeight + Rpx * 30 + Rpx * 34 * 2 + Rpx * 10);
      context.drawImage(`/currencyImg/${item.iconName}`, padingLeftRightRect + Rpx * 226, currentLineHeight + Rpx * 35, Rpx * 64, Rpx * 64);

      //字体颜色
      context.setFillStyle('#666666');
      context.font = `${(Rpx * 26).toFixed(0)}px PingFangSC-Regular`;
      context.fillText('钞买价', padingLeftRightRect + Rpx * 26, currentLineHeight + Rpx * 30 + Rpx * 34 * 2 + Rpx * 70, currentLineHeight + Rpx * 30 + Rpx * 34 * 2 + Rpx * 10);

      context.fillText('汇买价', padingLeftRightRect + Rpx * 26, currentLineHeight + Rpx * 30 + Rpx * 34 * 2 + Rpx * 110, currentLineHeight + Rpx * 30 + Rpx * 34 * 2 + Rpx * 10);

      context.fillText('钞卖价', padingLeftRightRect + Rpx * 26, currentLineHeight + Rpx * 30 + Rpx * 34 * 2 + Rpx * 150, currentLineHeight + Rpx * 30 + Rpx * 34 * 2 + Rpx * 10);

      context.fillText('汇卖价', padingLeftRightRect + Rpx * 26, currentLineHeight + Rpx * 30 + Rpx * 34 * 2 + Rpx * 190, currentLineHeight + Rpx * 30 + Rpx * 34 * 2 + Rpx * 10);
      //字体颜色
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
    context.fillText('汇率换算器', paddingLeft + Rpx * 43, currentLineHeight + Rpx * 90);

    //字体颜色
    context.setFillStyle('#999999');
    context.font = `${(Rpx * 28).toFixed(0)}px PingFangSC-Regular`;
    //领取提示文本 绘制
    context.fillText('留学、出境游、炒汇必备神器', paddingLeft + Rpx * 43, currentLineHeight + Rpx * 130);

    //内容行高控制
    currentLineHeight += Rpx * 220;


    //设置最终canvas高度
    self.setData({
      shareCanvasItem: {
        Height: currentLineHeight
      }
    });

    context.draw();
    util.saveImg();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {

  }
})