const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user.js");

usersRouter.get("/", async (request, response, next) => {
  try {
    const users = await User.find({}).populate("blogs", "-user");
    response.json(users);
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/:id", async (request, response, next) => {
  try {
    const user = await User.findById(request.params.id).populate(
      "blogs",
      "-user",
    );

    if (user) {
      response.json(user);
    } else {
      response.status(404).end();
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.post("/", async (request, response, next) => {
  try {
    const { username, name, password } = request.body;

    if (!username || username.trim().length < 3) {
      return response
        .status(400)
        .json({ error: "Username must be at least 3 chars long" });
    }

    if (!password || password.trim().length < 3) {
      return response
        .status(400)
        .json({ error: "Password must be at least 3 chars long" });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      username,
      name,
      passwordHash,
    });

    const savedUser = await newUser.save();
    response.status(201).json(savedUser);
  } catch (error) {
    next(error);
  }
});

module.exports = usersRouter;
