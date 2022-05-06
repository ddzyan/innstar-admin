import XLSX from 'xlsx'

function auto_width(ws: XLSX.WorkSheet, data: any[]) {
  /*set worksheet max width per col*/
  const colWidth = data.map((row) =>
    row.map((val: any) => {
      /*if null/undefined*/
      if (val == null) {
        return { wch: 10 }
      } else if (val.toString().charCodeAt(0) > 255) {
        /*if chinese*/
        return { wch: val.toString().length * 2 }
      } else {
        return { wch: val.toString().length }
      }
    }),
  )
  /*start in the first row*/
  const result = colWidth[0]
  for (let i = 1; i < colWidth.length; i++) {
    for (let j = 0; j < colWidth[i].length; j++) {
      if (result[j]['wch'] < colWidth[i][j]['wch']) {
        result[j]['wch'] = colWidth[i][j]['wch']
      }
    }
  }
  ws['!cols'] = result
}

function json_to_array(key: any[], jsonData: any[]) {
  return jsonData.map((v) =>
    key.map((j) => {
      return v[j]
    }),
  )
}

// get head from excel file,return array
function get_header_row(sheet: XLSX.WorkSheet) {
  const headers = []
  const range = XLSX.utils.decode_range(sheet['!ref'] as any)
  let C
  const R = range.s.r /* start in the first row */
  for (C = range.s.c; C <= range.e.c; ++C) {
    /* walk every column in the range */
    const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })] /* find the cell in the first row */
    let hdr = 'UNKNOWN ' + C // <-- replace with your desired default
    if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
    headers.push(hdr)
  }
  return headers
}

export const export_array_to_excel = (arrs: any[] = [], name = '-') => {
  const wb = XLSX.utils.book_new()
  arrs.forEach((item) => {
    const { key, data, title, filename, autoWidth } = item
    const _data = (data as any).map((item: { [x: string]: any }) => {
      Object.keys(item).forEach((key) => {
        item[key] = String(item[key])
      })
      return item
    })
    const arr = json_to_array(key, _data)
    arr.unshift(title)
    const ws = XLSX.utils.aoa_to_sheet(arr)
    if (autoWidth) {
      auto_width(ws, arr)
    }
    XLSX.utils.book_append_sheet(wb, ws, filename)
    if (name === '-' && filename) {
      name = filename
    }
  })
  XLSX.writeFile(wb, name + '.xlsx')
}

export const read = (data: any, type: any) => {
  const workbook = XLSX.read(data, { type: type })
  const firstSheetName = workbook.SheetNames[0]
  const worksheet = workbook.Sheets[firstSheetName]
  const header = get_header_row(worksheet)
  const results = XLSX.utils.sheet_to_json(worksheet)
  return { header, results }
}

export default {
  export_array_to_excel,
  read,
}
