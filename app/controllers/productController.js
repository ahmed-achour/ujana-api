const express = require("express");
const mongoose = require("mongoose");
const { uploadFile } = require("../middlewares/uploadFile");
const path = require("path");
const fs = require("fs");

const Category = require("../models/Category");
const Product = require("../models/Product");

const app = express();

//add product api
app.post("/", uploadFile("image"), async (req, res) => {
  let uploadedImagePath = "";
  try {

    let data = req.body;
    if (req.file)
      uploadedImagePath = path.join("public/products", req.file.filename);

    if (!data) {
      if (req.file) fs.unlinkSync(uploadedImagePath);
      return res
        .status(404)
        .send({ message: "Données introuvables", success: false });
    }

    let product = new Product({
      name: data.name,
      name: data.name, qte: data.qte, price: data.price, image: data.image, description: data.description, category: data.category, brand: data.brand,
      image: uploadedImagePath
        ? `/public/products/${req.file.filename}`
        : "/public/products/default-products.jpg",
    });

    await product.save();

    return res
      .status(200)
      .send({ message: "Le produit est enregistré", success: true });
  } catch (error) {
    if (req.file) fs.unlinkSync(uploadedImagePath);
    console.log(error);
    return res.status(400).send({
      message:
        "Une erreur s'est produite avec votre demande; Veuillez réessayer",
      success: false,
    });
  }
});

//all product api
app.get("/", async (_req, res) => {
  try {
    const product = await Product.find().sort({
      createdAt: -1,
    }).populate("category");
    res.status(200).send({ product, success: true });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      message:
        "Une erreur s'est produite avec votre demande; Veuillez réessayer",
      success: false,
    });
  }
});

//one product api
app.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).send({
        message: "Produit introuvable",
        success: false,
      });
    }
    let product = await Product.findById(req.params.id).populate(
      "category",

    );
    if (!product) {
      return res.status(404).send({
        message: "Produit introuvable",
        success: false,
      });
    }

    return res.status(200).send({ product, success: true });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      message:
        "Une erreur s'est produite avec votre demande; Veuillez réessayer",
      success: false,
    });
  }
});

//Delete product 
app.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).send({
        message: "Produit introuvable",
        success: false,
      });
    }
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send({
        message: "Produit introuvable",
        success: false,
      });
    } let productImagePath = path.join(__dirname, "..", "..", product.image);
    fs.unlinkSync(productImagePath);

    await Product.findByIdAndDelete(product._id);

    return res.status(200).send({ message: "Product supprimé", success: true });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      message:
        "Une erreur s'est produite avec votre demande; Veuillez réessayer",
      success: false,
    });
  }
});

//update product api
app.patch("/:id", uploadFile("image"), async (req, res) => {
  let uploadedImagePath = "";
  try {
    let data = req.body;
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).send({
        message: "Products introuvable",
        success: false,
      });
    }
    if (req.file)
      uploadedImagePath = path.join("public/products", req.file.filename);

    let productToUpdate = await Product.findById(req.params.id);
    if (!productToUpdate) {
      if (uploadedImagePath) fs.unlinkSync(uploadedImagePath);
      return res.status(404).send({
        message: "Product introuvable",
        success: false,
      });
    }

    let product = { ...data, updated_at: Date.now() };

    if (uploadedImagePath && productToUpdate.image) {
      product.image = `/public/products/${req.file.filename}`;

      let oldImagePath = path.join(__dirname, "..", "..", productToUpdate.image);

      if (
        fs.existsSync(oldImagePath) &&
        !productToUpdate.image.endsWith("default-products.jpg")
      )
        fs.unlinkSync(oldImagePath);
    }

    await Product.findByIdAndUpdate(productToUpdate._id, product);

    return res
      .status(200)
      .send({ message: "Product mis à jour", success: true });
  } catch (error) {
    console.log(error);
    if (uploadedImagePath) fs.unlinkSync(uploadedImagePath);
    return res.status(400).send({
      message:
        "Une erreur s'est produite avec votre demande; Veuillez réessayer",
      success: false,
    });
  }
});

module.exports = app;