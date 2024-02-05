const mongoose = require("mongoose");

const getTransactions = async (req, res) => {
  const transactionsModel = mongoose.model("transactions");

  /*
  Note:

  For querying API:
  http://localhost:8000/api/transactions?transaction_type=expense

  Path: http://localhost:8000/api/transactions
  query: transaction_type=expense

  we are using '?' for querying; is is the query parameter

  By adding ...req.query we are reading the api query

  http://localhost:8000/api/transactions?transaction_type=expense&amount=10

  this returns expense with amount 10
   */
  const transactions = await transactionsModel.find({
    user_id: req.user._id,
    ...req.query,
  });
  res.status(200).json({
    status: "Transactions",
    data: transactions,
  });
};

module.exports = getTransactions;
