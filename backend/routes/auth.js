const express = require("express");
const User = require("../modals/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "DVDTisgood$ILU";
var fetchuser = require("../middleware/fetchuser");

router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // console.log(req.body);
    // const user = User(req.body);
    // user.save();

    try {
      //check whether the user with this email exist already
      let user = await User.findOne({ email: req.body.email });
      console.log.user;
      if (user) {
        return res
          .status(400)
          .json({ error: "Sorry a user with this email already exists" });
      }
      const salt = await bcrypt.genSalt(10);
      secPass = await bcrypt.hash(req.body.password, salt);

      //create new user
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email
      });

      const data = {
        user: {
          id: user.id,
        },
      };

      console.log(data);
      // .then(user => res.json(user))
      // .catch(err => {console.log(err)
      // res.json({error: 'Please enter a unique value for email', message: err.message})})
      //     //res.send(req.body);
      //res.json(user)
      const authToken = jwt.sign(data, JWT_SECRET);
      res.json({ authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some Error Accured");
    }
  }
);

// Authentication a User using: POST "/api/auth/login", No login required
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "password cannot be blank").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ error: "Please try to login with correct credentials" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res
          .status(400)
          .json({ error: "please try to login with correct credentials" });
      }

      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);  // to genrate the authToken.
      res.json({ authToken });
    } catch (error) {}
  }
);

// get loggedin User Details using: POST "/api/auth/getUser" login required
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password"); // .select("-password"); this is use to get the complete data except the password and if i want only password then use .select("password").
    // User.findById(userId) this is use to find the user by userId in the db.
    res.send(user); // send response.
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});
module.exports = router;