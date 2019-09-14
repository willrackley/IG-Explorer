const express = require('express');
const router = express.Router();
const db = require("../../models");


// Matches with "/api/influencers/"
router.get("/", function(req, res) {
  db.Influencer.find().exec(function(error, data) {
    // Log any errors if the server encounters one
    if (error) {
      console.log(error);
    }
    // Otherwise, send the result of this query to the browser
    else {
      res.json(data);
    }
  });
});

router.post("/post", function(req, res) {
  db.Influencer.create(req.body)
  .then(dbUser =>{
    console.log("successfully added")
    res.json(dbUser);
  })
  .catch(err => console.log(err))
});
  
router.put("/deleteinfluencer/:id", function(req,res) {
  console.log(req.params.id)
  db.Influencer.findOneAndRemove({ _id: req.params.id})
  .then(dbModel => res.json(dbModel))
  .catch(err => res.status(422).json(err));
})


module.exports = router;