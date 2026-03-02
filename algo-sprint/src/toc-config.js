/**
 * TOC 预计算配置 - 在模块加载时从 md 源文件构建目录树
 *
 * 结构：
 *   - 无 Day 结构：{ thinking: tree, tips: tree }
 *   - 有 Day 结构：{ warmup: { 2..7: tree }, ds|algo|combo|practice|quiz|live|review: { 1..7: tree } }
 *
 * 集成方式（App.jsx）：
 *   1. import { getTocTree } from './toc-config'
 *   2. 在 Markdown/ReviewContent/WarmupContent 中，用 useEffect 调用：
 *      onHeadingsReady?.(getTocTree(stepKey, dayId))
 *   3. 传入 stepKey={currentStep?.key} dayId={safeDay} 给内容组件
 *   4. 可移除组件内对 parseHeadingsFromMarkdown + buildHeadingTree 的调用
 */

import {
  parseSections,
  cleanContent,
  contentToTree,
} from './utils/tocBuilder.js'

import thinkingRaw from '../source/thinking.md?raw'
import dsRaw from '../source/datastructure.md?raw'
import algoRaw from '../source/algorithm.md?raw'
import comboRaw from '../source/combo.md?raw'
import practiceRaw from '../source/practice.md?raw'
import quizRaw from '../source/quiz.md?raw'
import liveRaw from '../source/live_pool.md?raw'
import reviewRaw from '../source/review.md?raw'

const QUIZ_REMINDER =
  '> **做完检查清单**：空输入/nil · 单元素 · 全同值 · 溢出 · 复杂度 · 代码简化\n\n---\n\n'

function buildWarmupTree(dayId) {
  const content = [
    `## 热身回顾`,
    ``,
    `回顾 **Day ${dayId - 1}** 的错题，从复盘记录的「明天热身要重做哪道题」中选一道，**不看答案重做一遍**。`,
    ``,
    `> 间隔复习是对抗遗忘曲线最有效的方法。花 15 分钟重做昨天卡住的题，比刷 3 道新题更有效。`,
  ].join('\n')
  return contentToTree(content)
}

// 预计算所有 TOC 树（模块加载时执行一次）
const dsSections = parseSections(dsRaw)
const algoSections = parseSections(algoRaw)
const comboSections = parseSections(comboRaw)
const practiceSections = parseSections(practiceRaw)
const quizSections = parseSections(quizRaw)
const liveSections = parseSections(liveRaw)
const reviewSections = parseSections(reviewRaw)

/** TOC 配置：stepKey -> tree 或 stepKey -> { dayId -> tree } */
export const TOC_CONFIG = {
  // Day 0：无 Day 结构的步骤
  thinking: contentToTree(cleanContent(thinkingRaw)),
  tips: comboSections.intro ? contentToTree(comboSections.intro) : [],

  // Day 2-7：warmup 内容由模板生成，结构相同，用 dayId 作为 key 便于按天查找
  warmup: Object.fromEntries(
    [2, 3, 4, 5, 6, 7].map((d) => [d, buildWarmupTree(d)])
  ),

  // Day 1-7：按 Day 分节的步骤
  ds: Object.fromEntries(
    [1, 2, 3, 4, 5, 6, 7]
      .filter((d) => dsSections[d])
      .map((d) => [d, contentToTree(dsSections[d])])
  ),
  algo: Object.fromEntries(
    [1, 2, 3, 4, 5, 6, 7]
      .filter((d) => algoSections[d])
      .map((d) => [d, contentToTree(algoSections[d])])
  ),
  combo: Object.fromEntries(
    [1, 2, 3, 4, 5, 6, 7]
      .filter((d) => comboSections[d])
      .map((d) => [d, contentToTree(comboSections[d])])
  ),
  practice: Object.fromEntries(
    [1, 2, 3, 4, 5, 6, 7]
      .filter((d) => practiceSections[d])
      .map((d) => [d, contentToTree(practiceSections[d])])
  ),
  quiz: Object.fromEntries(
    [1, 2, 3, 4, 5, 6, 7]
      .filter((d) => quizSections[d])
      .map((d) => [d, contentToTree(QUIZ_REMINDER + quizSections[d])])
  ),
  live: Object.fromEntries(
    [1, 2, 3, 4, 5, 6, 7]
      .filter((d) => liveSections[d])
      .map((d) => [d, contentToTree(liveSections[d])])
  ),
  review: Object.fromEntries(
    [1, 2, 3, 4, 5, 6, 7]
      .filter((d) => reviewSections[d])
      .map((d) => [d, contentToTree(reviewSections[d])])
  ),
}

/**
 * 根据 stepKey 和 dayId 获取 TOC 树
 * @param {string} stepKey - thinking | tips | warmup | ds | algo | combo | practice | quiz | live | review
 * @param {number} dayId - 0-7，Day 0 仅用于 thinking/tips
 * @returns {Array} 树形 TOC 节点数组
 */
export function getTocTree(stepKey, dayId) {
  const config = TOC_CONFIG[stepKey]
  if (!config) return []

  // 无 Day 结构的步骤：直接返回 tree
  if (stepKey === 'thinking' || stepKey === 'tips') {
    return Array.isArray(config) ? config : []
  }

  // 有 Day 结构的步骤：按 dayId 查找
  if (typeof config === 'object' && !Array.isArray(config)) {
    return config[dayId] || []
  }

  return []
}
