const express = require('express');
const router = express();

const isLoggedIn = require("../middlewares/isLoggedIn");

router.get('/', (req, res) => {
    let error = req.flash("error");
    res.render("intro", { error });
});



module.exports = router;