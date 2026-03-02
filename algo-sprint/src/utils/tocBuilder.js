/**
 * TOC 构建工具 - 从 App.jsx 提取的解析逻辑
 * 用于在模块加载时预计算目录树，避免渲染时计算
 */

/** 清理内容：移除「下一站」行 */
export function cleanContent(md) {
  return md
    .split('\n')
    .filter((line) => !line.startsWith('**下一站**'))
    .join('\n')
}

/** 按 ## Day N 分割 markdown，返回 { intro?, 1?, 2?, ... } */
export function parseSections(raw) {
  const sections = {}
  const parts = raw.split(/(?=^## Day \d)/m)
  for (const part of parts) {
    const m = part.match(/^## Day (\d+)/)
    if (m) {
      sections[parseInt(m[1])] = cleanContent(part.trim())
    } else if (part.trim()) {
      sections.intro = cleanContent(part.trim())
    }
  }
  return sections
}

/** 从 markdown 中解析标题（排除代码块、引用块内的假标题） */
export function parseHeadingsFromMarkdown(content) {
  const headings = []
  const lines = content.split('\n')
  let inCodeBlock = false
  let codeFence = null
  let idx = 0

  for (const line of lines) {
    const fenceMatch = line.match(/^(`{3,}|~{3,})/)
    if (fenceMatch) {
      if (!inCodeBlock) {
        inCodeBlock = true
        codeFence = fenceMatch[1]
      } else if (line.startsWith(codeFence)) {
        inCodeBlock = false
      }
      continue
    }
    if (inCodeBlock) continue
    if (line.startsWith('>')) continue

    const m = line.match(/^(#{1,6})\s+(.+)$/)
    if (m) {
      const level = m[1].length
      const text = m[2].replace(/\*\*(.+?)\*\*/g, '$1').replace(/`(.+?)`/g, '$1').trim()
      headings.push({ id: `toc-${idx++}`, text, level })
    }
  }
  return headings
}

/** 将扁平标题列表构建为树形结构 */
export function buildHeadingTree(headings) {
  if (headings.length === 0) return []
  const tree = []
  const stack = [{ children: tree, level: 0 }]
  for (const h of headings) {
    while (stack.length > 1 && stack[stack.length - 1].level >= h.level) {
      stack.pop()
    }
    const node = { id: h.id, text: h.text, level: h.level, children: [] }
    stack[stack.length - 1].children.push(node)
    if (h.level >= 2) stack.push(node)
  }
  return tree
}

/** 从内容构建 TOC 树：parseHeadingsFromMarkdown + buildHeadingTree */
export function contentToTree(content) {
  return buildHeadingTree(parseHeadingsFromMarkdown(content || ''))
}
