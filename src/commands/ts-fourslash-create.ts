
import { GluegunToolbox, GluegunCommand } from 'gluegun'
import { join } from 'path'

const create: GluegunCommand = {
  name: 'ts-fourslash-create',
  description: "",
  run: async (toolbox: GluegunToolbox) => {
    const { print, filesystem: fs } = toolbox

    const dir = toolbox.parameters.first ? toolbox.parameters.first : "."
    const folder = join(fs.cwd(), dir)
    
    print.debug(`Looking at ${folder}`)
    // print.info('Welcome to your CLI, looking')

    fs.dir(folder)

  },
}

module.exports = create
