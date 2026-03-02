/**
 * Markdown 内容解析工具 - 优化版
 * 只提取主要的数据结构和算法，忽略过于细节的子章节
 */

/**
 * 解析单个 markdown 文件，提取所有标题及其层级
 */
export function parseHeadings(markdown) {
  const lines = markdown.split('\n')
  const headings = []

  lines.forEach((line, index) => {
    const match = line.match(/^(#{1,6})\s+(.+)/)
    if (match) {
      const level = match[1].length
      const text = match[2].trim()
      headings.push({ level, text, line: index + 1 })
    }
  })

  return headings
}

/**
 * 从标题文本中提取 Day 编号
 */
export function extractDayNumber(text) {
  const match = text.match(/Day\s+(\d+)/i)
  return match ? parseInt(match[1], 10) : null
}

/**
 * 从 Day 标题中提取简短描述
 */
export function extractDaySubtitle(text) {
  const match = text.match(/Day\s+\d+[：:]\s*(.+)/)
  return match ? match[1].trim() : text
}

/**
 * 清理标题文本，移除编号、括号说明、链接等
 */
function cleanHeadingText(text) {
  // 去掉编号前缀 "1.1 "
  text = text.replace(/^\d+\.\d+\s+/, '').trim()
  
  // 去掉补充说明（—  或 - 之后的部分）
  text = text.split(/[—\-]/)[0].trim()
  
  // 去掉 Markdown 链接 [text](url)
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
  
  return text
}

/**
 * 判断标题是否应该被包含在导航中
 * 过滤掉过于细节的子章节
 */
function shouldIncludeHeading(text) {
  const lower = text.toLowerCase()
  
  // 排除过于细节的小节
  const excludePatterns = [
    /遍历名称/,
    /常见坑/,
    /常见原地/,
    /为什么/,
    /典型场景/,
    /是什么/,
    /思想$/,
    /实现（/,
    /应用$/,
  ]
  
  for (const pattern of excludePatterns) {
    if (pattern.test(text)) {
      return false
    }
  }
  
  return true
}

/**
 * 手动映射：根据 Day 编号返回精炼的数据结构列表
 */
function getDataStructuresForDay(day) {
  const dsMap = {
    1: ['数组 / 切片 (底层结构·扩容·传参)', '哈希表 map (计数·存在性·映射)', '前缀和数组', 'Trie 字典树'],
    2: ['单链表 (结构·遍历)', 'dummy 哨兵节点'],
    3: ['栈 (slice 模拟)', '队列 / 双端队列', '堆 (container/heap)'],
    4: ['二叉树 (TreeNode)', '二叉搜索树 BST'],
    5: ['图 (邻接表·邻接矩阵)', '带权图'],
    6: ['一维/二维 dp 数组', '滚动变量'],
    7: ['并查集 (路径压缩+按秩合并)']
  }
  
  return dsMap[day] || []
}

/**
 * 手动映射：根据 Day 编号返回精炼的算法列表
 */
function getAlgorithmsForDay(day) {
  const algoMap = {
    1: ['相向双指针', '同向双指针 (读写指针)', '滑动窗口 (可变/固定)', '二分查找', '前缀和 + 哈希'],
    2: ['快慢指针 (判环·找中点)', '反转链表 (迭代/递归)', '合并有序链表', '找环入口 (Floyd)'],
    3: ['括号匹配', '单调栈 (下一个更大)', 'BFS 层序', 'TopK / 多路归并'],
    4: ['前/中/后序递归', '层序 BFS', '自顶向下 vs 自底向上', '验证 BST', '最近公共祖先 LCA'],
    5: ['回溯模板 (排列/组合/子集)', '剪枝', '网格 DFS', '图 BFS 最短路'],
    6: ['DP 五步法', '线性 DP (爬楼梯·打劫)', '双序列 DP (LCS)', '01/完全背包 (零钱兑换)', '空间优化'],
    7: ['拓扑排序 (Kahn / DFS)', '三色标记判环', '连通分量', '贪心算法', '位运算 (XOR·位计数)', '综合题拆解']
  }
  
  return algoMap[day] || []
}

/**
 * 综合解析生成完整的导航配置
 */
export function generateNavigationConfig(markdownFiles) {
  const { ds, algo } = markdownFiles

  const algoHeadings = parseHeadings(algo).filter(h => h.level === 2 && extractDayNumber(h.text))

  // 生成 DAY_SUBTITLES（使用 algo 的 Day 标题）
  const subtitles = [
    '解题思维框架', // Day 0 固定
    ...algoHeadings.slice(0, 7).map(h => extractDaySubtitle(h.text))
  ]

  // 生成 DAY_DETAILS（使用手动映射，确保精炼准确）
  const details = [
    {
      ds: [],
      algo: ['UMPIRE 六步法', '模式识别决策树', '边界清单', 'Go 刷题踩坑'],
      difficulty: '通读',
    }
  ]

  // Day 1-7 的详情
  for (let day = 1; day <= 7; day++) {
    const dsItems = getDataStructuresForDay(day)
    const algoItems = getAlgorithmsForDay(day)
    
    // 根据 Day 推断难度
    let difficulty = 'Medium'
    if (day === 1) difficulty = 'Easy 为主'
    else if (day === 2 || day === 3) difficulty = 'Easy + Medium'
    else if (day === 4 || day === 5 || day === 6) difficulty = 'Medium 为主'
    else if (day === 7) difficulty = 'Medium + Hard'

    details.push({
      ds: dsItems,
      algo: algoItems,
      difficulty
    })
  }

  return {
    subtitles,
    details
  }
}
