module.exports = (req, res, next) => {
  // TEMP user injection
  req.user = {
    id: "6985a0ff600e1e111b453749" // SAME as booking.customerId
  };
  next();
};
