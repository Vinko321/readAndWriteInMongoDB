const express = require('express');
const router = express.Router();


// Showing register form
router.get("/", function (req, res) {
    res.render("index");
});


module.exports = router;