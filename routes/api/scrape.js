const express = require('express');
const axios = require("axios");
const cheerio = require("cheerio");
const router = express.Router();

router.get("/sports", function(req, res) {
    let postArray = [];
    let resSplit;
    // First, we grab the body of the html with axios
    axios.get("https://instagram.com/yogotti/").then(response => {
      const $ = cheerio.load(response.data);
      let resData = response.data.toString()
      if (resData.includes('"edges":[{"node":{"__typename":"GraphVideo"')) {
        resSplit = resData.split('"edges":[{"node":{"__typename":"GraphVideo",')
      } else if (resData.includes('"edges":[{"node":{"__typename":"GraphImage"')) {
        resSplit = resData.split('"edges":[{"node":{"__typename":"GraphImage",')
      } else { 
        resSplit = resData.split('"edges":[{"node":{"__typename":"GraphSidecar",')
      }
      
      let secondSplit = resSplit[resSplit.length-1]
     
      let thirdSplitData = secondSplit.split('}}]},"edge_saved_media":');
      let thirdSplitArray = thirdSplitData[0]
      let finalArraySplit = thirdSplitArray.split('}},{"node":{"__typename":')

      for (let i = 0 ; i < finalArraySplit.length; i++) {
        if (finalArraySplit[i].includes('"GraphSidecar",')) {
            let newItem = finalArraySplit[i].replace('"GraphSidecar",',"") 
            postArray.push(JSON.parse("{" + newItem + "}"))
        } else if (finalArraySplit[i].includes('"GraphVideo",')) {
            let newItem = finalArraySplit[i].replace('"GraphVideo",',"") 
            postArray.push(JSON.parse("{" + newItem + "}"))
        } else if (finalArraySplit[i].includes('"GraphImage",')) {
            let newItem = finalArraySplit[i].replace('"GraphImage",',"") 
            postArray.push(JSON.parse("{" + newItem + "}"))
        } else {
            postArray.push(JSON.parse("{" + finalArraySplit[i] + "}"));
        }
        
      }
      res.send(postArray)
    })
})

module.exports = router;