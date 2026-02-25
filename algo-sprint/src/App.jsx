import { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'

import thinkingRaw from '../source/thinking.md?raw'
import dsRaw from '../source/datastructure.md?raw'
import algoRaw from '../source/algorithm.md?raw'
import comboRaw from '../source/combo.md?raw'
import practiceRaw from '../source/practice.md?raw'
import quizRaw from '../source/quiz.md?raw'
import reviewRaw from '../source/review.md?raw'
import liveRaw from '../source/live_pool.md?raw'

const DAY_SUBTITLES = [
  '解题思维框架',
  '数组 · 双指针 · 滑窗',
  '链表',
  '栈 · 队列 · 堆',
  '二叉树 · BST',
  'DFS · 回溯 · BFS',
  '动态规划',
  '图 · 并查集 · 综合',
]

const DAY_DETAILS = [
  {
    ds: [],
    algo: ['UMPIRE 六步法', '模式识别决策树', '边界清单', 'Go 刷题踩坑'],
    difficulty: '通读',
  },
  {
    ds: ['数组 / 切片 (底层结构·扩容·传参)', '哈希表 map (计数·存在性·映射)'],
    algo: ['相向双指针', '同向双指针 (读写指针)', '滑动窗口 (可变/固定)', '二分查找'],
    difficulty: 'Easy 为主',
  },
  {
    ds: ['单链表 (结构·遍历)', 'dummy 哨兵节点'],
    algo: ['快慢指针 (判环·找中点)', '反转链表 (迭代/递归)', '合并有序链表', '找环入口 (Floyd)'],
    difficulty: 'Easy + Medium',
  },
  {
    ds: ['栈 (slice 模拟)', '队列 / 双端队列', '堆 (container/heap)'],
    algo: ['括号匹配', '单调栈 (下一个更大)', 'BFS 层序', 'TopK / 多路归并'],
    difficulty: 'Easy + Medium',
  },
  {
    ds: ['二叉树 (TreeNode)', '二叉搜索树 BST'],
    algo: ['前/中/后序递归', '层序 BFS', '自顶向下 vs 自底向上', '验证 BST', '最近公共祖先 LCA'],
    difficulty: 'Medium 为主',
  },
  {
    ds: ['图 (邻接表·邻接矩阵)', '带权图'],
    algo: ['回溯模板 (排列/组合/子集)', '剪枝', '网格 DFS', '图 BFS 最短路'],
    difficulty: 'Medium',
  },
  {
    ds: ['一维/二维 dp 数组', '滚动变量'],
    algo: ['DP 五步法', '线性 DP (爬楼梯·打劫)', '双序列 DP (LCS)', '01/完全背包 (零钱兑换)', '空间优化'],
    difficulty: 'Medium',
  },
  {
    ds: ['并查集 (路径压缩+按秩合并)'],
    algo: ['拓扑排序 (Kahn / DFS)', '三色标记判环', '连通分量', '综合题拆解'],
    difficulty: 'Medium + Hard',
  },
]

const DAY_GOALS = [
  '建立统一解题流程（UMPIRE）',
  '打通数组题四件套：双指针/滑窗/二分/哈希',
  '链表操作稳定化：反转、合并、快慢指针',
  '容器选型稳定化：栈/队列/堆',
  '树题稳态：遍历序 + 递归返回值',
  '回溯与图搜索：能写出标准框架',
  'DP 训练：状态定义与转移不再卡壳',
  '综合组装：图 + 并查集 + 拆题能力',
]

const DAY_DONE_STANDARD = [
  '看完框架并能复述 6 步法',
  '自测前 3 题独立完成',
  '链表 3 题独立完成',
  '栈/队列/堆主线题完成',
  '树题递归框架可独立写出',
  '回溯/BFS 至少各独立 1 题',
  'DP 前 3 题独立完成',
  '完成综合题与最终复盘',
]

const QUIZ_REMINDER =
  '> **做完检查清单**：空输入/nil · 单元素 · 全同值 · 溢出 · 复杂度 · 代码简化\n\n---\n\n'

const STEP_GUIDE = {
  thinking: { layer: 'What', text: '先建立解题框架，别急着写代码。' },
  tips: { layer: 'When', text: '先做题面识别，再选套路。' },
  warmup: { layer: 'Warmup', text: '重做昨天错题，先找失分点。' },
  ds: { layer: 'What', text: '只看结构与操作，不求完整解法。' },
  algo: { layer: 'How', text: '照模板把算法写出来并过边界。' },
  combo: { layer: 'When', text: '根据题面信号快速选型。' },
  practice: { layer: 'Do', text: '先独立思考，再看分级提示。' },
  quiz: { layer: 'Check', text: '限时自测，检验今天是否真正掌握。' },
  live: { layer: 'Extra', text: '加练 1-2 题，强化迁移能力。' },
  review: { layer: 'Reflect', text: '记录失误模式，形成明日热身题单。' },
}

function parseSections(raw) {
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

function cleanContent(md) {
  return md
    .split('\n')
    .filter((line) => !line.startsWith('**下一站**'))
    .join('\n')
}

function buildDays() {
  const ds = parseSections(dsRaw)
  const algo = parseSections(algoRaw)
  const combo = parseSections(comboRaw)
  const practice = parseSections(practiceRaw)
  const live = parseSections(liveRaw)
  const quiz = parseSections(quizRaw)
  const review = parseSections(reviewRaw)

  const days = [
    {
      id: 0,
      title: 'Day 0',
      subtitle: DAY_SUBTITLES[0],
      steps: [
        { key: 'thinking', label: '思维框架', content: cleanContent(thinkingRaw) },
        ...(combo.intro
          ? [{ key: 'tips', label: '速查总览', content: combo.intro }]
          : []),
      ],
    },
  ]

  for (let d = 1; d <= 7; d++) {
    const steps = []

    if (d > 1) {
      steps.push({
        key: 'warmup',
        label: '热身',
        content: [
          `## 热身回顾`,
          ``,
          `回顾 **Day ${d - 1}** 的错题，从复盘记录的「明天热身要重做哪道题」中选一道，**不看答案重做一遍**。`,
          ``,
          `> 间隔复习是对抗遗忘曲线最有效的方法。花 15 分钟重做昨天卡住的题，比刷 3 道新题更有效。`,
        ].join('\n'),
      })
    }

    if (ds[d]) steps.push({ key: 'ds', label: '数据结构', content: ds[d] })
    if (algo[d]) steps.push({ key: 'algo', label: '算法', content: algo[d] })
    if (combo[d]) steps.push({ key: 'combo', label: '组合技巧', content: combo[d] })
    if (practice[d]) steps.push({ key: 'practice', label: '例题', content: practice[d] })
    if (quiz[d]) steps.push({ key: 'quiz', label: '自测', content: QUIZ_REMINDER + quiz[d] })
    if (live[d]) steps.push({ key: 'live', label: '加练（实时题池）', content: live[d] })
    if (review[d]) steps.push({ key: 'review', label: '复盘', content: review[d] })

    days.push({ id: d, title: `Day ${d}`, subtitle: DAY_SUBTITLES[d], steps })
  }

  return days
}

function useLocalState(key, initial) {
  const [val, setVal] = useState(() => {
    try {
      const s = localStorage.getItem(key)
      return s !== null ? JSON.parse(s) : initial
    } catch {
      return initial
    }
  })
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(val))
  }, [key, val])
  return [val, setVal]
}

