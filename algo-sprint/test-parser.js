import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 手动实现解析器（不依赖 React 环境）
function parseHeadings(markdown) {
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

function extractDayNumber(text) {
  const match = text.match(/Day\s+(\d+)/i)
  return match ? parseInt(match[1], 10) : null
}

function parseDSContent(markdown) {
  const headings = parseHeadings(markdown)
  const result = {}

  const dayHeadings = headings.filter(h => h.level === 2 && extractDayNumber(h.text))

  dayHeadings.forEach((dayHeading, idx) => {
    const dayNum = extractDayNumber(dayHeading.text)
    const nextDayLine = idx < dayHeadings.length - 1 ? dayHeadings[idx + 1].line : Infinity

    const subsections = headings.filter(
      h => h.level === 3 && h.line > dayHeading.line && h.line < nextDayLine
    )

    result[dayNum] = subsections.map(sub => {
      let name = sub.text.replace(/^\d+\.\d+\s+/, '').trim()
      name = name.split(/[—\-]/)[0].trim()
      
      if (name.includes('(') && !name.startsWith('(')) {
        const mainPart = name.split('(')[0].trim()
        const parens = name.match(/\(([^)]+)\)/)?.[1]
        if (parens && parens.length < 30) {
          name = `${mainPart} (${parens})`
        }
      }
      
      return name
    })
  })

  return result
}

function parseAlgoContent(markdown) {
  const headings = parseHeadings(markdown)
  const result = {}

  const dayHeadings = headings.filter(h => h.level === 2 && extractDayNumber(h.text))

  dayHeadings.forEach((dayHeading, idx) => {
    const dayNum = extractDayNumber(dayHeading.text)
    const nextDayLine = idx < dayHeadings.length - 1 ? dayHeadings[idx + 1].line : Infinity

    const subsections = headings.filter(
      h => h.level === 3 && h.line > dayHeading.line && h.line < nextDayLine
    )

    result[dayNum] = subsections.map(sub => {
      let name = sub.text.replace(/^\d+\.\d+\s+/, '').trim()
      name = name.split(/[—\-]/)[0].trim()
      name = name.replace(/\s*\([^)]*\)\s*/g, ' ').trim()
      name = name.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      
      return name
    })
  })

  return result
}

// 读取文件
const dsRaw = readFileSync(join(__dirname, 'source/datastructure.md'), 'utf-8')
const algoRaw = readFileSync(join(__dirname, 'source/algorithm.md'), 'utf-8')

// 解析
const dsContent = parseDSContent(dsRaw)
const algoContent = parseAlgoContent(algoRaw)

console.log('=== 数据结构内容 ===')
for (let day = 1; day <= 7; day++) {
  console.log(`Day ${day}:`, dsContent[day] || [])
}

console.log('\n=== 算法内容 ===')
for (let day = 1; day <= 7; day++) {
  console.log(`Day ${day}:`, algoContent[day] || [])
}
