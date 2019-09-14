const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require("../../models");
const passport = require('passport'), LocalStrategy = require('passport-local').Strategy;
const jwtSecret = require("../../config/jwtConfig");
const jwt = require("jsonwebtoken");

router.get("/", function(req, res) {
    db.User
      .find(req.query)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
})

router.post("/signup", function(req, res) {
    let {
        email,
        password,
        password2,
        favorites,
        inflencers,
        admin
        } = req.body;
    let messages = [];

    if (password !== password2) {
        messages.push({
          msg: 'Passwords do not match',
          type: 'warning',
          for: "confirm password"
        });
      }
      // If statemant to check passwords lenght
      if (password.length < 6) {
        messages.push({
          msg: 'Password must be at least 6 characters',
          type: 'warning',
          for: "password"
        });
      }
      // If we have errors return them to form
      if (messages.length > 0) {
        return res.json(messages);
        // If we don't have errors continue
      } else {

        email = email.toLowerCase();
        // Hash users password
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(password, salt);

        db.User.find({
            email: email
            },function (err, data) {
            if (data.length !== 0) {
                messages.push({
                    msg: 'User with this email already exists',
                    type: 'warning',
                    for: "email"
                });
                return res.json(messages);
            } else {

                db.User.create({
                    email: email,
                    password: hash,
                    favorites: favorites,
                    inflencers: inflencers,
                    admin: admin
                })
                .then(dbUser =>{
                    messages.push({
                        msg: 'Account successfully created, you may login.',
                        type: 'success'
                    });
                    return res.json(messages);
                })
                .catch(err => console.log(err))
            }
        })
    }
});

router.post("/signin", function(req, res) {
    passport.authenticate('local', {session: false}, function (error, user, info) {
        if (error) {
          res.status(401).send(error);
        } else if (!user) {
          res.status(401).send(info);
        } else {
         req.login(user, {session: false}, (err) => {
           if (err) {
             res.send(err);
           }
           const payload = {id: user._id}
           const token = jwt.sign(payload, jwtSecret.secret, { expiresIn: 2592000});
           return res.json({ token })
         });
        }
        
      })(req, res)
    },
    // function to call once successfully authenticated
    function (req, res) {
      console.log()
      res.status(200).send("logged in!");
});

router.get("/find" , passport.authenticate('jwt', {session: false}), (req, res) => {
  //sconsole.log(req.user)
  const user = {id: req.user._id, email: req.user.email, favorites: req.user.favorites, influencers: req.user.influencers, admin: req.user.admin}
  res.send(user)
})

router.put("/savePost/:id", function(req,res) {
    let messages = [];
    //console.log(req.body)
    db.User.findOne({ _id: req.params.id, 'favorites.shortcode': req.body.shortcode})
    .then(response => {
      if (response) {
        messages.push("You already saved this post.")
      } else {
        db.User.findOneAndUpdate({ _id: req.params.id} , {$push: { favorites: req.body }})
        .then(dbModel => res.json(dbModel))
        .catch(err => res.status(422).json(err));
      }
      return res.json(messages)
    })
    
})

router.put("/saveGroupedInfluencer/:id", function(req,res) {
  let messages = [];
  console.log(req.body.influencer)
  db.User.findOne({ _id: req.params.id, 'influencers.influencer': req.body.influencer })
  .then(dbResponse => {
    if (dbResponse) {
      messages.push({msg: "You already saved this influencer."})
      return res.json(messages)
     } else {
      db.User.findOneAndUpdate({ _id: req.params.id} , {$push: { influencers: req.body }})
      .then(dbModel => {
        messages.push({msg: "New influencer has been saved"})
        return res.json(messages)
      })
      .catch(err => res.status(422).json(err));
    }
    return;
  })
  //return res.json(messages)
})


router.put("/deleteSavedPost/:id", function(req,res) {
  db.User.findOneAndUpdate({ _id: req.params.id} , {$pull: { favorites: { postId: req.body.postId } }})
  .then(dbModel => res.json(dbModel))
  .catch(err => res.status(422).json(err));
})

router.put("/deleteGroupedInfluencer/:id", function(req,res) {
  console.log(req.body)
  db.User.findOneAndUpdate({ _id: req.params.id} , {$pull: { influencers: { influencer: req.body.influencer } }})
  .then(dbModel => res.json(dbModel))
  .catch(err => res.status(422).json(err));
})

router.get("/logout", function(req, res) {
	req.logout();
	//req.flash('success_msg', 'You are successfully logged out');
	
});





module.exports = router;