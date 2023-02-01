const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;

var jwt = require("jsonwebtoken");
var crypto = require("crypto");
const request = require("request");

exports.signup = async(req, res) => {
  try {
    const param = req.body;
    if (
      !param.firstName ||
      !param.lastName ||
      !param.email ||
      !param.password
    ) {
      throw new Error("Require Parameter Missing!");
    }
    const userDetail = await User.findOne({
      email: param.email,
    }).lean();
    if (userDetail) {
      throw new Error('Email already exist!');
    }
    const user = new User({
      firstName: param.firstName,
      lastName: param.lastName,
      email: param.email,
      password: crypto.createHash("md5").update(param.password).digest("hex"),
    });
    user.save((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      return res
        .status(200)
        .send({ message: "User registration successfully!" });
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.signin = (req, res) => {
  const param = req.body;
  User.findOne({
    email: param.email,
  }).exec((err, user) => {
    try {
      if (!user) {
        throw new Error("User Not found");
      }
      if (
        user.password !=
        crypto.createHash("md5").update(param.password).digest("hex")
      ) {
        throw new Error("Invalid Password!");
      }
      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: "1w",
      });
      res.status(200).send({
        id: user._id,
        password: user.password,
        email: user.email,
        token,
      });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });
};

exports.viewUser = (req, res) => {
  User.findOne({
    _id: req.body.id,
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (!user) {
      return res.status(401).send({ message: "user not out!" });
    }
    res.status(200).send({
      user,
    });
  });
};

exports.randomJoke = async (req, res) => {
  await request(
    "https://api.chucknorris.io/jokes/random",
    {
      headers: { accept: "Application/Json" },
    },
    function (error, response, body) {
      console.log({ response });
      res.status(200).send(JSON.parse(body));
    }
  );
};

exports.randomJoke = async (req, res) => {
  await request(
    "https://api.chucknorris.io/jokes/random",
    {
      headers: { accept: "Application/Json" },
    },
    function (error, response, body) {
      res.status(200).send(JSON.parse(body));
    }
  );
};

exports.randomJokeByCategories = async (req, res) => {
  await request(
    `https://api.chucknorris.io/jokes/categories`,
    {
      headers: { accept: "Application/Json" },
    },
    function (error, response, body) {
      res.status(200).send(JSON.parse(body));
    }
  );
};

exports.randomJokeByCategory = async (req, res) => {
  const category = req.body.category;
  await request(
    `https://api.chucknorris.io/jokes/random?category=${category}`,
    {
      headers: { accept: "Application/Json" },
    },
    function (error, response, body) {
      res.status(200).send(JSON.parse(body));
    }
  );
};

exports.signout = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    jwt.sign(authHeader, "", { expiresIn: 1 }, (logout, err) => {
      if (logout) {
        res.send({ msg: "You have been Logged Out" });
      } else {
        res.send({ msg: "Error" });
      }
    });
  } catch (err) {
    this.next(err);
  }
};
