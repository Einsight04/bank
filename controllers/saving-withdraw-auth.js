const {UpdateBalance} = require("../inheritance/inherit");

exports.register = (req, res) => {
    let {withdraw} = req.body;
    (new UpdateBalance("saving", withdraw, req.cookies["UUID"], res)).withdraw();
}