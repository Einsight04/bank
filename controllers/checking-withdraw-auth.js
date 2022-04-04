const {UpdateBalance} = require("../inheritance/inherit");

exports.register = (req, res) => {
    let {withdraw} = req.body;
    (new UpdateBalance("checking", withdraw, req.cookies["UUID"], res)).withdraw();
}