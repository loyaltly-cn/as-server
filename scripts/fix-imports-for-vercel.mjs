// 这个脚本在 Vercel 构建后运行，自动为所有 .js 文件中的相对路径导入添加 .js 扩展名
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

function fixImportsInFile(filePath) {
  try {
    let content = readFileSync(filePath, 'utf-8')
    let modified = false
    
    // 修复 from "./path" 或 from '../path' 格式的导入
    // 匹配相对路径，但不匹配已经有扩展名的
    const fromImportRegex = /from\s+['"](\.\.?\/[^'"]+?)(?<!\.js)(?<!\.json)(?<!\.mjs)['"]/g
    
    content = content.replace(fromImportRegex, (match, importPath) => {
      // 只处理相对路径
      if (!importPath.startsWith('./') && !importPath.startsWith('../')) {
        return match
      }
      
      // 如果路径没有文件扩展名，添加 .js
      if (!/\.\w+$/.test(importPath)) {
        modified = true
        return `from "${importPath}.js"`
      }
      
      return match
    })
    
    // 修复动态导入 import("./path")
    const dynamicImportRegex = /import\s*\(\s*['"](\.\.?\/[^'"]+?)(?<!\.js)(?<!\.json)(?<!\.mjs)['"]\s*\)/g
    
    content = content.replace(dynamicImportRegex, (match, importPath) => {
      if (!importPath.startsWith('./') && !importPath.startsWith('../')) {
        return match
      }
      
      if (!/\.\w+$/.test(importPath)) {
        modified = true
        return `import("${importPath}.js")`
      }
      
      return match
    })
    
    if (modified) {
      writeFileSync(filePath, content, 'utf-8')
      return true
    }
    
    return false
  } catch (err) {
    console.error(`Error processing ${filePath}:`, err.message)
    return false
  }
}

function processDirectory(dir) {
  if (!existsSync(dir)) {
    return 0
  }
  
  let fixedCount = 0
  
  try {
    const entries = readdirSync(dir)
    
    for (const entry of entries) {
      // 跳过某些目录和文件
      if (entry.startsWith('.') || entry === 'node_modules' || entry === 'prisma') {
        continue
      }
      
      const fullPath = join(dir, entry)
      
      try {
        const stat = statSync(fullPath)
        
        if (stat.isDirectory()) {
          fixedCount += processDirectory(fullPath)
        } else if (entry.endsWith('.js') && !entry.includes('.config.') && !entry.includes('.min.')) {
          if (fixImportsInFile(fullPath)) {
            fixedCount++
            console.log(`✅ Fixed imports in: ${fullPath.replace(projectRoot, '.')}`)
          }
        }
      } catch (err) {
        // 忽略无法访问的文件
      }
    }
  } catch (err) {
    // 目录不存在或无法访问
  }
  
  return fixedCount
}

// Vercel 构建后的文件可能在 .vercel/output 目录
const dirsToCheck = [
  join(projectRoot, '.vercel', 'output'),
  join(projectRoot, 'dist'),
  join(projectRoot, 'api'),
  join(projectRoot, 'lib'),
  projectRoot
]

let totalFixed = 0

for (const dir of dirsToCheck) {
  if (existsSync(dir)) {
    const count = processDirectory(dir)
    totalFixed += count
  }
}

if (totalFixed > 0) {
  console.log(`\n✅ 总共修复了 ${totalFixed} 个文件的导入路径\n`)
} else {
  console.log('ℹ️  没有找到需要修复的文件（这可能是正常的）\n')
}

