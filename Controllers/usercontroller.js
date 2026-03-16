const User = require('../Models/usermodel');
const refreshtokens = require('../Models/refreshtoken')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



function generateaccesstoken(payload){
   return jwt.sign(payload, process.env.ACCESS_TOKEN, {expiresIn : "60s"});
}

//let refreshtokens = [];
exports.getToken = async (req, res) => {
    const refreshtoken = req.body.token;
    console.log("refreshtoken-gettoken>>>",refreshtoken)
    if(refreshtoken == null) return res.sendStatus(401)
    //if(!refreshtokens.includes(refreshtoken)) return res.sendStatus(403)
    const tokenDoc = await refreshtokens.findOne({ token: refreshtoken });
    console.log("tokenDoc>>>>",tokenDoc)

    if (!tokenDoc) return res.sendStatus(403);
    jwt.verify(refreshtoken, process.env.REFRESH_TOKEN, (err, payload) =>{
        if (err) return res.sendStatus (403)
        const accesstoken = generateaccesstoken({name:payload.name})
        console.log({"payloaddddd" :payload, "newaccesstoken":accesstoken})
        return res.json({accessToken : accesstoken})
    })
     
}

exports.userlogin = async (req, res) => {
    const user = await User.findOne({
        name: req.body.name
    })
    if (user == null) {
        return res.status(400).send("not found")
    }
    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            
            const payload = { name: req.body.name };
            console.log("givepayloaddd>>", payload)
            const accesstoken = generateaccesstoken(payload)
            const refreshtoken = jwt.sign(payload, process.env.REFRESH_TOKEN)
            //refreshtokens.push(refreshtoken)
            await refreshtokens.create({
            token: refreshtoken,
            username: payload.name
            });
            return res.status(200).json({
                message: "login successfully",
                accessToken: accesstoken,
                refreshToken : refreshtoken
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
    const payload = { name: username };

    const accesstoken = jwt.sign(payload, process.env.ACCESS_TOKEN);
    res.json({ accesstoken: accesstoken });
};


exports.logout = async (req, res) => {
    await refreshtokens.deleteOne({ token: req.body.token })
    res.sendStatus(204);
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
    const user = await User.find();
    //const user = await User.find({ name: req.user.name });
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