export default function App() {
  const days = useMemo(() => buildDays(), [])
  const [theme, setTheme] = useLocalState('as-theme', 'dark')
  const [dayIdx, setDayIdx] = useLocalState('as-day', 0)
  const [stepIdx, setStepIdx] = useLocalState('as-step', 0)
  const [progress, setProgress] = useLocalState('as-progress', {})
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [toast, setToast] = useState('')
  const contentRef = useRef(null)

  const safeDay = Math.min(dayIdx, days.length - 1)
  const currentDay = days[safeDay]
  const safeStep = Math.min(stepIdx, currentDay.steps.length - 1)
  const currentStep = currentDay.steps[safeStep]
  const stepGuide = STEP_GUIDE[currentStep?.key] || { layer: 'Step', text: '按顺序完成当前步骤。' }

  useEffect(() => {
    contentRef.current?.scrollTo(0, 0)
  }, [safeDay, safeStep])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme === 'light' ? 'light' : 'dark')
  }, [theme])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(''), 1200)
    return () => clearTimeout(t)
  }, [toast])

  const markDone = useCallback(
    (d, s) => setProgress((prev) => ({ ...prev, [`${d}-${s}`]: true })),
    [setProgress],
  )

  const goNext = useCallback(() => {
    markDone(safeDay, safeStep)
    setToast(`已完成：${currentStep?.label || '当前步骤'}`)
    if (safeStep < currentDay.steps.length - 1) {
      setStepIdx(safeStep + 1)
    } else if (safeDay < days.length - 1) {
      // 自动生成下一天热身题单（优先昨天未完成项）
      const undone = currentDay.steps
        .filter((_, idx) => idx !== safeStep && !progress[`${safeDay}-${idx}`])
        .map((s) => `重做「${s.label}」`)
      const fallback = currentDay.steps
        .filter((s) => ['quiz', 'live', 'practice'].includes(s.key))
        .map((s) => `复盘「${s.label}」中的错题`)
      const plan = (undone.length ? undone : fallback).slice(0, 3)
      if (plan.length > 0) {
        localStorage.setItem(`as-warmup-${safeDay + 1}`, JSON.stringify(plan))
      }
      setDayIdx(safeDay + 1)
      setStepIdx(0)
    }
  }, [safeDay, safeStep, currentDay, currentStep, days, markDone, progress, setDayIdx, setStepIdx])

  const goPrev = useCallback(() => {
    if (safeStep > 0) {
      setStepIdx(safeStep - 1)
    } else if (safeDay > 0) {
      const prevDay = days[safeDay - 1]
      setDayIdx(safeDay - 1)
      setStepIdx(prevDay.steps.length - 1)
    }
  }, [safeDay, safeStep, days, setDayIdx, setStepIdx])

  const selectDay = useCallback(
    (idx) => {
      setDayIdx(idx)
      setStepIdx(0)
      setSidebarOpen(false)
    },
    [setDayIdx, setStepIdx],
  )

  const handleReset = useCallback(() => {
    if (window.confirm('确定要重置所有进度吗？')) {
      setProgress({})
      setDayIdx(0)
      setStepIdx(0)
    }
  }, [setProgress, setDayIdx, setStepIdx])

  const dayProgress = (dIdx) => {
    const total = days[dIdx].steps.length
    const done = days[dIdx].steps.filter((_, sIdx) => progress[`${dIdx}-${sIdx}`]).length
    return { total, done }
  }

  const totalDone = Object.keys(progress).length
  const totalSteps = days.reduce((sum, d) => sum + d.steps.length, 0)
  const completionRate = totalSteps ? Math.round((totalDone / totalSteps) * 100) : 0

  const streakDays = useMemo(() => {
    let streak = 0
    for (let i = 1; i < days.length; i++) {
      const p = dayProgress(i)
      if (p.total > 0 && p.done === p.total) streak++
      else break
    }
    return streak
  }, [days, progress])

  const weakestModule = useMemo(() => {
    const moduleMap = {}
    const labelMap = {
      ds: '数据结构',
      algo: '算法',
      combo: '组合技巧',
      practice: '例题',
      quiz: '自测',
      live: '加练',
      review: '复盘',
    }
    for (let d = 1; d < days.length; d++) {
      for (let s = 0; s < days[d].steps.length; s++) {
        const step = days[d].steps[s]
        if (!labelMap[step.key]) continue
        if (!moduleMap[step.key]) moduleMap[step.key] = { total: 0, done: 0 }
        moduleMap[step.key].total++
        if (progress[`${d}-${s}`]) moduleMap[step.key].done++
      }
    }
    let pick = { key: 'algo', score: 1 }
    for (const [k, v] of Object.entries(moduleMap)) {
      const ratio = v.total ? v.done / v.total : 1
      if (ratio < pick.score) pick = { key: k, score: ratio }
    }
    return labelMap[pick.key] || '算法'
  }, [days, progress])

  const isFirst = safeDay === 0 && safeStep === 0
  const isLast = safeDay === days.length - 1 && safeStep === currentDay.steps.length - 1

  return (
    <div className="app">
      <button
        className="menu-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="菜单"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 5h14M3 10h14M3 15h14" />
        </svg>
      </button>

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h1>算法 7 日速通</h1>
          <div className="overall-progress">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${totalSteps ? (totalDone / totalSteps) * 100 : 0}%` }}
              />
            </div>
            <span className="progress-text">{totalDone}/{totalSteps} 步</span>
          </div>
          <div className="dashboard-mini">
            <div className="mini-card">
              <span className="mini-k">完成率</span>
              <strong>{completionRate}%</strong>
            </div>
            <div className="mini-card">
              <span className="mini-k">连续天数</span>
              <strong>{streakDays} 天</strong>
            </div>
            <div className="mini-card">
              <span className="mini-k">薄弱模块</span>
              <strong>{weakestModule}</strong>
            </div>
          </div>
        </div>

        <nav className="day-list">
          {days.map((day, idx) => {
            const p = dayProgress(idx)
            const isActive = idx === safeDay
            const isDone = p.done === p.total && p.total > 0
            const detail = DAY_DETAILS[idx]
            return (
              <div key={day.id} className={`day-block ${isActive ? 'active' : ''}`}>
                <button
                  className={`day-item ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}
                  onClick={() => selectDay(idx)}
                >
                  <span className={`day-dot ${isDone ? 'done' : isActive ? 'active' : ''}`} />
                  <div className="day-info">
                    <span className="day-title">{day.title}</span>
                    <span className="day-sub">{day.subtitle}</span>
                  </div>
                  <span className="day-count">
                    {p.done}/{p.total}
                  </span>
                </button>
                {isActive && detail && (
                  <div className="day-detail">
                    {detail.difficulty && (
                      <span className="day-diff">{detail.difficulty}</span>
                    )}
                    {idx > 0 && (
                      <div className="today-card">
                        <span className="today-title">今日目标</span>
                        <p>{DAY_GOALS[idx]}</p>
                        <span className="today-title">完成标准</span>
                        <p>{DAY_DONE_STANDARD[idx]}</p>
                      </div>
                    )}
                    {detail.ds.length > 0 && (
                      <div className="day-detail-group">
                        <span className="day-detail-label">数据结构</span>
                        <div className="day-detail-tags">
                          {detail.ds.map((t) => <span key={t} className="tag tag-ds">{t}</span>)}
                        </div>
                      </div>
                    )}
                    {detail.algo.length > 0 && (
                      <div className="day-detail-group">
                        <span className="day-detail-label">算法思想</span>
                        <div className="day-detail-tags">
                          {detail.algo.map((t) => <span key={t} className="tag tag-algo">{t}</span>)}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        <div className="sidebar-footer">
          <button
            className={`theme-switcher ${theme === 'light' ? 'light' : 'dark'}`}
            onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
            aria-label="切换主题"
            title="切换主题"
          >
            <span className="theme-switcher-bg">
              <span className="theme-switcher-indicator" />
              <span className="theme-switcher-option" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3c-.02.2-.03.41-.03.62A9 9 0 0 0 21 12.79z" />
                </svg>
              </span>
              <span className="theme-switcher-option" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                </svg>
              </span>
            </span>
          </button>
          <button className="reset-btn" onClick={handleReset}>
            重置进度
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)} />}

      <main className="main">
        <div className="step-bar">
          <div className="step-bar-inner">
            {currentDay.steps.map((step, idx) => {
              const isDone = progress[`${safeDay}-${idx}`]
              const isActive = idx === safeStep
              return (
                <button
                  key={step.key}
                  className={`step-tab ${isActive ? 'active' : ''} ${isDone && !isActive ? 'done' : ''}`}
                  onClick={() => setStepIdx(idx)}
                >
                  {isDone && !isActive && (
                    <svg className="check-icon" width="12" height="12" viewBox="0 0 12 12">
                      <path d="M2 6l3 3 5-5" fill="none" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  )}
                  {step.label}
                </button>
              )
            })}
          </div>
          <div className="step-guide-line">
            <span className="guide-chip">{stepGuide.layer}</span>
            <span className="guide-text">{stepGuide.text}</span>
          </div>
        </div>

        <div className="content" ref={contentRef}>
          {currentStep?.key === 'review' ? (
            <ReviewContent dayId={safeDay} markdown={currentStep.content} />
          ) : currentStep?.key === 'warmup' ? (
            <WarmupContent dayId={safeDay} markdown={currentStep.content} />
          ) : (
            <Markdown content={currentStep?.content || ''} />
          )}
        </div>

        <div className="nav-bar">
          <button className="nav-btn" onClick={goPrev} disabled={isFirst}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 3L5 8l5 5" />
            </svg>
            上一步
          </button>

          <span className="nav-pos">
            {currentDay.title} / {currentStep?.label}
            <span className="nav-frac">
              {safeStep + 1} / {currentDay.steps.length}
            </span>
          </span>

          <button
            className={`nav-btn nav-next ${isLast ? '' : ''}`}
            onClick={goNext}
            disabled={isLast}
          >
            {safeStep === currentDay.steps.length - 1 ? '进入下一天' : '下一步'}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 3l5 5-5 5" />
            </svg>
          </button>
        </div>
      </main>
      {toast && <div className="done-toast">{toast}</div>}
    </div>
  )
}

