const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const emailManager = require("../../../managers/emailManager");

const resetPassword = async (req, res) => {
  const usersModel = mongoose.model("users");

  const { email, new_password, reset_code } = req.body;

  if (!email) throw "Email is required";
  if (!new_password) throw "Please provide new password";
  if (!reset_code) throw "Reset code is required";
  if (new_password.length < 5)
    throw "Password must be atleast 5 characters long";

  const getUserWithResetCode = await usersModel.findOne({
    email,
    reset_code,
  });

  if (!getUserWithResetCode) throw "Reset code doesn't match";

  const hashedPassword = await bcrypt.hash(new_password, 12);

  await usersModel.updateOne(
    {
      // Key
      email,
    },
    {
      // Fields to update
      password: hashedPassword,
      reset_code: "",
    },
    {
      // Run validators
      runValidators: true,
    }
  );

  await emailManager(
    getUserWithResetCode.email,
    "Your password has been reset successfully!",
    "Your password has been reset successfully!",
    "Password has been reset successfully!"
  );

  res.status(200).json({
    status: "success",
    message: "Password has been reset successfully",
  });
};

module.exports = resetPassword;
