const mongoose = require("mongoose");
const validator = require("validator");

const editTransaction = async (req, res) => {
  const transactionModel = mongoose.model("transactions");

  const { transaction_id, transaction_type, amount, remarks } = req.body;

  if (!transaction_id) throw "Transaction Id is required";

  if (!validator.isMongoId(transaction_id.toString()))
    throw "Please provide a valid Transaction Id";

  const getTransaction = await transactionModel.findOne({
    _id: transaction_id,
  });

  if (!getTransaction) throw "No such Transaction found";

  await transactionModel.updateOne(
    {
      _id: transaction_id,
    },
    {
      remarks,
      //   transaction_type,
      //   amount,
    },
    {
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "Transaction editted successfully",
  });
};

module.exports = editTransaction;
