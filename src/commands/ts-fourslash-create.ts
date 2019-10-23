import { GluegunToolbox, GluegunCommand } from 'gluegun'
import { join } from 'path'
import * as commonPath from 'common-path'
import * as ts from '@orta/language-services'

const create: GluegunCommand = {
  name: 'ts-fourslash-create',
  description: `Converts a repro folder for a TS bug into a fourslash test.

Usage: npx ts-fourslash-create [optional path to folder]
  `,
  run: async (toolbox: GluegunToolbox) => {
    const { filesystem: fs } = toolbox

    const dir = toolbox.parameters.first ? toolbox.parameters.first : '.'
    const folder = join(fs.cwd(), dir)

    const addFiles = (paths: string[], prefix: string) => {
      let subpaths = []
      paths.forEach(p => {
        const path = join(prefix, p)
        if (fs.isDirectory(path)) {
          subpaths = [...subpaths, ...addFiles(fs.list(path), path)]
        } else {
          subpaths.push(fs.path(join(prefix, p)))
        }
      })
      return subpaths
    }

    const denyListFiles = (files: string[]) => {
      return files.filter(
        f =>
          !f.includes('node_modules/') &&
          !f.includes('yarn.') &&
          !f.includes('.git') && 
          !f.includes('.md') && 
          !f.includes('package-lock') &&
          !f.includes('package.json')
      )
    }

    // Recursively grab all the files in the repro folder
    const rootFiles = fs.list(folder)
    const allFiles = denyListFiles(addFiles(rootFiles, folder))

    const commonPaths = commonPath(allFiles)
    const commonPathsRelativeToCommonRoot = commonPaths.parsedPaths.map(p => join(p.subPart, p.basePart))

    // Try get the tsconfig settings
    let config = {}
    const tsconfig = allFiles.find(p => p.endsWith('tsconfig.json') || p.endsWith("jsconfig.json"))
    if (tsconfig) {
      const foundConfig = JSON.parse(fs.read(tsconfig))
      const foundCompilerSettings = foundConfig.compilerOptions || {}

      // This is a bit meh of a technique, given that the function returns
      // a very simple object
      const defaults = ts.getDefaultCompilerOptions()

      const keys = Object.keys(foundCompilerSettings)
      keys.forEach(compilerKey => {
        if (foundCompilerSettings[compilerKey] !== defaults[compilerKey]) {
          config[compilerKey] = foundCompilerSettings[compilerKey]
        }
      })
    }

    // Make a list of files
    const compilerSettings = Object.keys(config).map(k => `// @${k}: ${config[k]}`)
    const files = commonPathsRelativeToCommonRoot.filter(f => !f.endsWith("tsconfig.json") || !f.endsWith("jsconfig.json")).map(f => {
      const file = fs.read(join(commonPaths.commonDir, f))
      return `// @Filename: ${f}\n////` + file.split("\n").join("\n////")
    })

    // Print the file for you
    const theFile = `/// <reference path="fourslash.ts" />
${compilerSettings.length ? "\n" + compilerSettings.join("\n") + "\n" : ""}
${files.join("\n\n")}
    `
    console.log(theFile)
  }
}

module.exports = create
