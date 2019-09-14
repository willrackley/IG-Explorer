const express = require('express');
const axios = require("axios");
const cheerio = require("cheerio");
const router = express.Router();

router.get("/:user", function(req, res) {
    let postArray = [];
    let resSplit;
    let test = [];
    // First, we grab the body of the html with axios
    //${req.params.user}
    axios.get(`https://instagram.com/${req.params.user}/`).then(response => {
      let resData = response.data.toString()
      if (resData.includes('"edges":[{"node":{"__typename":"GraphVideo"')) {
        resSplit = resData.split('"edges":[{"node":{"__typename":"GraphVideo",')
      } else if (resData.includes('"edges":[{"node":{"__typename":"GraphImage"')) {
        resSplit = resData.split('"edges":[{"node":{"__typename":"GraphImage",')
      } else { 
        resSplit = resData.split('"edges":[{"node":{"__typename":"GraphSidecar",')
      }
      //console.log(resSplit)
      let secondSplit = resSplit[resSplit.length-1]
      
     
      let thirdSplitData = secondSplit.split('}}]},"edge_saved_media":');
      let thirdSplitArray = thirdSplitData[0]
      let finalArraySplit = thirdSplitArray.split('}},{"node":{"__typename":');  
      //let secondFinalSplit= finalArraySplit.split('},"edges":[{"node":{"__typename":')
      //console.log(finalArraySplit)
      //console.log(finalArraySplit[0])
      //console.log(finalArraySplit[0].charAt(2511))
      for (let i = 0 ; i < finalArraySplit.length; i++) {
        if (finalArraySplit[i].includes('"GraphSidecar",')) {
            let newItem = finalArraySplit[i].replace('"GraphSidecar",',"") 
            //console.log(newItem)
            let extraSplit = newItem.split('},"edges":[{"node":{"__typename":')
            //console.log(extraSplit)
            //postArray.push(JSON.parse("{" + newItem + "}"))
            //postArray.push(JSON.parse("{" + extraSplit[0] + "}"))
            //postArray.push(JSON.parse("{" + extraSplit[1] + "}"))
            //test.push(extraSplit[0])
            //console.log(extraSplit[0].length)
            if (extraSplit[0].includes('"product_type":"igtv"')){
               console.log('igtv') 
            } else if(extraSplit[1] === undefined) {
                postArray.push(JSON.parse("{" + extraSplit[0] + "}"))
                
            } else {
                postArray.push(JSON.parse("{" + extraSplit[0] + "}"))
                postArray.push(JSON.parse("{" + extraSplit[1] + "}"))
            }
        } else if (finalArraySplit[i].includes('"GraphVideo",')) {
            let newItem = finalArraySplit[i].replace('"GraphVideo",',"") 
            let extraSplit = newItem.split('},"edges":[{"node":{"__typename":')
            //console.log(newItem)
            //console.log(extraSplit)
            //postArray.push(JSON.parse("{" + newItem + "}"))
            //postArray.push(JSON.parse("{" + extraSplit[0] + "}"))
            //console.log(extraSplit[1])
            if (extraSplit[0].includes('"product_type":"igtv"')){
                console.log('igtv')
            } else if(extraSplit[1] === undefined) {
                postArray.push(JSON.parse("{" + extraSplit[0] + "}"))
                
            } else {
                postArray.push(JSON.parse("{" + extraSplit[0] + "}"))
                postArray.push(JSON.parse("{" + extraSplit[1] + "}"))
            }
        } else if (finalArraySplit[i].includes('"GraphImage",')) {
            let newItem = finalArraySplit[i].replace('"GraphImage",',"") 
            let extraSplit = newItem.split('},"edges":[{"node":{"__typename":')
            //console.log(newItem)
            //console.log(extraSplit)
            //postArray.push(JSON.parse("{" + newItem + "}"))
            //postArray.push(JSON.parse("{" + extraSplit[0] + "}"))
            //console.log(extraSplit[1])
            if (extraSplit[0].includes('"product_type":"igtv"')){
                console.log('igtv')
            } else if(extraSplit[1] === undefined) {
                postArray.push(JSON.parse("{" + extraSplit[0] + "}"))
                
            } else {
                postArray.push(JSON.parse("{" + extraSplit[0] + "}"))
                postArray.push(JSON.parse("{" + extraSplit[1] + "}"))
            }
        } else {
            postArray.push(JSON.parse("{" + finalArraySplit[i] + "}"));
        }
        //console.log(finalArraySplit[i])
      }

     //console.log(postArray)
    res.json(postArray)
    })
    .catch(err => res.json('error'))
})

module.exports = router;