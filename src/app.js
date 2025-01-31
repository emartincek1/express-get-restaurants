const express = require("express");
const app = express();
const { Restaurant, Menu, Item } = require("../models/index");
const { check, validationResult } = require("express-validator");
const db = require("../db/connection");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//TODO: Create your GET Request Route Below:
app.get("/restaurants", async (req, res, next) => {
  try {
    const restaurants = await Restaurant.findAll(
      { include: Menu },
      { include: [{ model: Menu, include: [{ model: Item }] }] }
    );
    res.json(restaurants);
  } catch (e) {
    next(e);
  }
});

app.get("/restaurants/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const restuarant = await Restaurant.findByPk(id);
    if (restuarant === null) return res.send(`No restaurant at ${id}.`);
    res.json(restuarant);
  } catch (e) {
    next(e);
  }
});

app.post(
  "/restaurants",
  [
    check("restaurant.name").not().isEmpty().trim(),
    check("restaurant.location").not().isEmpty().trim(),
    check("restaurant.cuisine").not().isEmpty().trim(),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.json({ error: errors.array() });
      } else {
        const { restaurant } = req.body;
        await Restaurant.create(restaurant);
        const restaurants = await Restaurant.findAll();
        res.json(restaurants);
      }
    } catch (e) {
      next(e);
    }
  }
);

app.put("/restaurants/:id", async (req, res, next) => {
  try {
    const { restaurant } = req.body;
    const { id } = req.params;
    const oldRestaurant = await Restaurant.findByPk(id);
    await oldRestaurant.update(restaurant);
    const restaurants = await Restaurant.findAll();
    res.json(restaurants);
  } catch (e) {
    next(e);
  }
});

app.delete("/restaurants/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const oldRestaurant = await Restaurant.findByPk(id);
    await oldRestaurant.destroy();
    const restaurants = await Restaurant.findAll();
    res.json(restaurants);
  } catch (e) {
    next(e);
  }
});

module.exports = app;
