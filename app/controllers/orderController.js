const express = require("express");
const mongoose = require("mongoose");

const Order = require("../models/Order");
const Product = require("../models/Product");

const app = express();

//add order api
app.post("/", async (req, res) => {
    try {
        let data = req.body;
        if (!data) {
            return res.status(400).send({ message: "Donnés introuvalbes", success: false });
        };

        let order = new Order({
            user: data.user,
            products: data.products,
            totale: data.totale

        });
        console.log(data.products)
        for(let i=0;i<data.products.length;i++){
            
            let productToUpdate = await Product.findById(data.products[i].product._id)
            if(data.products[i].qte>productToUpdate.qte){
                return res.status(400).send({ message: "Error", success: false });
            }else {
                let newQte = productToUpdate.qte - data.products[i].qte
                await Product.findByIdAndUpdate(data.products[i]._id,{qte:newQte})
            }
        }
        await order.save();
        res.status(201).send({ message: "La Commande est enregistrée avec succès", success: true })
    } catch (error) {
        console.log(error)
        return res.status(400).send({
            message:
                "Une erreur s'est produite avec votre demande; Veuillez réessayer",
            success: false,
        });
    }
});

//all orders api
app.get("/", async (_req, res) => {
    try {
        let allProducts=[];
        let orders = await Order.find().populate("user");
        for(let index=0;index<orders.length;index++){
            allProducts=[]
            for(let i=0;i<orders[index].products.length;i++){
                let product = await Product.findById(orders[index].products[i]._id)
                allProducts.push({"product":product,"qte":orders[index].products[i].qte})
            }
            orders[index].products=allProducts;
        }
        return res.status(200).send({ orders, success: true })
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            message:
                "Une erreur s'est produite avec votre demande; Veuillez réessayer",
            success: false,
        });
    }
});

//one order api
app.get("/:id", async (req, res) => {
    try {
        let orderId = req.params.id;
        if (!mongoose.isValidObjectId(orderId)) {
            return res.status(404).send({
                message: "Order introuvable",
                success: false,
            });
        }
        let order = await Order.findById(orderId).populate("user");
        if (!order) {
            return res.status(404).send({
                message: "Order introuvable",
                success: true
            })
        }
        res.status(200).send({ order, success: true })
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            message:
                "Une erreur s'est produite avec votre demande; Veuillez réessayer",
            success: false,
        });
    }
});

//delete order api
app.delete("/:id", async (req, res) => {
    try {
        let orderId = req.params.id;
        if (!mongoose.isValidObjectId(orderId)) {
            return res.status(404).send({
                message: "Order introuvable",
                success: false,
            });
        }
        let order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).send({
                message: "Order introuvable",
                success: true
            })
        }
        await Order.findByIdAndDelete(orderId);

        res.status(200).send({ message: "Order est supprimé", success: true })

    } catch (error) {
        console.log(error);
        return res.status(400).send({
            message:
                "Une erreur s'est produite avec votre demande; Veuillez réessayer",
            success: false,
        });
    }
});

//patch order api
app.patch("/:id", async (req, res) => {
    try {
        let data = req.body;
        let orderId = req.params.id;
        if (!mongoose.isValidObjectId(orderId)) {
            return res.status(404).send({
                message: "Order introuvable",
                success: false,
            });
        }
        if (!data.name) {
            return res.status(404).send({
                message: "Données introuvable",
                success: false,
            });
        }

        let orderToUpdate = await Order.findById(orderId);
        if (!orderToUpdate) {
            return res.status(404).send({
                message: "Order introuvable",
                success: false,
            });
        }

        if (orderToUpdate.name != data.name) {
            let exist = await Order.findOne({ name: data.name });
            if (exist) {
                return res
                    .status(400)
                    .send({ message: "Order est utilisé", success: false });
            }
        }

        await Order.findByIdAndUpdate(orderToUpdate._id, data);

        return res
            .status(200)
            .send({ message: "Order mis à jour", success: true });
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