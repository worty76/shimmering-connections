const Product = require("../models/product");
const User = require("../models/user");
const { formidable } = require("formidable");
const path = require("path");
const fs = require("fs");
const cloudinary = require("../utils/cloudinary");

const search = async (req, res) => {
  const { name } = req.body;

  const products = await Product.find({
    name: { $regex: name, $options: "i" },
  });

  console.log(products);

  res
    .status(200)
    .json({ message: "Successfully get products", data: products });
};

const read = async (req, res) => {
  const products = await Product.find({});

  res
    .status(200)
    .json({ message: "Successfully get products", data: products });
};

const create = async (req, res) => {
  try {
    const form = formidable({ multiples: true });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(400).json({ message: "Error in file parsing" });
      }
      if (!fields.name[0] || !fields.price[0]) {
        return res.status(400).json({ message: "Name or price is required" });
      }

      const user = await User.findOne({ _id: req.user._id });
      if (!user) {
        return res.status(400).json({ message: "User does not exist" });
      }

      let imagePath = null;
      console.log(fields);

      if (fields.image && fields.image[0]) {
        await cloudinary.uploader.upload(
          fields.image[0],
          async function (err, result) {
            if (err) {
              console.log(err);
              return res.status(500).json({
                success: false,
                message: "Error",
              });
            }
            const newProduct = new Product({
              name: fields.name[0],
              price: fields.price[0],
              topic: fields.topic[0],
              image: result.secure_url,
              author: req.user._id,
            });

            await newProduct.save();
            return res.status(200).json({
              success: true,
              message: "Successfully created a product!",
              data: newProduct,
            });
          }
        );
      }
      const newProduct = new Product({
        name: fields.name[0],
        price: fields.price[0],
        topic: fields.topic[0],
        author: req.user._id,
      });

      await newProduct.save();
      return res.status(200).json({
        success: true,
        message: "Successfully created a product!",
        data: newProduct,
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const update = async (req, res) => {
  const { name, price, topic } = req.body;
  const { productId } = req.params;

  const user = User.findOne({ _id: req.user._id });

  if (!user) return res.status(400).json({ message: "User is not exist" });

  const newProduct = await Product.findByIdAndUpdate(
    productId,
    { $set: { name: name, price: price, topic: topic } },
    { new: true }
  );
  res
    .status(200)
    .json({ message: "Sucessfully updated a product", data: newProduct });
};

const deletePost = async (req, res) => {
  const { productId } = req.params;

  const newProduct = await Product.findByIdAndDelete(productId);
  res.status(200).json({ message: "Sucessfully deteled a product" });
};

const productController = { read, create, update, deletePost, search };

module.exports = productController;
