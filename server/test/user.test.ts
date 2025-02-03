import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { dbConnect, dbDisconnect } from "./setup";
import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";
import jwt from "jsonwebtoken";
import mongoose, { Types } from "mongoose";
import request from "supertest";
import app from "../app";
import User from "../models/User";

beforeAll(async () => {
    await dbConnect();
});

afterAll(async () => {
    await dbDisconnect();
});

afterEach(async () => {
    vi.clearAllMocks();
});

describe("/api/user", () => {
    it("validate sign up fields", async () => {
        vi.spyOn(User, "create");

        const res1 = await request(app)
            .post("/api/user/signup")
            .send({ password: faker.internet.password() });

        expect(res1.status).toBe(400);
        expect(res1.body.error).toBe("missing email");

        const res2 = await request(app)
            .post("/api/user/signup")
            .send({ email: faker.internet.email() });

        expect(res2.status).toBe(400);
        expect(res2.body.error).toBe("missing password");

        expect(User.create).not.toHaveBeenCalled();
    });

    it("validate login fields", async () => {
        const res1 = await request(app)
            .post("/api/user/login")
            .send({ password: faker.internet.password() });

        expect(res1.status).toBe(400);
        expect(res1.body.error).toBe("missing email");

        const res2 = await request(app)
            .post("/api/user/login")
            .send({ email: faker.internet.email() });

        expect(res2.status).toBe(400);
        expect(res2.body.error).toBe("missing password");
    });

    it("user sign up", async () => {
        vi.spyOn(User, "create");

        const email = faker.internet.email();
        const password = faker.internet.password();

        const res = await request(app)
            .post("/api/user/signup")
            .send({ email, password });

        expect(res.status).toBe(200);
        expect(res.body.email).toEqual(email);

        expect(User.create).toHaveBeenCalledOnce();

        const user = await User.findOne({ email });
        expect(user).not.toBeNull();
        expect(user?.email).toEqual(email);
        expect(user?.admin).toEqual(false);
    });

    it("admin sign up", async () => {
        vi.spyOn(User, "create");

        const email = faker.internet.email();
        const password = faker.internet.password();

        const res = await request(app)
            .post("/api/user/signup")
            .send({ email, password, admin: true });

        expect(res.status).toBe(200);
        expect(res.body.email).toEqual(email);

        expect(User.create).toHaveBeenCalledOnce();

        const user = await User.findOne({ email });
        expect(user).not.toBeNull();
        expect(user?.email).toEqual(email);
        expect(user?.admin).toEqual(true);
    });

    it("sign up when user exists", async () => {
        vi.spyOn(User, "create");

        const email = faker.internet.email();
        const password = faker.internet.password();

        await request(app)
            .post("/api/user/signup")
            .send({ email, password });

        const res = await request(app)
            .post("/api/user/signup")
            .send({ email, password });

        expect(res.status).toBe(400);
        expect(res.body.error).toBe("user already exists");

        expect(User.create).toHaveBeenCalledOnce();
        const users = await User.find({ email });
        expect(users.length).toBe(1);
    });

    it("hash password", async () => {
        const email = faker.internet.email();
        const password = faker.internet.password();
        const hashedPassword = "hashed password";

        vi.spyOn(bcrypt, "hash").mockImplementationOnce(() => Promise.resolve(hashedPassword));

        const res = await request(app)
        .post("/api/user/signup")
        .send({ email, password });

        const user = await User.findOne({ email });

        expect(bcrypt.hash).toHaveBeenCalledOnce();
        expect(user).not.toBeNull();
        expect(user?.password).not.toBe(password);
        expect(user?.password).toBe(hashedPassword);
    });

    it("log in not existing user", async () => {
        const res = await request(app)
            .post("/api/user/login")
            .send({ email: faker.internet.email(), password: faker.internet.password() });

        expect(res.status).toBe(400);
        expect(res.body.error).toBe("user does not exist");
    });

    it("log in wrong password", async () => {
        const email = faker.internet.email();

        await request(app)
            .post("/api/user/signup")
            .send({ email, password: faker.internet.password(), });

        const res = await request(app)
            .post("/api/user/login")
            .send({ email, password: faker.internet.password() });

        expect(res.status).toBe(400);
        expect(res.body.error).toBe("invalid password");
    });

    it("log in", async () => {
        const email = faker.internet.email();
        const password = faker.internet.password();

        await request(app)
            .post("/api/user/signup")
            .send({ email, password });

        const res = await request(app)
            .post("/api/user/login")
            .send({ email, password });

        expect(res.status).toBe(200);
        expect(res.body.email).toBe(email);
        expect(res.body).toHaveProperty("token");
    });

    it("verify token", async () => {
        const email = faker.internet.email();

        const res = await request(app)
            .post("/api/user/signup")
            .send({ email, password: faker.internet.password() });

        const user = await User.findOne({ email });
        const token = jwt.verify(res.body.token, process.env.SECRET!) as { id: Types.ObjectId };

        expect(token).toHaveProperty("id");
        expect(token.id).toBe(user!.id);
    });
});
