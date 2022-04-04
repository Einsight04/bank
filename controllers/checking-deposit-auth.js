const {UpdateBalance} = require("../inheritance/inherit");

exports.register = (req, res) => {
    let {deposit} = req.body;
    (new UpdateBalance("checking", deposit, req.cookies["UUID"], res)).deposit();
}