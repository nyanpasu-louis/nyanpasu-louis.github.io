/* ============================================================
   显示比例 — 只缩放“字号”与“点阵尺寸”，不改动布局
   ------------------------------------------------------------
   规则：scale = 窗口宽 / 1920
   ------------------------------------------------------------
   为什么以“宽度”为准：
     页面的横向结构（左右两栏、卡片宽度、每行文字的左右分栏）
     全部由窗口宽度决定，所以字号跟着宽度等比缩放，字与卡片
     的视觉比例才在任何窗口下都保持一致。

   基准：窗口宽 1920 → 1.000x
         窗口宽 2550 → 1.328x   （你要求的 1.33x）
         窗口宽 3840 → 2.000x

   纵向不再参与缩放：卡片高度由 100vh 自适应，行与行之间是
   space-between，所以字号固定、窗口变矮时只是行距变小，不会溢出。
   ============================================================ */

(function () {
  'use strict';

  /* 1.0x 对应的窗口宽度 */
  var BASE_WIDTH = 1400;

  /* 安全范围：防止极端窗口把字号拉到离谱 */
  var MIN_SCALE = 0.5;
  var MAX_SCALE = 3.0;

  var root = document.documentElement;

  function computeScale(vw) {
    return Math.min(MAX_SCALE, Math.max(MIN_SCALE, vw / BASE_WIDTH));
  }

  function applyScale() {
    var vw = window.innerWidth;
    if (!vw) return;

    var scale = computeScale(vw);
    if (!isFinite(scale) || scale <= 0) scale = 1;

    root.style.setProperty('--ui-scale', scale);

    /* 供其它脚本（圆点阵列、Intro 对齐）使用 */
    window.__uiScale = scale;
  }

  /* 尽量早执行，避免首帧按 1.0x 渲染造成闪烁 */
  applyScale();

  window.addEventListener('resize', applyScale);
  window.addEventListener('orientationchange', applyScale);

  /* 部分环境下首帧 innerWidth 尚未稳定，再补两次 */
  window.addEventListener('DOMContentLoaded', applyScale);
  window.addEventListener('load', applyScale);

  window.__applyUiScale = applyScale;
})();
