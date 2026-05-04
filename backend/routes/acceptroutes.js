const express = require("express");

const {
    accept
  } = require("../controllers/accept.controller");
const router = express.Router();
router.post("/accept", accept);
// export default router;

module.exports = router;