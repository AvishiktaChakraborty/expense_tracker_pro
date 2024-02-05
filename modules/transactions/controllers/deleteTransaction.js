const mongoose = require("mongoose");
const validator = require("validator");

const deleteTransaction = async (req, res) => {
  const transactionModel = mongoose.model("transactions");
  const userModel = mongoose.model("users");

  const { transaction_id } = req.params;

  if (!validator.isMongoId(transaction_id.toString()))
    throw "Please provide a valid Transaction Id";

  const getTransaction = await transactionModel.findOne({
    _id: transaction_id,
  });

  if (!getTransaction) throw "No such Transaction found";

  if (getTransaction.transaction_type === "income") {
    await userModel.updateOne(
      {
        _id: getTransaction.user_id,
      },
      {
        $inc: {
          balance: getTransaction.amount * -1,
        },
      },
      {
        runValidators: true,
      }
    );
  } else {
    await userModel.updateOne(
      {
        _id: getTransaction.user_id,
      },
      {
        $inc: {
          balance: getTransaction.amount,
        },
      },
      {
        runValidators: true,
      }
    );
  }

  await transactionModel.deleteOne({
    _id: transaction_id,
  });

  res.status(200).json({
    status: "Success",
    message: "Transaction deleted successfully!",
  });
};

module.exports = deleteTransaction;
