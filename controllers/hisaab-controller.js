const { isLoggedIn } = require("../middlewares/auth-middlewares");
const hisaabModel = require("../models/hisaab-model");
const userModel = require("../models/user-model");

module.exports.createHisaabController = async function (req, res) {

    let { title, description, encrypted, shareable, passcode, editpermissions } =
        req.body;
    encrypted = encrypted === "on" ? true : false;
    shareable = shareable === "on" ? true : false;
    editpermissions = editpermissions === "on" ? true : false;


    try {
        let hisaabcreated = await hisaabModel.create({

            title,
            description,
            user: req.user.id,
            passcode,
            encrypted,
            shareable,
            editpermissions

        })
        let user = await userModel.findOne({ email: req.user.email });
        user.hisaab.push(hisaabcreated.id);
        await user.save();
    }
    catch (err) {
        res.send(err.message);
    }
    res.redirect("/profile")
}

module.exports.hisaabPageController = async function (req, res) {
    res.render("create");
}
module.exports.readHisaabController = async function (req, res, next) {
    const id = req.params.id;

    console.log('++==================================')
    

    const hisaab = await hisaabModel.findOne({
        _id: id
    });


    

    if (!hisaab) {
        return res.redirect("/profile")
    }
    if (hisaab.encrypted) {
        return res.render("passcode", { isLoggedIn: true, id,hisaab })
    }
    return res.render("hisaab", { isLoggedIn: true, hisaab });
}

module.exports.deleteHisaabController = async function (req, res, next) {

    const id = req.params.id;
    const hisaab = hisaabModel.findOne({
        _id: id,
        user: req.user.id
    });
    if (!hisaab) {
        return res.redirect("/profile")
    }
    await hisaabModel.deleteOne({
        _id: id
    });
    return res.redirect('/profile')

}
module.exports.editHisaabController = async function (req, res, next) {
    const id = req.params.id;
    const hisaab = await hisaabModel.findById(id);
    if (!hisaab) {
        return res.redirect("/profile")
    }

    return res.render("edit", { isLoggedIn: true, hisaab });
}
module.exports.editHisaabPostController = async function (req, res, next) {

    const id = req.params.id;
    const hisaab = await hisaabModel.findById(id);
    if (!hisaab) {
        return res.redirect("/profile")
    }
    hisaab.title = req.body.title;
    hisaab.description = req.body.description;
    hisaab.shareable = req.body.shareable == 'on' ? true : false;
    hisaab.editpermissions = req.body.editpermissions == 'on' ? true : false;
    hisaab.encrypted = req.body.encrypted == 'on' ? true : false;
    hisaab.passcode = req.body.passcode;

    await hisaab.save();
    return res.redirect("/profile");
}
module.exports.readVerifiedHisaabController = async function (req, res, next) {
    const id = req.params.id;

    const hisaab = await hisaabModel.findOne({ _id: id })

    console.log(hisaab,req.body)

    console.log('============================================')
    
    if (!hisaab) {
        return res.redirect("/profile");
    }
    if (hisaab.passcode !== req.body.passcode) {
        return res.redirect("/profile")
    }
    return res.render("hisaab", { isLoggedIn: true, hisaab })
}


