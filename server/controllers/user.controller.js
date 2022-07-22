const User = require("../models/user.models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
    register: (req, res) => {
        User.findOne({ username: req.body.username })
            .then(user => {
                if (user) {
                    res.status(400).json({ message: "Username already exists" })
                } else {
                    bcrypt.hash(req.body.password, 10)
                        .then(hashedPassword => {
                            const newUser = new User({
                                username: req.body.username,
                                email: req.body.email,
                                password: hashedPassword
                            })
                            newUser.save()
                                .then(user => {
                                    res.status(201).json(user)
                                }
                            )
                        }
                    )
                }
            }
        )
    },

    login: (req, res) => {
        User.findOne({ username: req.body.username }).then(user => {
            if (!user) {
                res.status(400).json({ message: "Username does not exist" })
            } else {
                bcrypt.compare(req.body.password, user.password)
                    .then(isMatch => {
                        if (isMatch) {
                            const payload = {
                                id: user._id,
                                username: user.username
                            }
                            jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" }, (err, token) => {
                                res.cookie("userToken", token, { httpOnly: true })
                                res.status(200).json(user)
                            }
                            )
                        } else {
                            res.status(400).json({ message: "Incorrect password" })
                        }
                    }
                )
            }})
        },
    
    logout: (req, res) => {
        res.clearCookie("userToken");
        res.json({ message: "Logged out" })
    },

    getUser:(req, res) => {
        User.findById(req.jwtPayload.id)
            .then(user => {
                console.log(user);
                res.json(user)
            })
            .catch(err => {
            console.log(err);})
    },

    findAllUsers:(req, res) => {
        User.find()
        .then(users => {
            res.json(users)
        })
        .catch((err)=>{
            console.log("findAllUsers error", err)
        })
    },

    addNewDew:(req, res) => {
        User.findById(req.params.id)
        .then(user => {
            user.dews.push(req.body)
            user.save()
            .then(user => {
                res.json(user)
            }
            )
        }
        )
    }
}