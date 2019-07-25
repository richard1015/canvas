//app.js
import canvasUtil from "./utils/canvasUtil.js";
var util = require("./utils/util.js");
App({
  onLaunch: function() {
    var self = this
    console.log('App Launch')
    self.util = util;
    self.CanvasUtil = canvasUtil;
  },
  onShow: function() {
    console.log('App Show')
  },
  onHide: function() {
    console.log('App Hide')
  }
})