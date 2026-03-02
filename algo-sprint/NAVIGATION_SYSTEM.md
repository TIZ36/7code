# 动态导航系统

## 概述

本项目实现了**动态导航生成**功能，可以自动从 markdown 文件中提取内容结构，生成侧边栏导航配置。

## 工作原理

### 架构

```
source/*.md (Markdown 源文件)
    ↓
markdownParser.js (解析器)
    ↓
App.jsx (React 组件)
    ↓
用户界面 (侧边栏导航)
```

### 核心文件

1. **`src/utils/markdownParser.js`** - 解析器工具
   - `parseHeadings()` - 提取所有标题及层级
   - `extractDayNumber()` - 从标题中提取 Day 编号
   - `generateNavigationConfig()` - 生成完整导航配置

2. **`src/App.jsx`** - React 应用主文件
   - 导入解析器并调用 `generateNavigationConfig()`
   - 使用生成的配置渲染侧边栏

3. **`source/*.md`** - Markdown 源文件
   - `datastructure.md` - 数据结构教学内容
   - `algorithm.md` - 算法教学内容

### 配置生成逻辑

#### 自动提取部分
- **Day 标题** (`DAY_SUBTITLES`) - 从 `algorithm.md` 的 `## Day X：...` 标题自动提取

#### 手动映射部分
- **数据结构列表** (`DAY_DETAILS.ds`) - 手动维护精炼列表
- **算法列表** (`DAY_DETAILS.algo`) - 手动维护精炼列表
- **难度标签** (`DAY_DETAILS.difficulty`) - 根据 Day 编号自动推断

**为什么混合使用？**
- Day 标题变化少，自动提取可避免手动同步
- 数据结构/算法列表需要精炼表达，手动维护确保简洁准确

## 如何切换动态/静态配置

在 `src/App.jsx` 中修改 `USE_AUTO_GENERATED` 常量：

```javascript
const USE_AUTO_GENERATED = true  // 使用动态生成
const USE_AUTO_GENERATED = false // 使用手动硬编码配置（fallback）
```

## 调试工具

### 1. 测试解析器输出

```bash
node test-parser.js
```

查看从 markdown 中自动提取的原始数据结构/算法列表。

### 2. 查看最终导航配置

```bash
node debug-config.js
```

查看最终生成的 `DAY_SUBTITLES` 和 `DAY_DETAILS` 配置。

### 3. 构建生产版本

```bash
npm run build
```

检查是否有构建错误。

## 如何添加新主题

### 情景：在 Day 1 添加新数据结构"布隆过滤器"

#### 步骤 1：更新 markdown 内容

在 `source/datastructure.md` 的 Day 1 部分添加：

```markdown
### 1.5 布隆过滤器（Bloom Filter）

**什么时候用？**
- 快速判断元素是否可能存在（允许误判）
...
```

#### 步骤 2：更新手动映射（可选）

如果想让新内容出现在导航中，修改 `src/utils/markdownParser.js`：

```javascript
function getDataStructuresForDay(day) {
  const dsMap = {
    1: [
      '数组 / 切片 (底层结构·扩容·传参)', 
      '哈希表 map (计数·存在性·映射)', 
      '前缀和数组', 
      'Trie 字典树',
      '布隆过滤器'  // 新增
    ],
    // ...
  }
  return dsMap[day] || []
}
```

#### 步骤 3：重新构建

```bash
npm run build
npm run dev  # 启动开发服务器查看效果
```

## 注意事项

### Markdown 标题格式要求

- **Day 标题必须是二级标题**：`## Day 1：xxx`
- **子章节必须是三级标题**：`### 1.1 xxx`
- **Day 编号必须连续**：Day 1, 2, 3...（不能跳号）

### 手动映射维护

当 markdown 内容发生以下变化时，需要同步更新 `markdownParser.js` 中的手动映射：

1. 添加/删除核心数据结构或算法
2. 重命名主要章节
3. 调整 Day 的主题分类

**不需要更新的情况：**
- 修改代码示例
- 添加/删除四级及以下标题
- 修改文字描述
- 添加图表说明

## 优势

✅ **内容与导航自动同步** - Day 标题变更时无需手动修改 App.jsx  
✅ **导航简洁准确** - 手动映射确保侧边栏不会过于冗长  
✅ **易于调试** - 提供测试脚本快速验证解析结果  
✅ **Fallback 机制** - 可随时切换回硬编码配置  

## 未来优化

- [ ] 完全自动化：使用启发式规则自动筛选重要章节（去掉手动映射）
- [ ] 配置文件：将手动映射移到独立的 JSON 配置文件
- [ ] 实时预览：开发模式下 markdown 变更时自动重新生成导航
- [ ] 验证工具：检查 markdown 标题格式是否符合规范
