import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { dbConnect, dbDisconnect } from "./setup";
import request from "supertest";
import app from "../app";
import User from "../models/User";
import Car from "../models/Car";
import { faker } from "@faker-js/faker";
import { model } from "mongoose";

beforeAll(async () => {
    await dbConnect();
});

afterAll(async () => {
    await dbDisconnect();
});

afterEach(async () => {
    vi.clearAllMocks();
});

function fakeCar() {
    return {
        model: faker.vehicle.vehicle(),
        description: faker.commerce.productDescription(),
        price: faker.number.float({ min: 99.99, max: 99999.99, fractionDigits: 2, }),
    };
}

describe("/api/cars", () => {
    let adminToken: string;
    let userToken: string;

    beforeAll(async () => {
        const admin = { email: faker.internet.email(), password: faker.internet.password(), };
        const user = { email: faker.internet.email(), password: faker.internet.password(), };

        await request(app).post("/api/user/signup").send(admin);
        await request(app).post("/api/user/signup").send(user);
        await User.findOneAndUpdate({ email: admin.email }, { admin: true });

        const adminLogin = await request(app).post("/api/user/login").send(admin);
        const userLogin = await request(app).post("/api/user/login").send(user);

        adminToken = `Bearer ${adminLogin.body.token}`;
        userToken = `Bearer ${userLogin.body.token}`;
    });

    it("user or guest can't add new cars", async () => {
        vi.spyOn(Car, "create");

        const guest = await request(app)
            .post("/api/cars")
            .field("json", JSON.stringify(fakeCar()));

        expect(guest.status).toBe(403);

        const user = await request(app)
            .post("/api/cars")
            .field("json", JSON.stringify(fakeCar()))
            .set("Authorization", userToken);

        expect(user.status).toBe(401);
        expect(Car.create).not.toHaveBeenCalled();
    });

    it("admin create new car", async () => {
        vi.spyOn(Car, "create");

        const car = fakeCar();
        const res = await request(app)
            .post("/api/cars")
            .field("json", JSON.stringify(car))
            .set("Authorization", adminToken);

        expect(res.status).toBe(200);
        expect(res.body.model).toBe(car.model);
        expect(res.body.description).toBe(car.description);
        expect(res.body.price).toBe(car.price);
        expect(res.body.visibility).toBe("draft");
        expect(Car.create).toHaveBeenCalledExactlyOnceWith(car);
    });

    it("validate car fields", async () => {
        vi.spyOn(Car, "create");

        const res1 = await request(app)
            .post("/api/cars")
            .field("json", JSON.stringify({ price: faker.number.float({ min: 0.99 }) }))
            .set("Authorization", adminToken);

        expect(res1.status).toBe(400);
        expect(res1.body.error).toBe("missing model");

        const res2 = await request(app)
            .post("/api/cars")
            .field("json", JSON.stringify({ model: faker.number.int() }))
            .set("Authorization", adminToken);

        expect(res2.status).toBe(400);
        expect(res2.body.error).toBe("model must be a string");

        const res3 = await request(app)
            .post("/api/cars")
            .field("json", JSON.stringify({ model: faker.vehicle.vehicle(), description: faker.number.int() }))
            .set("Authorization", adminToken);

        expect(res3.status).toBe(400);
        expect(res3.body.error).toBe("description must be a string");

        const res4 = await request(app)
            .post("/api/cars")
            .field("json", JSON.stringify({ model: faker.vehicle.vehicle() }))
            .set("Authorization", adminToken);

        expect(res4.status).toBe(400);
        expect(res4.body.error).toBe("missing price");

        expect(Car.create).not.toHaveBeenCalled();
    });

    it("create new car invalid price", async () => {
        vi.spyOn(Car, "create");

        const car = fakeCar();
        const res = await request(app)
            .post("/api/cars")
            .field("json", JSON.stringify({ ...car, price: -car.price }))
            .set("Authorization", adminToken);

        expect(res.status).toBe(400);
        expect(res.body.error).toBe("price can't be negative");
        expect(Car.create).not.toHaveBeenCalled();
    });

    it("user or guest can't edit car", async () => {
        vi.spyOn(Car, "findByIdAndUpdate");

        const original = fakeCar();
        const edit = fakeCar();

        const post = await request(app)
            .post("/api/cars")
            .field("json", JSON.stringify(original))
            .set("Authorization", adminToken);

        const id = post.body._id;

        const res = await request(app)
            .put(`/api/cars/${id}`)
            .field("json", JSON.stringify(edit))
            .set("Authorization", userToken);

        expect(res.status).toBe(401);
        expect(Car.findByIdAndUpdate).not.toHaveBeenCalled();

        const car = await Car.findById(id);

        expect(car?.model).toBe(original.model);
        expect(car?.description).toBe(original.description);
        expect(car?.price).toBe(original.price);
    });

    it("admin edit car", async () => {
        vi.spyOn(Car, "findByIdAndUpdate");

        const original = fakeCar();
        const edit = fakeCar();

        const post = await request(app)
            .post("/api/cars")
            .field("json", JSON.stringify(original))
            .set("Authorization", adminToken);

        const id = post.body._id;

        const res = await request(app)
            .put(`/api/cars/${id}`)
            .field("json", JSON.stringify(edit))
            .set("Authorization", adminToken);

        expect(res.status).toBe(200);
        expect(Car.findByIdAndUpdate).toHaveBeenCalledOnce();

        const data = await Car.findById(id);
        expect(data?.model).toBe(edit.model);
        expect(data?.description).toBe(edit.description);
        expect(data?.price).toBe(edit.price);
    });

    it("user or guest can't delete car", async () => {
        vi.spyOn(Car, "findByIdAndDelete");

        const post = await request(app)
            .post("/api/cars")
            .field("json", JSON.stringify(fakeCar()))
            .set("Authorization", adminToken);

        const id = post.body._id;

        const guest = await request(app).delete(`/api/cars/${id}`);
        expect(guest.status).toBe(403);

        const user = await request(app)
            .delete(`/api/cars/${id}`)
            .set("Authorization", userToken);

        expect(user.status).toBe(401);
        expect(Car.findByIdAndDelete).not.toHaveBeenCalled();

        const data = await Car.findById(id);
        expect(data).toBeTruthy();
    });

    it("admin delete car", async () => {
        vi.spyOn(Car, "findByIdAndDelete");

        const post = await request(app)
            .post("/api/cars")
            .field("json", JSON.stringify(fakeCar()))
            .set("Authorization", adminToken);

        const id = post.body._id;

        const res = await request(app)
            .delete(`/api/cars/${id}`)
            .set("Authorization", adminToken);

        expect(res.status).toBe(200);
        expect(Car.findByIdAndDelete).toHaveBeenCalledExactlyOnceWith(id);

        const data = await Car.findById(id);
        expect(data).toBeFalsy();
    });
});
