/*
 * @Author: zhuzhida 
 * @Date: 2018-10-26 14:31:11 
 * @Last Modified by:   zhuzhida 
 * @Last Modified time: 2018-10-26 14:31:11 
 */
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function getLocalTime(days = 0, date = new Date()) {
  var d = new Date(date);
  d.setDate(d.getDate() + days);
  var m = d.getMonth() + 1;
  return d.getFullYear() + '-' + m + '-' + d.getDate();
}




module.exports = {
  formatTime: formatTime,
  getLocalTime: getLocalTime,
  getOpenId: function() {
    console.log('get openid');
    return wx.getStorageSync('openid') || ''
  },
  saveImg: function() {
    wx.showLoading({
      title: '生成中',
    })
    setTimeout(() => {
      wx.canvasToTempFilePath({
        canvasId: 'shareCanvas',
        fileType: 'jpg',
        success: function(res) {
          wx.hideLoading()
          //跳转公共查看canvas图片页面
          wx.navigateTo({
            url: `/pages/commonShare/commonShare?url=${res.tempFilePath}`
          })
        }
      })
    }, 1000);
  }
}