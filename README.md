# 反重力图标库 (Icon Library)

一套自动化、无缝对接的图标发布系统。
**设计师在 Figma 一键上传，开发按需引用，只加载用到的图标！**

> 🔗 [在线图标库浏览](https://lxwee.github.io/icon-library/) ｜ 管理平台支持预览、搜索、一键复制代码

---

## 🌟 核心运行机制

```
Figma 设计稿 ──── 插件一键上传 ──── GitHub 仓库（SVG 源文件）
                                          │
                                    GitHub Actions 自动构建
                                          │
                                    ┌──────┴──────┐
                                    │             │
                              icon-loader.js   icon-bundle.js
                              （按需加载 ✅）    （全量打包）
                                    │
                                    ▼
                        开发项目：只下载实际用到的图标
```

- **`icons/` 目录**：所有图标以独立 SVG 文件存储，按分组管理
- **`icons.json`**：唯一真实数据源，记录 ID、名称、分类
- **`dist/icon-loader.js`**（推荐）：极小的按需加载器，运行时只请求页面实际用到的 SVG
- **`dist/icon-bundle.js`**（旧方案）：全量打包，适合离线或图标数量极少的场景

---

## 👨‍💻 前端接入指南

### 方案 A：按需加载（推荐 ⭐）

只加载页面上实际用到的图标，**零浪费**。

#### 第一步：引入加载器

在项目的 HTML 入口中加入一行：

```html
<script src="https://lxwee.github.io/icon-library/dist/icon-loader.js"></script>
```

> 📦 加载器本身极小（仅含图标索引 + 加载逻辑），不包含任何 SVG 数据。

#### 第二步：使用图标

提供 **三种方式**，任选其一，效果完全一致：

**方式 1：HTML 标签（最简单，推荐）**

```html
<!-- 直接用 <icon-lib> 标签，name 填图标 ID -->
<icon-lib name="folder-color" size="24px"></icon-lib>
<icon-lib name="hierarchy-enterprise-fill-on-color" size="32px"></icon-lib>

<!-- 单色图标可指定颜色，多色图标自动保留原色 -->
<icon-lib name="document-color" size="20px" color="#6366f1"></icon-lib>
```

**方式 2：Data 属性（适合批量渲染）**

```html
<span data-icon="folder-color" data-icon-size="24px"></span>
<span data-icon="audio-color" data-icon-size="20px" data-icon-color="red"></span>
```

**方式 3：JS API（适合动态场景）**

```js
// 加载单个图标
const svgString = await IconLib.load('folder-color');
document.getElementById('myIcon').innerHTML = svgString;

// 判断图标是否存在
IconLib.has('folder-color'); // true
IconLib.has('不存在的图标'); // false

// 获取所有可用图标 ID
const allIds = IconLib.list();

// 批量预加载常用图标（可选，提升首屏速度）
IconLib.preload(['folder-color', 'document-color', 'audio-color']);
```

#### 第三步：在 Vue 中封装组件（可选）

如果你用 Vue，可以封装一个更优雅的组件：

**`IconLib.vue`（Vue 3 版本）：**

```vue
<template>
  <icon-lib :name="name" :size="size" :color="color" />
</template>

<script setup>
defineProps({
  name:  { type: String, required: true },
  size:  { type: String, default: '1em' },
  color: { type: String, default: '' }
})
</script>
```

在 `vite.config.js` 中告诉 Vue 不要把 `<icon-lib>` 当做 Vue 组件解析：

```js
// vite.config.js
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag === 'icon-lib'
        }
      }
    })
  ]
})
```

使用：

```vue
<IconLib name="folder-color" size="24px" />
<IconLib name="hierarchy-enterprise-fill-on-color" size="16px" color="red" />
```

---

### 方案 B：全量打包（旧方案，向下兼容）

> ⚠️ 此方案会一次性下载**所有图标**的 SVG 数据，适合图标总量少或需要离线使用的场景。

```html
<script src="https://lxwee.github.io/icon-library/dist/icon-bundle.js"></script>
```

引入后通过 SVG Sprite 方式引用：

```html
<svg class="icon" aria-hidden="true">
  <use xlink:href="#icon-folder-color"></use>
</svg>
```

---

## 📊 方案对比

| | 方案 A：按需加载 | 方案 B：全量打包 |
|---|---|---|
| 引入文件大小 | 极小（~2KB，仅索引） | 随图标数量增长 |
| 实际下载量 | 只下载用到的图标 | 下载全部图标 |
| 多色图标 | ✅ 原生支持 | ✅ 支持 |
| 离线可用 | 需网络请求 | 一次加载后可用 |
| 新增图标 | 即传即用，无需更新 | 需等待 CI 重新构建 |
| **推荐场景** | **绝大多数项目** | 图标极少或需离线 |

---

## 🔍 如何查找图标 ID

1. 打开 [在线图标库](https://lxwee.github.io/icon-library/)
2. 搜索或浏览找到目标图标
3. 点击图标卡片上的 📋 按钮，**一键复制 ID**
4. 将 ID 粘贴到代码中即可

---

## 🎨 给设计师的操作提醒

**更新已有图标（修正绘制瑕疵）：**
1. 沿用该图标原有的 **唯一识别码**，正常上传
2. 插件检测到 ID 重复时会提示覆盖
3. 确认后，所有引用该图标的项目**自动生效**，无需前端配合

**上传同系列不同形态的图标：**
1. 在英文 ID 上加后缀区分，例如：
   - `arrow-sm`（细版）
   - `arrow-md`（标准版）
   - `arrow-bold`（加粗版）
2. 不同 ID 共存互不影响

---

## 🏗 项目结构

```
icon-library/
├── icons/                  # SVG 源文件（按分组存放）
│   ├── organization/       # 组织架构
│   ├── filetype/           # 文件类型
│   └── ...
├── icons.json              # 图标元数据索引
├── index.html              # 在线浏览管理页面
├── scripts/
│   ├── build.js            # 全量打包构建脚本
│   └── build-loader.js     # 按需加载器构建脚本
├── dist/                   # 构建产物（CI 自动生成）
│   ├── icon-loader.js      # 按需加载器
│   └── icon-bundle.js      # 全量 SVG Sprite
└── .github/workflows/
    └── deploy.yml          # 自动构建 + 部署到 GitHub Pages
```
