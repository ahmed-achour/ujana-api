const express = require("express");
const mongoose = require("mongoose");

const Category = require("../models/Category");
const Product = require("../models/Product");

const app = express();

//add category api
app.post("/", async (req, res) => {
    try {
        let data = req.body;
        if (!data) {
            return res.status(400).send({ message: "Donnés introuvalbes", success: false });
        };
        let exists = await Category.findOne({ name: data.name });
        if (exists) {
            return res.status(400).send({ message: "La catégorie est déja existé", success: false });
        };
        let category = new Category({
            name: data.name,
        });
        await category.save();
        res.status(201).send({ message: "La catégorie est enregistrée avec succès", success: false })
    } catch (error) {
        console.log(error)
        return res.status(400).send({
            message:
                "Une erreur s'est produite avec votre demande; Veuillez réessayer",
            success: false,
        });
    }
});

//all categories api
app.get("/", async (_req, res) => {
    try {
        let categories = await Category.find();
        for(let i=0; i<categories.length;i++){
            let product = await Product.find({category:categories[i]._id});
            categories[i] = {...categories[i]._doc,"nbrProduct":product.length }
        }
        return res.status(200).send({ categories, success: true })
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            message:
                "Une erreur s'est produite avec votre demande; Veuillez réessayer",
            success: false,
        });
    }
});

//one category api
app.get("/:id", async (req, res) => {
    try {
        let categoryId = req.params.id;
        if (!mongoose.isValidObjectId(categoryId)) {
            return res.status(404).send({
                message: "Categorie introuvable",
                success: false,
            });
        }
        let category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).send({
                message: "Categorie introuvable",
                success: true
            })
        }
        res.status(200).send({ category, success: true })

    } catch (error) {
        console.log(error);
        return res.status(400).send({
            message:
                "Une erreur s'est produite avec votre demande; Veuillez réessayer",
            success: false,
        });
    }
});

//delete category api
app.delete("/:id", async (req, res) => {
    try {
        let categoryId = req.params.id;
        if (!mongoose.isValidObjectId(categoryId)) {
            return res.status(404).send({
                message: "Categorie introuvable",
                success: false,
            });
        }
        let category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).send({
                message: "Categorie introuvable",
                success: true
            })
        }
        await Category.findByIdAndDelete(categoryId);

        res.status(200).send({ message: "Categorie est supprimé", success: true })

    } catch (error) {
        console.log(error);
        return res.status(400).send({
            message:
                "Une erreur s'est produite avec votre demande; Veuillez réessayer",
            success: false,
        });
    }
});

//patch category api
app.patch("/:id", async (req, res) => {
    try {
        let data = req.body;
        let categoryId = req.params.id;
        if (!mongoose.isValidObjectId(categoryId)) {
            return res.status(404).send({
                message: "Categorie introuvable",
                success: false,
            });
        }
        if (!data.name) {
            return res.status(404).send({
                message: "Données introuvable",
                success: false,
            });
        }

        let categoryToUpdate = await Category.findById(categoryId);
        if (!categoryToUpdate) {
            return res.status(404).send({
                message: "Categorie introuvable",
                success: false,
            });
        }

        if (categoryToUpdate.name != data.name) {
            let exist = await Category.findOne({ name: data.name });
            if (exist) {
                return res
                    .status(400)
                    .send({ message: "Categorie est utilisé", success: false });
            }
        }

        await Category.findByIdAndUpdate(categoryToUpdate._id, data);

        return res
            .status(200)
            .send({ message: "Categorie mis à jour", success: true });
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