var express = require('express');
const { check, validationResult} = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const auth = require("../middleware/auth")
const authRedirect = require("../middleware/authRedirect")

const User = require("../models/user");
const History = require("../models/history");


router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/dashboard', function(req, res, next) {

    res.render('dashboard', { title: 'Express' });

});

router.post('/dashboardAuth', authRedirect, function(req, res, next) {
  if (req.user) {
    res.redirect("/dashboard");
  } else {
    res.redirect("/login");
  }
})

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Express' });

});

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Express' });

});

router.get('/course/:lab/:module', function(req, res, next) {
  res.render('course', { labName: req.params.lab, labModule: req.params.module});
});

router.post("/course/visit", async function(req, res, next) {
  const {email, labNumber, moduleNumber} = req.body;
  try {
    let history = await History.findOne({
        email
    });
    if (!history) {
      history = new History({
        email: email
    });
    }
    let labKey = "lab" + (parseInt(labNumber)+1);
    history[labKey] = parseInt(history[labKey]) | Math.pow(2, parseInt(moduleNumber)+1)
    history.mostRecent = (parseInt(labNumber)+1) + "," + (parseInt(moduleNumber)+1);
    await history.save();
    res.status(200).json({status:"success"})
  }
  catch (error) {
    res.status(500).send("Error in Saving");
  }
})

router.post("/course/visited", async function(req, res, next) {
  const {email} = req.body;
  console.log("EMAIL: ", email)
  try {
    let history = await History.findOne({
        email
    });
    if (!history) {
      history = new History({
        email: email
      });
    } 
    res.json(history)
  }
  catch (error) {
    res.status(500).send("Error");
  }
})

router.post(
    "/registerCheck",
    [
        check("username", "Please Enter a Valid Username").exists(),
        check("email", "Please enter a valid email").isEmail(),
        check("password", "Please enter a valid password").isLength({
            min: 6
        })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const {
            username,
            email,
            password
        } = req.body;
        try {
            let user = await User.findOne({
                email
            });
            if (user) {
                return res.status(400).json({
                    msg: "User Already Exists"
                });
            }

            user = new User({
                username,
                email,
                password
            });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();

            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(
                payload,
                "randomString", {
                    expiresIn: 10000
                },
                (err, token) => {
                    if (err) throw err;
                    res.status(200).json({
                        token
                    });
                }
            );
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Error in Saving");
        }
    }
);

router.post(
  "/loginCheck",
  [
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a valid password").isLength({
      min: 6
    })
  ],
  async (req, res) => {
    
    console.log(req.body)
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({
        email: email
      });
      if (!user)
        return res.status(400).json({
          message: "User Not Exist"
        });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({
          message: "Incorrect Password !"
        });

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        "randomString",
        {
          expiresIn: 3600
        },
        (err, token) => {
          if (err) throw err;
          res.cookie("token", token)
          res.status(200).json({
            token
          });
        }
      );
    } catch (e) {
      console.error(e);
      res.status(500).json({
        message: "Server Error"
      });
    }
  }
);

router.post(
  "/updateEmail",
  [
    check("oldEmail", "Please enter a valid email").isEmail(),
    check("newEmail", "Please enter a valid email").isEmail()
  ],
  async (req, res) => {
    
    const errors = validationResult(req);
    console.log(req.body)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    const { oldEmail, newEmail } = req.body;
    console.log(req.body)
    try {
      const userWithNewEmail = await User.findOne({
        email: newEmail
      });
      console.log("USER: ", userWithNewEmail)
      if (userWithNewEmail) {
        return res.status(400).json({
          message: "User Already Exists"
        });
      }
      const user = await User.findOne({email: oldEmail});
      user.email = newEmail;
      await user.save();
      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        "randomString",
        {
          expiresIn: 3600
        },
        (err, token) => {
          if (err) throw err;
          res.cookie("token", token)
          res.status(200).json({
            token
          });
        }
      );
    } catch (e) {
      console.error(e);
      res.status(500).json({
        message: "Server Error"
      });
    }
  }
);

router.post(
  "/updatePassword",
  [
    check("newPassword", "Please enter a valid email").isLength({
      min: 6
    })
  ],
  async (req, res) => {
    
    const errors = validationResult(req);
    console.log(req.body)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    const { email, newPassword } = req.body;
    console.log(req.body)
    try {
      const user = await User.findOne({
        email
      });
      console.log("USER:!!!!! ",user)

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        "randomString",
        {
          expiresIn: 3600
        },
        (err, token) => {
          if (err) throw err;
          res.cookie("token", token)
          res.status(200).json({
            token
          });
        }
      );
    } catch (e) {
      console.error(e);
      res.status(500).json({
        message: "Server Error"
      });
    }
  }
);

router.get("/me", auth, async (req, res) => {
  try {
    // request.user is getting fetched from Middleware after token authentication
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (e) {
    res.send({ status: "failed" });
  }
});

router.post("/logout", (req, res) => {
  console.log("LOGGING OUT SETTING COOKIE TO EMPTY")
  res.cookie("token", "");
  res.status(200).send();
})
 


module.exports = router;
