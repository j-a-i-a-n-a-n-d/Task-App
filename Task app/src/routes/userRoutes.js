const express = require('express')
const sharp = require("sharp");
const multer = require("multer");
const User = require('../models/users');
const auth = require("../middleware/auth");
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account');
const router = new express.Router();


const addUser = async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name);
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (e) {
        res.status(400).send(e)
    }
}
const login = async (req, res) => {
    async (req, res) => {
        try {
            //
            const user = await User.findByCredentials(req.body.email, req.body.password);
            const token = await user.generateAuthToken();
            res.send({ user, token });
        } catch (e) {
            res.status(400).send();
        }
    }
}
const logout =  async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send();
    }
}
const removeAllLogins =  async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send();
    }
}
const updateUser = async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
}

const deleteUser =  async (req, res) => {
    try {
        //toJSON
        await req.user.remove();
        sendCancelationEmail(req.user.email, req.user.name);
        res.send(req.user);
    } catch (e) {
        res.status(500).send();
    }
}
const deleteMyAvatar = async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send(200);
}
const getMyAvatar = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar) {
            throw new Error("404");
        }
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
}
const addMyAvatar = async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send()
}

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }

        cb(undefined, true)
    }
})

const errorMessage = (error, req, res, next) => {
    res.status(400).send({ error: error.message });
}
//
//
//

router.post('/users', auth, addUser);
router.post('/users/login', login);
router.post('/users/logout', auth, logout);
router.post('/users/logout-all', auth, removeAllLogins);
router.get('/users/me', auth, async (req, res) => res.send(req.user));
router.patch('/users/me', auth, updateUser);
router.delete('/users/me', auth, deleteUser);


router.get('/users/:id/avatar', getMyAvatar);
router.post('/users/me/avatar', auth, upload.single('avatar'), addMyAvatar, errorMessage);
router.delete('/users/me/avatar', auth, deleteMyAvatar);

module.exports = router;