/**
 * 反重力图标库 - 按需加载器 v1.0.0
 * 
 * 自动生成，请勿手动编辑
 * 生成时间: 2026-04-27T09:53:15.687Z
 * 图标总数: 66
 * 
 * 使用方式:
 *   HTML:  <icon-lib name="folder-color" size="24px"></icon-lib>
 *   JS:    IconLib.load('folder-color').then(svg => ...)
 */
;(function() {
  'use strict';

  // ========== 配置 ==========
  // 自动检测 Base URL: 优先使用手动配置，否则根据 script 标签路径推断
  var _baseUrl = '';
  function getBaseUrl() {
    if (_baseUrl) return _baseUrl;
    // 尝试从 script 标签推断
    var scripts = document.querySelectorAll('script[src*="icon-loader"]');
    if (scripts.length > 0) {
      var src = scripts[scripts.length - 1].src;
      _baseUrl = src.substring(0, src.lastIndexOf('/dist/')) + '/icons';
    } else {
      _baseUrl = 'https://lxwee.github.io/icon-library/icons';
    }
    return _baseUrl;
  }

  // ========== 图标 ID → 分组 映射表 ==========
  var ICON_MAP = {"hierarchy-enterprise-fill-on-color":"organization","level-item-fill-on-color":"organization","level-segment-fill-on-color":"organization","level-this-level-fill-on-color":"organization","level-subitem-fill-on-color":"organization","hierarchy-department-fill-on-color":"organization","hierarchy-collaboration-unit-fill-on-color":"organization","level-labor-fill-on-color":"organization","content-item-color":"fenbufenxiang","content-inspection-lot-color":"fenbufenxiang","content-department-color":"fenbufenxiang","content-sublist-color":"fenbufenxiang","content-single-color":"fenbufenxiang","content-covert-project-color":"fenbufenxiang","knowledge-base-color":"filetype","folder-color":"filetype","document-color":"filetype","txt-color":"filetype","documentation-color":"filetype","sheet-color":"filetype","ppt-color":"filetype","model-color":"filetype","draft-document-color":"filetype","pictures-photos-color":"filetype","video-color":"filetype","audio-color":"filetype","compressed-package-color":"filetype","unknown-file-color":"filetype","pdf-color":"filetype","e-book-text-color":"filetype","word-color":"filetype","sheet-1-color":"filetype","online-ppt-color":"filetype","online-form-color":"filetype","notion-color":"filetype","onlyoffice-color":"filetype","mind-map-color":"filetype","template-library-color":"filetype","online-documentation-color":"filetype","qualification-color":"filetype","picture-color":"filetype","drawing-color":"filetype","status-ii-color":"warninglevel","status-ii-1-color":"warninglevel","status-i-color":"warninglevel","status-iv-color":"warninglevel","weather-cloudy-outlined":"weather","weather-sunny-outlined":"weather","weather-cloud-outlined":"weather","weather-rain-outlined":"weather","weather-snow-outlined":"weather","weather-hail-outlined":"weather","weather-fog-outlined":"weather","weather-thunder-outlined":"weather","type-zip-filled":"filetype","type-word-filled":"filetype","type-excel-filled":"filetype","type-img-filled":"filetype","type-audio-filled":"filetype","type-pdf-filled":"filetype","type-model-filled":"filetype","type-code-filled":"filetype","type-unknown-filled":"filetype","type-ppt-filled":"filetype","type-ppt2-filled":"filetype","type-txt-filled":"filetype"};

  // ========== SVG 缓存 ==========
  var cache = {};
  var pending = {};

  /**
   * 按需加载单个图标的 SVG 源码
   * @param {string} id - 图标唯一 ID (如 'folder-color')
   * @returns {Promise<string>} SVG 字符串
   */
  function loadIcon(id) {
    // 命中缓存
    if (cache[id]) return Promise.resolve(cache[id]);
    // 防止重复请求
    if (pending[id]) return pending[id];

    var group = ICON_MAP[id];
    if (!group) {
      console.warn('[IconLib] 未知图标 ID: "' + id + '"，请确认该图标已上传到图标库。');
      return Promise.resolve('');
    }

    var url = getBaseUrl() + '/' + group + '/' + id + '.svg';
    pending[id] = fetch(url)
      .then(function(res) {
        if (!res.ok) throw new Error(res.status);
        return res.text();
      })
      .then(function(svg) {
        cache[id] = svg;
        delete pending[id];
        return svg;
      })
      .catch(function(err) {
        console.warn('[IconLib] 加载失败: "' + id + '"', err);
        delete pending[id];
        return '';
      });

    return pending[id];
  }

  /**
   * 批量预加载图标（可选，用于提前缓存常用图标）
   * @param {string[]} ids - 图标 ID 数组
   * @returns {Promise<void>}
   */
  function preload(ids) {
    return Promise.all(ids.map(loadIcon)).then(function() {});
  }

  // ========== Web Component: <icon-lib> ==========
  if (typeof customElements !== 'undefined' && !customElements.get('icon-lib')) {
    var IconLibElement = (function() {
      function IconLibEl() {
        var el = Reflect.construct(HTMLElement, [], IconLibEl);
        return el;
      }
      IconLibEl.prototype = Object.create(HTMLElement.prototype);
      IconLibEl.prototype.constructor = IconLibEl;
      Object.setPrototypeOf(IconLibEl, HTMLElement);

      IconLibEl.observedAttributes = ['name', 'size', 'color'];

      IconLibEl.prototype.connectedCallback = function() {
        this.style.display = 'inline-flex';
        this.style.alignItems = 'center';
        this.style.justifyContent = 'center';
        this.style.verticalAlign = '-0.15em';
        this.style.lineHeight = '0';
        this._render();
      };

      IconLibEl.prototype.attributeChangedCallback = function() {
        if (this.isConnected) this._render();
      };

      IconLibEl.prototype._render = function() {
        var self = this;
        var name = this.getAttribute('name');
        if (!name) return;

        var size = this.getAttribute('size') || '1em';
        var color = this.getAttribute('color') || '';

        loadIcon(name).then(function(svg) {
          if (!svg || self.getAttribute('name') !== name) return;
          self.innerHTML = svg;
          var svgEl = self.querySelector('svg');
          if (svgEl) {
            svgEl.setAttribute('width', size);
            svgEl.setAttribute('height', size);
            svgEl.style.display = 'block';
            if (color) {
              svgEl.style.color = color;
            }
          }
        });
      };

      return IconLibEl;
    })();

    customElements.define('icon-lib', IconLibElement);
  }

  // ========== 自动扫描 data-icon 属性 ==========
  function scanAndInject() {
    var elements = document.querySelectorAll('[data-icon]');
    elements.forEach(function(el) {
      if (el._iconLoaded) return;
      el._iconLoaded = true;
      var id = el.getAttribute('data-icon');
      var size = el.getAttribute('data-icon-size') || '1em';
      var color = el.getAttribute('data-icon-color') || '';
      loadIcon(id).then(function(svg) {
        if (!svg) return;
        el.innerHTML = svg;
        var svgEl = el.querySelector('svg');
        if (svgEl) {
          svgEl.setAttribute('width', size);
          svgEl.setAttribute('height', size);
          svgEl.style.display = 'inline-block';
          svgEl.style.verticalAlign = '-0.15em';
          if (color) svgEl.style.color = color;
        }
      });
    });
  }

  // DOM ready 后自动扫描一次
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scanAndInject);
  } else {
    scanAndInject();
  }

  // ========== 全局 API ==========
  window.IconLib = {
    /** 按需加载单个图标 */
    load: loadIcon,
    /** 批量预加载 */
    preload: preload,
    /** 判断图标是否存在 */
    has: function(id) { return !!ICON_MAP[id]; },
    /** 获取所有可用图标 ID */
    list: function() { return Object.keys(ICON_MAP); },
    /** 获取图标所属分组 */
    groupOf: function(id) { return ICON_MAP[id] || null; },
    /** 手动触发扫描 data-icon 元素 */
    scan: scanAndInject,
    /** 手动设置 Base URL */
    setBaseUrl: function(url) { _baseUrl = url.replace(/\/$/, ''); },
    /** 当前版本 */
    version: '1.0.0'
  };

})();