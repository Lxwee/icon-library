# 📦 团队图标库

团队统一图标资源管理平台，支持搜索、预览、一键复制代码。

## 📁 目录结构

```
icon-library/
├── index.html          ← 图标展示网站（自动部署）
├── icons.json          ← 图标配置（名称、分组、标签）
├── icons/              ← SVG 图标文件
│   ├── common/         ← 通用图标
│   ├── navigation/     ← 导航图标
│   └── action/         ← 操作图标
└── .github/workflows/  ← 自动部署配置
```

## ✏️ 如何维护（不需要写代码！）

### 添加新图标
1. 在 GitHub 网页打开 `icons/` 对应分组文件夹
2. 点 `Add file` → `Upload files`，拖入 SVG 文件
3. 点 `Commit changes`
4. 编辑 `icons.json`，添加一条记录

### 修改图标分组/名称/标签
直接编辑 `icons.json` 文件，修改对应字段即可。
**不会影响前端引用！** 前端只认 `id` 字段。

### 新建分组
在 `icons.json` 的 `groups` 中添加新分组，然后在 `icons/` 下创建同名文件夹。

## 🔧 前端如何引用

```html
<!-- 直接引用 SVG -->
<img src="https://你的用户名.github.io/icon-library/icons/common/search.svg" width="24">
```

## ⚠️ 注意事项

- **SVG 文件名 = 引用 ID**，确定后不要随意修改
- 显示名称、分组、标签可以随时调整
- 每次提交后，网站会自动更新（约1-2分钟）
