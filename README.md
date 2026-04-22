# 统一图标资源管理库 (Icon Library)

一套自动化、无缝对接的图标发布系统。
**UI 设计师在 Figma 一键上传/更新，前端零代码修改实时享受最新图标！**

## 🌟 核心运行机制

1. **统一存储**：所有图标作为单独的 SVG 源文件，统一存放在 `icons/` 目录按分组管理。
2. **免填索引**：`icons.json` 作为唯一真实数据源（Single Source of Truth），记录图标中文备注、英文 ID、分类和标签。
3. **前端直通车**：
   - 当 UI 从 Figma 插件推送新图标时，GitHub Actions 会**自动拦截**并在云端触发构建。
   - 所有 SVG 源码会被极限压缩合并成一个独立的文件：`dist/icon-bundle.js`。
   - 前端无需像以往一样去下载压缩包替换，只需要像引入 JS 库一样引入它，全站即自动享有 SVG Sprite 矢量级图标池！
   - 支持单色自由换色，更完美支持 **渐变色/多色彩图标原样渲染**！

---

## 👨‍💻 前端接入指南 (Vue 为例)

### 第一步：在项目中引入核心图标包
由于系统已经打通了全自动编译并发布了 GitHub Pages 分发，你只需在项目的根入口（例如 Vue 的 `public/index.html` 或者入口 JS 顶部）引入最新构建生成的包：

```html
<!-- 直接引入最新打包好的 Sprite JS，会把所有 SVG 隐形注射到 document.body 开头 -->
<script src="https://lxwee.github.io/icon-library/dist/icon-bundle.js"></script>
```
*(提示：为防止网络波动或需要固定版本号，上线时也可将打包好之后的 `dist/icon-bundle.js` 文件直接拷贝到前端工程的公共目录中按普通 JS 引入)*

### 第二步：在 Vue 中封装通用 `<Icon />` 组件
在你的 Vue 工程里（不论 Vue 2 或 Vue 3）封装一个公共组件，一劳永逸。

**`Icon.vue` 组件代码参考（Vue 3 `<script setup>` 版本）：**
```vue
<template>
  <!-- aria-hidden="true" 协助屏幕阅读器跳过矢量图形盲人播报 -->
  <svg 
    class="custom-icon" 
    aria-hidden="true" 
    :style="{ fontSize: size, fill: color }"
  >
    <!-- 这里最核心：通过 #前缀 关联加载好的 bundle 里的指定图标 -->
    <use :xlink:href="'#' + name"></use>
  </svg>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // 从线上平台查到的“唯一识别码”（如 user, search-filled）
  name: {
    type: String,
    required: true
  },
  // 图标尺寸（如 16px, 2em，可选）
  size: {
    type: String,
    default: '1em'
  },
  // 图标颜色（对于线框等单色图标有效，多色图标会保留本体颜色无视此属性）
  color: {
    type: String,
    default: 'currentColor'
  }
})
</script>

<style scoped>
.custom-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  overflow: hidden;
  /* 允许 currentColor 继承外层文字的 color 属性，非常方便随界面主题变色 */
  fill: currentColor;
}
</style>
```

### 第三步：在业务代码中快乐使用
```vue
<!-- 像用普通文字一样使用它！它会自动适配当前外部文本的颜色 -->
<div style="color: red; font-size: 24px;">
  <Icon name="search" /> 请输入搜索内容
</div>

<!-- 指定一个大号多彩版本！ -->
<Icon name="user-color" size="48px" />
```

---

## 🎨 给 UI 设计师的操作提醒

如果你需要**更新重绘一个已有图标（发现画岔了）**：
1. 请直接沿用该图标之前的**【唯一识别码】**，进行正常的一键上传即可！
2. 插件发现库中存在此 ID 会提示你将进行覆盖。
3. 确认覆盖后，无需前端做任何配合干预，项目中的该图标会自动完成变身。

如果你需要**上传不同大小或不同粗糙度的同系列图标共存**：
1. 请给它们的【英文 ID】加上规范的后缀，例如：
   👉 `arrow-sm` (细版本)
   👉 `arrow-md` (标准/中等版本)
   👉 `arrow-bold` (加粗版本)
2. 这样它们的前端调用代码不同，就能在一套网站上顺利共存。
