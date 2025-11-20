import { readdirSync, statSync } from "fs"
import path from "path"
import  { Hono } from "hono"

export async function loadRoutes(app: Hono, baseDir: string, routePrefix = "") {
    const entries = readdirSync(baseDir)
    const importPromises: Promise<void>[] = []

    for (const entry of entries) {
        const fullPath = path.join(baseDir, entry)
        const stat = statSync(fullPath)

        if (stat.isDirectory()) {
            // 文件夹名就是路径前缀
            const newPrefix = `${routePrefix}/${entry}`
            importPromises.push(loadRoutes(app, fullPath, newPrefix))
        } else if (entry.endsWith(".ts")) {
            // 在运行时，需要将 .ts 扩展名替换为 .js
            const importPath = fullPath.replace(/\.ts$/, ".js")
            importPromises.push(
                import(importPath).then((mod) => {
                    if (mod.default) {
                        let mountPath = routePrefix

                        // 如果是 index.ts，就用当前文件夹的路径
                        if (entry !== "index.ts") {
                            mountPath = `${routePrefix}/${entry.replace(/\.ts$/, "")}`
                        }

                        // 把路由挂在到 prefix
                        const subApp = new Hono() // 创建一个子 Hono 应用
                        mod.default(subApp) // 把子路由挂进去
                        app.route(mountPath || "/", subApp)

                        console.log(`✅ Mounted routes from ${fullPath} -> ${mountPath || "/"}`)
                    }
                })
            )
        }
    }

    // 等待所有导入完成
    await Promise.all(importPromises)
}
