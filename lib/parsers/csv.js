
let fastcsv = require('fast-csv');

const fastCsvPromise = (csvPath) => new Promise((resolve, reject) => {
  let csvData = []
  fastcsv
    .fromPath(csvPath, { headers: true })
    .on('data', data => {
      let rowData = {};
      Object.keys(data).map(current_key => {
        rowData[current_key] = data[current_key]
      });
      csvData.push(rowData);
    })
    .on('end', () => resolve(csvData))
    .on('error', () => reject( new Error(`Error while parsing csv file: "${ csvPath }"`)))
})

async function csvToJson(csvFilePath = '') {
  if (!csvFilePath.includes('.csv')) throw new Error('This is not a csv file')
  const json = await fastCsvPromise(csvFilePath)
  console.warn('final parsed: ', json);
  return json
}

module.exports = csvToJson