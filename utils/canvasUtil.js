/*
 * @Author: zhuzhida 
 * @Date: 2018-10-26 14:27:07 
 * @Last Modified by: zhuzhida
 * @Last Modified time: 2018-10-26 14:31:06
 */
class CanvasUtil {
  /**
   * canvas 文本换行计算
   * @param {*} context CanvasContext
   * @param {string} text 文本
   * @param {number} width 内容宽度
   * @param {font} font 字体（字体大小会影响宽）
   */
  static breakLinesForCanvas(context, text, width, font) {
    function findBreakPoint(text, width, context) {
      var min = 0;
      var max = text.length - 1;
      while (min <= max) {
        var middle = Math.floor((min + max) / 2);
        var middleWidth = context.measureText(text.substr(0, middle)).width;
        var oneCharWiderThanMiddleWidth = context.measureText(text.substr(0, middle + 1)).width;
        if (middleWidth <= width && oneCharWiderThanMiddleWidth > width) {
          return middle;
        }
        if (middleWidth < width) {
          min = middle + 1;
        } else {
          max = middle - 1;
        }
      }

      return -1;
    }


    var result = [];
    if (font) {
      context.font = font;
    }
    var textArray = text.split('\r\n');
    for (let i = 0; i < textArray.length; i++) {
      let item = textArray[i];
      var breakPoint = 0;
      while ((breakPoint = findBreakPoint(item, width, context)) !== -1) {
        result.push(item.substr(0, breakPoint));
        item = item.substr(breakPoint);
      }
      if (item) {
        result.push(item);
      }
    }
    return result;
  }
  /**
   * 图片裁剪画圆
   * @param {*} ctx CanvasContext
   * @param {img} img 图片
   * @param {number} x x轴 坐标
   * @param {number} y y轴 坐标
   * @param {number*} r 半径
   */
  static circleImg(ctx, img, x, y, r) {
    ctx.save();
    var d = 2 * r;
    var cx = x + r;
    var cy = y + r;
    ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    ctx.clip();
    ctx.drawImage(img, x, y, d, d);
    ctx.restore();
  }
  /**
   * 绘制圆角矩形
   * @param {*} ctx CanvasContext
   * @param {*} x x轴 坐标
   * @param {*} y y轴 坐标
   * @param {*} width 宽
   * @param {*} height 高
   * @param {*} r r 圆角
   * @param {boolean} fill 是否填充颜色
   */
  static drawRoundedRect(ctx, x, y, width, height, r, fill) {


    ctx.beginPath();
    ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 3 / 2);
    ctx.lineTo(width - r + x, y);
    ctx.arc(width - r + x, r + y, r, Math.PI * 3 / 2, Math.PI * 2);
    ctx.lineTo(width + x, height + y - r);
    ctx.arc(width - r + x, height - r + y, r, 0, Math.PI * 1 / 2);
    ctx.lineTo(r + x, height + y);
    ctx.arc(r + x, height - r + y, r, Math.PI * 1 / 2, Math.PI);
    ctx.closePath();
    if (fill) {
      ctx.fill();
    }

  }
}
export default CanvasUtil;