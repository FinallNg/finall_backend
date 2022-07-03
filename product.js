var PDFJS = require("pdfjs-dist/legacy/build/pdf.js");;
let password = '09811'


let loadingTask = PDFJS.getDocument({url:"UBA.pdf",password:password})
loadingTask.promise.then((pdf)=>{
    // for(let i=0; i<pdf.numPages;i++){
    //     pdf.getPage(i).then((page)=>{
    //         console.log(page)
    //     })
    // }
    pdf.getPage(2).then((page)=>{
        page.getTextContent().then((content)=>{
            // for(let j=0; j<content.items.length;j++){
            //     // console.log(content.items[j].str.includes('12-Jun-2002'))
            //     if (content.items[j].str.includes('12-Jun-2022')){
            //         console.log(j)
            //         break;
            //     }
            // }
            //Children
            console.log(content.items[125])
            console.log(content.items[126])
            console.log(content.items[127])

        })
    })

})

const conv = require('pdf-to-excel')

try{
    conv.genXlsx('Journal.pdf', 'test.xlsx')
}catch(err){
    console.error(err)
}