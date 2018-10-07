
const fs = require('fs-extra')
const csvParser = require('../lib/parsers/csv')

const TEMP_FOLDER_PATH = '/teleton/tmp'
const institutions = [
  'telmex',
  'telecom',
  'banamex',
  'soriana',
  'fahorro',
  'infinitum',
  'telcel'
]

const parsersMap = [
  {
    fileType: 'csv',
    parser: csvParser
  },
  {
    fileType: 'xls',
    parser: async () => ({ parser: 'xls parser here' })
  }
]


module.exports = ( router ) => {
  
  router.get('/', ctx => {
    ctx.body = 'API - teleton - hack - <kegs@/>'
  })

  router.post('/file', async ctx => {
    const { request } = ctx
    const { files } = request

    const fileNamesKeyMap = Object.entries(files).map(([key, value]) => ([value.name, value]))

    let validFiles= fileNamesKeyMap.filter(([fileName, file]) => {
      return institutions.find(institution => fileName.toLowerCase().includes(institution))
    })

    fs.ensureDirSync(TEMP_FOLDER_PATH)

    const createdFiles = validFiles.map(([fileName, file]) => {
      const { path: tmpPath } = file
      const newPath = `${TEMP_FOLDER_PATH}/${fileName}`
      fs.copySync(tmpPath, newPath)
      return [fileName, newPath]
    })

    const parseDataPromises = createdFiles.map(([fileName, filePath]) => {
      const parserMap = parsersMap.find(parser => fileName.toLowerCase().includes(parser.fileType))
      console.warn('parserMap: ', parserMap);
      if (parserMap) return parserMap.parser(filePath)
      throw ctx.throw(`There is no parser for "${fileName}"`)
    })

    const parsedData = await Promise.all(parseDataPromises)

    return ctx.resolve({payload: parsedData})
  })
}