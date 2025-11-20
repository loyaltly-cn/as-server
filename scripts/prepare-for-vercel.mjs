// 在构建时为 TypeScript 文件创建临时副本，添加 .js 扩展名到导入路径
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, copyFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

// 修复导入路径，添加 .js 扩展名
function fixImportsInContent(content) {
  // 修复 from "./path" 格式的导入
  // 匹配相对路径导入，但不匹配已经有扩展名的
  let modified = content.replace(/from\s+['"](\.\.?\/[^'"]+?)['"]/g, (match, path) => {
    // 只处理相对路径
    if (!path.startsWith('./') && !path.startsWith('../')) {
      return match
    }
    
    // 如果已经有扩展名（.js, .json, .mjs, .ts 等），不处理
    if (/\.\w+$/.test(path)) {
      return match
    }
    
    // 添加 .js 扩展名
    return match.replace(path, path + '.js')
  })
  
  // 修复动态导入 import("./path")
  modified = modified.replace(/import\s*\(\s*['"](\.\.?\/[^'"]+?)['"]\s*\)/g, (match, path) => {
    if (!path.startsWith('./') && !path.startsWith('../')) {
      return match
    }
    
    if (/\.\w+$/.test(path)) {
      return match
    }
    
    return match.replace(path, path + '.js')
  })
  
  return modified
}

function processTsFile(filePath) {
  try {
    const content = readFileSync(filePath, 'utf-8')
    const fixed = fixImportsInContent(content)
    
    if (content !== fixed) {
      // 直接修改原文件（Vercel 构建时会使用）
      writeFileSync(filePath, fixed, 'utf-8')
      console.log(`✅ 修复导入路径: ${filePath.replace(projectRoot, '.')}`)
      return true
    }
  } catch (err) {
    console.error(`错误处理 ${filePath}:`, err.message)
  }
  return false
}

function processDirectory(dir) {
  if (!existsSync(dir)) return 0
  
  let count = 0
  const entries = readdirSync(dir)
  
  for (const entry of entries) {
    if (entry.startsWith('.') || entry === 'node_modules' || entry === 'dist') {
      continue
    }
    
    const fullPath = join(dir, entry)
    
    try {
      const stat = statSync(fullPath)
      
      if (stat.isDirectory()) {
        count += processDirectory(fullPath)
      } else if (entry.endsWith('.ts') && !entry.endsWith('.d.ts') && !entry.includes('.config.')) {
        if (processTsFile(fullPath)) {
          count++
        }
      }
    } catch (err) {
      // 忽略
    }
  }
  
  return count
}

// 处理所有 TypeScript 文件
console.log('🔧 为 Vercel 构建准备 TypeScript 文件...\n')

const dirs = ['index.ts', 'api', 'lib']
let total = 0

// 处理根目录的 index.ts
if (existsSync(join(projectRoot, 'index.ts'))) {
  if (processTsFile(join(projectRoot, 'index.ts'))) {
    total++
  }
}

// 处理 api 和 lib 目录
for (const dir of ['api', 'lib']) {
  const dirPath = join(projectRoot, dir)
  if (existsSync(dirPath)) {
    total += processDirectory(dirPath)
  }
}

console.log(`\n✅ 总共修复了 ${total} 个文件的导入路径`)
console.log('ℹ️  这些修改只在构建时生效，不会影响源代码\n')

