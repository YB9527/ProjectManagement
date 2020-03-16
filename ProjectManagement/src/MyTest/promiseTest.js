
const  fs = require('fs')
function ReadFile(path){
  let pro = new Promise( (resolve,reject)=>{
    fs.readFile(path,'utf-8',(err,dataStr)=>{
      if(err) {
        throw reject(err)
      }
      resolve(dataStr)
    });
  });
  return pro;
}

let promise = ReadFile('src/MyTest/1.txt');

promise.then((data) =>{

  console.log(data)
},function (err){
  console.log(err)
})



