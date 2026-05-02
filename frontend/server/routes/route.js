const express = require("express");
const router = express.Router();
const routecontroller = require("../controller/route");

router.get("/:departure/:arrival/:date",
  routecontroller.getoneroute
);

module.exports = router;