import axios from "axios";
import cheerio from "cheerio";


export default {
    getMusicPosts: function(name) {
        return axios.get(`https://www.instagram.com/${name}`).then(function(response) {
            const $ = cheerio.load(response.data);

            $("article.FyNDV div.Nnq7C weEfm div.v1Nh3 kIKUG ").each(function(i, element) {
            let result = {};

            result.title = $(element).find("a")
            //.children("div.v1Nh3 kIKUG").find("a");
            console.log(result)
           })
        })
    }
}