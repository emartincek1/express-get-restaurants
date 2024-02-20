const request = require("supertest");
const app = require("./src/app");
const { Restaurant } = require("./models/index");
const syncSeed = require("./seed");

describe("Server Tests", () => {
  beforeAll(async () => {
    await syncSeed();
  });

  test("get restaurants returns correct response", async () => {
    const response = await request(app).get("/restaurants");
    expect(response.statusCode).toBe(200);
    expect(response.body[0]).toEqual(
      expect.objectContaining({
        name: "AppleBees",
        location: "Texas",
      })
    );
    const restaurants = await Restaurant.findAll();
    expect(response.body.length).toBe(restaurants.length);
  });

  test("post restaurants returns correct response", async () => {
    const response = await request(app)
      .post("/restaurants")
      .send({
        restaurant: {
          name: "ChikFilA",
          location: "Atlanta",
          cuisine: "FastFood",
        },
      });
    expect(response.statusCode).toBe(200);
    expect(response.body[3]).toEqual(
      expect.objectContaining({
        name: "ChikFilA",
        location: "Atlanta",
        cuisine: "FastFood",
      })
    );
    const restaurants = await Restaurant.findAll();
    expect(response.body.length).toBe(restaurants.length);
  });

  test("put restaurants returns correct response", async () => {
    const response = await request(app)
      .put("/restaurants/4")
      .send({
        restaurant: {
          name: "FiveGuys",
          location: "Atlanta",
          cuisine: "FastFood",
        },
      });
    expect(response.statusCode).toBe(200);
    expect(response.body[3]).toEqual(
      expect.objectContaining({
        name: "FiveGuys",
        location: "Atlanta",
        cuisine: "FastFood",
      })
    );
    const restaurants = await Restaurant.findAll();
    expect(response.body.length).toBe(restaurants.length);
  });

  test("delete restaurants returns correct response", async () => {
    const response = await request(app).delete("/restaurants/4");
    expect(response.statusCode).toBe(200);
    expect(response.body[3]).toEqual(undefined);
    const restaurants = await Restaurant.findAll();
    expect(response.body.length).toBe(restaurants.length);
  });
});