function Markdown({ content }) {
  return (
    <div className="md">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
        {content}
      </ReactMarkdown>
    </div>
  )
}

function ReviewContent({ dayId, markdown }) {
  const key = `as-review-${dayId}`
  const [notes, setNotes] = useState(() => localStorage.getItem(key) || '')

  useEffect(() => {
    localStorage.setItem(key, notes)
  }, [key, notes])

  return (
    <div className="md">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
        {markdown}
      </ReactMarkdown>
      <div className="review-box">
        <h3>我的复盘笔记</h3>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="在这里记录今天的复盘：掌握了什么、卡在哪、漏了什么边界..."
          rows={8}
        />
      </div>
    </div>
  )
}

function WarmupContent({ dayId, markdown }) {
  const key = `as-warmup-${dayId}`
  const [plan, setPlan] = useState([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key)
      const arr = raw ? JSON.parse(raw) : []
      setPlan(Array.isArray(arr) ? arr : [])
    } catch {
      setPlan([])
    }
  }, [key])

  return (
    <div className="md">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
        {markdown}
      </ReactMarkdown>
      <div className="review-box">
        <h3>系统推荐热身题单</h3>
        {plan.length > 0 ? (
          <ul>
            {plan.map((item) => <li key={item}>{item}</li>)}
          </ul>
        ) : (
          <p>今天暂无自动题单：默认重做昨天「自测」里最卡的一题。</p>
        )}
      </div>
    </div>
  )
}
