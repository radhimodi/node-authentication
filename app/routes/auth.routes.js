const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/auth.controller");
const { authJwt } = require("../middlewares");


module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.post("/api/auth/signup", controller.signup);
  app.post("/api/auth/signin", controller.signin);
  app.post("/api/auth/signout",[authJwt.verifyToken], controller.signout);
  app.post("/api/user/view",[authJwt.verifyToken], controller.viewUser);
  app.get("/api/random-joke", controller.randomJoke);
  app.post("/api/random-joke-category", controller.randomJokeByCategory);
  app.get("/api/random-joke-categories", controller.randomJokeByCategories);
  
};
