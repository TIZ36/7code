import { generateNavigationConfig } from './src/utils/markdownParser.js'
import { readFileSync } from 'fs'

const dsRaw = readFileSync('./source/datastructure.md', 'utf-8')
const algoRaw = readFileSync('./source/algorithm.md', 'utf-8')

const config = generateNavigationConfig({ ds: dsRaw, algo: algoRaw })

console.log('=== Generated Navigation Config ===\n')
console.log('SUBTITLES:')
config.subtitles.forEach((sub, idx) => {
  console.log(`  Day ${idx}: ${sub}`)
})

console.log('\nDETAILS:')
config.details.forEach((detail, idx) => {
  console.log(`\nDay ${idx}:`)
  console.log(`  DS: [${detail.ds.join(', ')}]`)
  console.log(`  Algo: [${detail.algo.join(', ')}]`)
  console.log(`  Difficulty: ${detail.difficulty}`)
})
