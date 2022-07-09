// var PDFJS = require("pdfjs-dist/legacy/build/pdf.js");
// const conv = require('pdf-to-excel')
const XLSX = require('xlsx')
const fs = require('fs')
let password = '09811'


// let loadingTask = PDFJS.getDocument({url:"Journal.pdf",password:password})
// try {
//     conv.genXlsx(PDFJS.getDocument({url:"Journal.pdf",password:password}).promise, 'test.xlsx')
//     console.log()
// } catch (error) {
//     console.log(error)
// }
// // loadingTask.promise.then((pdf)=>{
//     // try {
//     //     // conv.genXlsx({data:pdf}, 'test.xlsx')
//     //     console.log()
//     // } catch (error) {
//     //     console.log(error)
//     // }
//     // for(let i=0; i<pdf.numPages;i++){
//     //     pdf.getPage(i).then((page)=>{
//     //         console.log(page)
//     //     })
//     // }
//     // pdf.getPage(1).then((page)=>{
//     //     console.log(page)
//         // page.getTextContent().then((content)=>{
//             // for(let j=0; j<content.items.length;j++){
//             //     // console.log(content.items[j].str.includes('12-Jun-2002'))
//             //     if (content.items[j].str.includes('12-Jun-2022')){
//             //         console.log(j)
//             //         break;
//             //     }
//             // }
//             //Children
//             // console.log(content.items[125])
//             // console.log(content.items[126])
//             // console.log(content.items[127])
//             // console.log(content.items)

//         // })
//     // })

// // })



// // try{
// //     conv.genXlsx('UBA.pdf', 'test.xlsx')
// // }catch(err){
// //     console.error(err)
// // }

var { getDocument } = require("pdfjs-dist/legacy/build/pdf.js");
function _getY(item) {
    // scaleX, scale01, scale10, scaleY, x, y
    if (item && Array.isArray(item.transform)) {
        return item.transform[4] || -1;
    }

    return -1;
}

async function genTextContextMatrix(path, options = {}) {
    const { onProgress, start, end } = options;

    const result = [];
    let numPage = 1;
    let numPages = 0;
    if (typeof start === 'number' && typeof end === 'number' && start < end) {
        numPage = start;
        numPages = end;
    }

    const pdf = await getDocument({url:path,password:password}).promise;
    // set end
    if (typeof pdf.numPages === 'number' && numPages === 0) {
        numPages = pdf.numPages;
    }

    // page increase
    while (numPage <= numPages) {
        if (typeof onProgress === 'function') {
            onProgress({ numPage, numPages });
        }

        // eslint-disable-next-line
        const page = await pdf.getPage(numPage);
        // eslint-disable-next-line
        const text = await page.getTextContent();

        if (Array.isArray(text.items)) {
            const { items } = text;
            const min = _getY(items[0]);
            let tmp = [];

            for (let i = 0; i < items.length; i += 1) {
                const y = _getY(items[i]);
                if (y <= min) {
                    // console.log(`min:${min}-----${y}`)
                    // console.log(items[i],`-----${y}`)
                    result.push(tmp);
                    tmp = [];
                }
                tmp.push(items[i]);
            }
            if (tmp.length) result.push(tmp);

        }

        numPage += 1;
    }

    return result;
}

async function genXlsx(pdfPath, xlsxPath, options) {
    const data = await genTextContextMatrix(pdfPath, options);
  
    const [first = [], ...rest] = data;
    // extract text
    const header = first.map((e) => e.str);
    let test=rest.map((r) => r.map((e) => e.str))
    const ws = XLSX.utils.aoa_to_sheet(rest.map((r) => r.map((e) => e.str)), header);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  
    XLSX.writeFile(wb, xlsxPath);
  }

  genXlsx("UBA.pdf",'test.xlsx',{start:2,end:2})