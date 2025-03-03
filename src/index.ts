import { existsSync } from "node:fs"
import { createRequire } from "node:module"
import { resolve } from "node:path"

export function loadEcosystemVariables(appName: string, envName = "main", ecosystemFilePath = resolve(process.cwd(), "ecosystem.config.cjs")) {

    if (!existsSync(ecosystemFilePath)) throw new Error("Ecosystem file does not exists")

    const require = createRequire(import.meta.url)
    const ecosystem = require(ecosystemFilePath)

    if (!ecosystem.apps || !Array.isArray(ecosystem.apps)) return

    const envKey = `env_${envName}`
    for (const app of ecosystem.apps) {
        if (!app.name || app.name !== appName || !app[`env_${envName}`] || typeof app[envKey] !== "object") continue

        for (const key of Object.keys(app[envKey])) {
            process.env[key] = app[envKey][key]
        }
    }
}