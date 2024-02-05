const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const jwtManager = require("../../../managers/jwtManager");

const login = async (req, res) => {
  const usersModel = mongoose.model("users");
  const { email, password } = req.body;

  const getUser = await usersModel.findOne({
    email: email,
  });

  if (!getUser) throw "User doesn't exist";

  console.log(getUser);

  const comparePassword = await bcrypt.compare(password, getUser.password);

  if (!comparePassword) throw "Invalid Password";

  const accessToken = jwtManager(getUser);

  res.status(200).json({
    status: "Success",
    message: "User logged in successfully!",
    accessToken: accessToken,
  });
  console.error(error);
  res.status(400).json({
    status: "Error",
    message: error.message,
  });
};

module.exports = login;
