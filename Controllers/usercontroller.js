const User = require('../Models/usermodel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');




exports.userlogin = async (req, res) => {
    const user = await User.findOne({
        name: req.body.name
    })
    if (user == null) {
        return res.status(400).send("not found")
    }
    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            const username = req.body.name;
            const payload = { name: username };

            const accesstoken = jwt.sign(payload, process.env.ACCESS_TOKEN);
            return res.status(200).json({
                message: "login successfully",
                accesstoken: accesstoken
            })

        } else {
            return res.status(400).send("wrong password")
        }

    }
    catch {
        return res.status(500).send({ message: errmsg })
    }

};



exports.login = async (req, res) => {
    const username = req.body.name;
    const payload1 = { name: username };

    const accesstoken = jwt.sign(payload1, process.env.ACCESS_TOKEN);
    res.json({ accesstoken: accesstoken });
};

exports.createuser = async (req, res) => {
    try {
        const hashpassword = await bcrypt.hash(req.body.password, 10)
        const user = new User({
            name: req.body.name,
            id: req.body.id,
            password: hashpassword
        });
        const savedUser = await user.save();
        res.status(201).json(savedUser);

    } catch (error) {
        res.status(400).json({ message: error.errmsg });
    }
};


exports.getuser = async (req, res) => {
    //const user = await User.find();
    const user = await User.find({ name: req.user.name });

    res.json(user);
};


exports.getuserid = async (req, res) => {
    const user = await User.findOne({id:req.params.id});
    res.json(user);
};

exports.deleteuser =  async (req, res) => {
    const deleteuser = await User.findOneAndDelete({
        id: req.params.id
    });

    if (deleteuser) {
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
};