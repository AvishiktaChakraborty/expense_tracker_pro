const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwtManager = require("../../../managers/jwtManager");
const emailManager = require("../../../managers/emailManager");

const register = async (req, res) => {
  const usersModel = mongoose.model("users");
  const { email, full_name, password, confirm_password, balance } = req.body;

  // Validations...
  if (!email) throw "Email must be provided";
  if (!full_name) throw "Full name must be provided";
  if (!password) throw "Password must be provided";
  if (password.length < 5) throw "PAssword must be at least 5 characters long.";
  if (password !== confirm_password)
    throw "Password and confirm password does not match!";

  const getDuplicateEmail = await usersModel.findOne({
    email: email,
  });

  if (getDuplicateEmail) throw "This email already exists!";

  const hashedPassword = await bcrypt.hash(password, 12);

  const createdUser = await usersModel.create({
    full_name: full_name,
    email: email,
    password: hashedPassword,
    balance: balance,
  });

  const accessToken = jwtManager(createdUser);
  await emailManager(
    createdUser.email,
    "Welcome to Expense Tracker PRO! We hope you can manage your expenses easily using our platform.",
    "<h1>Welcome to Expense Tracker PRO!</h1><br/><br/>We hope you can manage your expenses easily using our platform.",
    "Welcome to Expense Tracker PRO!"
  );

  res.status(201).json({
    status: "User registered successfully!",
    accessToken: accessToken,
  });
};

module.exports = register;
