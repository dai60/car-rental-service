import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { dbConnect, dbDisconnect } from "./setup";
import mongoose from "mongoose";
import request from "supertest";
import app from "../app";
import User from "../models/User";
import Equipment from "../models/Equipment";

beforeAll(async () => {
    await dbConnect();
});

afterAll(async () => {
    await dbDisconnect();
});

afterEach(async () => {
    vi.clearAllMocks();
    await mongoose.connection.db?.dropDatabase();
});

describe("/api/equipment", () => {
    const admin = { email: "admin@mail.com", password: "password1" };
    const user = { email: "user@mail.com", password: "password2" };

    const equipment = {
        name: "Test Equipment",
        price: 999.99,
    };

    beforeEach(async () => {
        await request(app).post("/api/user/signup").send(admin);
        await request(app).post("/api/user/signup").send(user);
        await User.findOneAndUpdate({ email: admin.email }, { admin: true });
    });

    it("user can't add new equipment", async () => {
        vi.spyOn(Equipment, "create");

        const login = await request(app).post("/api/user/login").send(user);
        const res = await request(app)
            .post("/api/equipment")
            .send(equipment)
            .set("Authorization", `Bearer ${login.body.token}`);

        expect(res.status).toBe(401);
        expect(Equipment.create).not.toHaveBeenCalled();
    });

    it("admin create new equipment", async () => {
        vi.spyOn(Equipment, "create");

        const login = await request(app).post("/api/user/login").send(admin);
        const res = await request(app)
            .post("/api/equipment")
            .send(equipment)
            .set("Authorization", `Bearer ${login.body.token}`);

        expect(res.status).toBe(200);
        expect(Equipment.create).toHaveBeenCalledExactlyOnceWith(equipment);
    });

    it("create new equipment invalid price", async () => {
        vi.spyOn(Equipment, "create");

        const login = await request(app).post("/api/user/login").send(admin);
        const res = await request(app)
            .post("/api/equipment")
            .send({ ...equipment, price: -999.99 })
            .set("Authorization", `Bearer ${login.body.token}`);

        expect(res.status).toBe(400);
        expect(res.body.error).toBe("price can't be negative");
        expect(Equipment.create).not.toHaveBeenCalled();
    });

    it("user can't edit equipment", async () => {
        vi.spyOn(Equipment, "findByIdAndUpdate");

        const adminLogin = await request(app).post("/api/user/login").send(admin);
        const post = await request(app)
            .post("/api/equipment")
            .send(equipment)
            .set("Authorization", `Bearer ${adminLogin.body.token}`);

        const id = post.body._id;

        const login = await request(app).post("/api/user/login").send(user);
        const res = await request(app)
            .put(`/api/equipment/${id}`)
            .send({ ...equipment, price: 499.99 })
            .set("Authorization", `Bearer ${login.body.token}`);

        expect(res.status).toBe(401);
        expect(Equipment.findByIdAndUpdate).not.toHaveBeenCalled();

        const data = await Equipment.findById(id);
        expect(data?.price).toBe(999.99);
    });

    it("admin edit equipment", async () => {
        vi.spyOn(Equipment, "findByIdAndUpdate");

        const login = await request(app).post("/api/user/login").send(admin);
        const post = await request(app)
            .post("/api/equipment")
            .send(equipment)
            .set("Authorization", `Bearer ${login.body.token}`);

        const id = post.body._id;

        const res = await request(app)
            .put(`/api/equipment/${id}`)
            .send({ ...equipment, price: 499.99 })
            .set("Authorization", `Bearer ${login.body.token}`);

        expect(res.status).toBe(200);
        expect(Equipment.findByIdAndUpdate).toHaveBeenCalledOnce();

        const data = await Equipment.findById(id);
        expect(data?.price).toBe(499.99);
    });
});
