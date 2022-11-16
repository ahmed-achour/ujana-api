const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const User = require("../models/User");

const app = express();

//register api
app.post("/", async (req, res) => {
    try {
        let today = new Date();
     
        let data = req.body;
        let birthdate = new Date(data.birthdate);
        if (!data) {
            return res.status(400).send({ message: "Donnés introuvalbes", success: false });
        };
        let exists = await User.findOne({ email: data.email });
        if (exists) {
            return res.status(400).send({ message: "L'adresse mail est déja utilisée", success: false });
        };
        data.password = bcrypt.hashSync(data.password, bcrypt.genSaltSync(10));
        let legal =Math.abs(birthdate.getFullYear()- today.getFullYear());
        if(legal <= 18){
            return res.status(400).send({ message: "Vous n'avez pas l'âge légal", success: false });
        };
        let user = new User({
            email: data.email,
            password: data.password,
            userName: data.userName,
            phone: data.phone,
            address: data.address,
            gender: data.gender,
            birthdate: data.birthdate,
            role: "USER",
        });
        await user.save();
        res.status(201).send({ message: "Utilisateur est enregistrée avec succès", success: false })
    } catch (error) {
        console.log(error)
        return res.status(400).send({
            message:
                "Une erreur s'est produite avec votre demande; Veuillez réessayer",
            success: false,
        });
    }
});

//login api
app.post("/login", async (req, res) => {
    let data = req.body;
    try {
        let user = await User.findOne({
            $or: [{ email: data.email }, { userName: data.email }],
        });
        if (!user) {
            return res.status(400).send({
                message: "Vérifiez l’adresse e-mail et le mot de passe de votre compte.",
                success: false,
            });
        }
        let compare = bcrypt.compareSync(data.password, user.password);
        if (!compare) {
            return res.status(400).send({
                message: "Vérifiez l’adresse e-mail et le mot de passe de votre compte.",
                success: false,
            });
        }
        res.setHeader("Access-Control-Expose-Headers", "x-token");

        res.setHeader(
            "x-token",
            jwt.sign(
                { id: user._id },
                process.env.TOKEN_SECRET
            )
        );
        return res
            .status(200)
            .send({ message: "Connexion réussie", success: true });
    } catch (e) {
        console.log(e);
        return res.status(400).send({
            message:
                "Une erreur s'est produite avec votre demande; Veuillez réessayer",
            success: false,
        });
    }
});

//all users api
app.get("/", async (_req, res) => {
    try {
        let users = await User.find({ role: "USER" });
        return res.status(200).send({ users, success: true })
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            message:
                "Une erreur s'est produite avec votre demande; Veuillez réessayer",
            success: false,
        });
    }
});

//all admins api
app.get("/admins", async (_req, res) => {
    try {
        let users = await User.find({ role: "ADMIN" });
        return res.status(200).send({ users, success: true })
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            message:
                "Une erreur s'est produite avec votre demande; Veuillez réessayer",
            success: false,
        });
    }
});

//one user api
app.get("/:id", async (req, res) => {
    try {
        let userId = req.params.id;
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(404).send({
                message: "Utilisateur introuvable",
                success: false,
            });
        }
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({
                message: "Utilisateur introuvable",
                success: true
            })
        }
        res.status(200).send({ user, success: true })

    } catch (error) {
        console.log(error);
        return res.status(400).send({
            message:
                "Une erreur s'est produite avec votre demande; Veuillez réessayer",
            success: false,
        });
    }
});

//delete user api
app.delete("/:id", async (req, res) => {
    try {
        let userId = req.params.id;
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(404).send({
                message: "Utilisateur introuvable",
                success: false,
            });
        }
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({
                message: "Utilisateur introuvable",
                success: true
            })
        }
        await User.findByIdAndDelete(userId);

        res.status(200).send({ message: "Utilisateur est supprimé", success: true })

    } catch (error) {
        console.log(error);
        return res.status(400).send({
            message:
                "Une erreur s'est produite avec votre demande; Veuillez réessayer",
            success: false,
        });
    }
});

//patch user api
app.patch("/:id", async (req, res) => {
    try {
        let data = req.body;
        let userId = req.params.id;
        if (data.password != undefined) {
            if (data.password.length == 0) delete data["password"];
        }
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(404).send({
                message: "Users introuvable",
                success: false,
            });
        }


        let userToUpdate = await User.findById(userId);
        if (!userToUpdate) {
            return res.status(404).send({
                message: "utilisateur introuvable",
                success: false,
            });
        }

        if (userToUpdate.email != data.email) {
            let exist = await User.findOne({ email: data.email });
            if (exist) {
                return res
                    .status(400)
                    .send({ message: "L'e-mail est utilisé", success: false });
            }
        }

        let user = { ...data, updated_at: Date.now() };

        if (data.password)
            user.password = bcrypt.hashSync(data.password, bcrypt.genSaltSync(10));

        await User.findByIdAndUpdate(userToUpdate._id, user);

        return res
            .status(200)
            .send({ message: "utilisateur mis à jour", success: true });
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            message:
                "Une erreur s'est produite avec votre demande; Veuillez réessayer",
            success: false,
        });
    }
});

module.exports = app;