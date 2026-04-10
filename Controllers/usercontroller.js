const User = require('../Models/usermodel');
const refreshtokens = require('../Models/refreshtoken')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



function generateaccesstoken(payload){
   return jwt.sign(payload, process.env.ACCESS_TOKEN, {expiresIn : "60s"});
}


exports.getToken = async (req, res) => {

    const refreshtoken = req.body.token;

    if (!refreshtoken) return res.sendStatus(401);

    try {

        jwt.verify(
            refreshtoken,
            process.env.REFRESH_TOKEN,
            async (err, payload) => {
                console.log("VERIFY ERROR >>>", err);
                console.log("PAYLOAD >>>", payload);


                if (err) return res.sendStatus(403);

                const tokenDoc = await refreshtokens
                    .findOne({ username: payload.name });

                if (!tokenDoc) return res.sendStatus(403);

                const isMatch = await bcrypt.compare(
                    refreshtoken,
                    tokenDoc.token
                );

                console.log("bcrypt result >>>", isMatch);

                if (!isMatch) return res.sendStatus(403);

                const accesstoken =
                    generateaccesstoken({ name: payload.name, role:payload.role });

                return res.json({ accessToken: accesstoken });
            }

        );

    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

exports.login = async (req, res) => {
    const user = await User.findOne({
        name: req.body.name
    })
    if (user == null) {
        return res.status(400).send("not found")
    }
    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            
            const payload = { name: user.name, role:user.role };
            console.log("givepayloaddd>>", payload)
            const accesstoken = generateaccesstoken(payload)
            const refreshtoken = jwt.sign(payload, process.env.REFRESH_TOKEN)
            console.log("refreshtoken>>>",refreshtoken)
            const hashrefreshtoken = await bcrypt.hash(refreshtoken, 10)
            console.log("hashrefreshtoken>>>",hashrefreshtoken)
            //refreshtokens.push(refreshtoken)
            await refreshtokens.create({
            token: hashrefreshtoken,
            username: payload.name,
            role: payload.role
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




/*exports.logout = async (req, res) => {
   //const refreshtoken = req.body.token;
   const hashpassword = await bcrypt.compare(req.body.token, refreshtokens.token);
   console.log("logouttoken")
    //logout only one
    await refreshtokens.findOneAndDelete({ hashpassword })
    //logout from all login
    //await refreshtokens.deleteMany({ username  })
    res.sendStatus(204);
};*/

exports.logout = async (req, res) => {
    const token = req.body.token;

    if (!token) return res.sendStatus(400);

    try {
        const tokens = await refreshtokens.find();

        for (const doc of tokens) {
            const isMatch = await bcrypt.compare(token, doc.token);

            if (isMatch) {
                await refreshtokens.deleteOne({ _id: doc._id });
                return res.sendStatus(204);
            }
        }

        return res.sendStatus(403);

    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

exports.signup = async (req, res) => {
    try {
        const hashpassword = await bcrypt.hash(req.body.password, 10)
        const user = new User({
            name: req.body.name,
            id: req.body.id,
            password: hashpassword,
            role:req.body.role
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