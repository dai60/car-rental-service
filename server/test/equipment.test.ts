import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { dbConnect, dbDisconnect } from "./setup";
import request from "supertest";
import app from "../app";
import User from "../models/User";
import Equipment from "../models/Equipment";
import { faker } from "@faker-js/faker";

beforeAll(async () => {
    await dbConnect();
});

afterAll(async () => {
    await dbDisconnect();
});

afterEach(async () => {
    vi.clearAllMocks();
});

function fakeEquipment() {
    return {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.number.float({ min: 0.99, max: 99999.99, fractionDigits: 2, }),
    };
}

describe("/api/equipment", () => {
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

    it("user or guest can't add new equipment", async () => {
        vi.spyOn(Equipment, "create");

        const guest = await request(app)
            .post("/api/equipment")
            .send(fakeEquipment());

        expect(guest.status).toBe(403);

        const user = await request(app)
            .post("/api/equipment")
            .send(fakeEquipment())
            .set("Authorization", userToken);

        expect(user.status).toBe(401);
        expect(Equipment.create).not.toHaveBeenCalled();
    });

    it("admin create new equipment", async () => {
        vi.spyOn(Equipment, "create");

        const equipment = fakeEquipment();
        const res = await request(app)
            .post("/api/equipment")
            .send(equipment)
            .set("Authorization", adminToken);

        expect(res.status).toBe(200);
        expect(res.body.name).toBe(equipment.name);
        expect(res.body.description).toBe(equipment.description);
        expect(res.body.price).toBe(equipment.price);
        expect(res.body.visibility).toBe("draft");
        expect(Equipment.create).toHaveBeenCalledExactlyOnceWith(equipment);
    });

    it("validate equipment fields", async () => {
        vi.spyOn(Equipment, "create");

        const res1 = await request(app)
            .post("/api/equipment")
            .send({ price: faker.number.float({ min: 0.99 }) })
            .set("Authorization", adminToken);

        expect(res1.status).toBe(400);
        expect(res1.body.error).toBe("missing name");

        const res2 = await request(app)
            .post("/api/equipment")
            .send({ name: faker.number.int() })
            .set("Authorization", adminToken);

        expect(res2.status).toBe(400);
        expect(res2.body.error).toBe("name must be a string");

        const res3 = await request(app)
            .post("/api/equipment")
            .send({ name: faker.commerce.productName(), description: faker.number.int() })
            .set("Authorization", adminToken);

        expect(res3.status).toBe(400);
        expect(res3.body.error).toBe("description must be a string");

        const res4 = await request(app)
            .post("/api/equipment")
            .send({ name: faker.commerce.productName(), })
            .set("Authorization", adminToken);

        expect(res4.status).toBe(400);
        expect(res4.body.error).toBe("missing price");

        expect(Equipment.create).not.toHaveBeenCalled();
    });

    it("create new equipment invalid price", async () => {
        vi.spyOn(Equipment, "create");

        const equipment = fakeEquipment();
        const res = await request(app)
            .post("/api/equipment")
            .send({ ...equipment, price: -equipment.price })
            .set("Authorization", adminToken);

        expect(res.status).toBe(400);
        expect(res.body.error).toBe("price can't be negative");
        expect(Equipment.create).not.toHaveBeenCalled();
    });

    it("user or guest can't edit equipment", async () => {
        vi.spyOn(Equipment, "findByIdAndUpdate");

        const original = fakeEquipment();
        const edit = fakeEquipment();

        const post = await request(app)
            .post("/api/equipment")
            .send(original)
            .set("Authorization", adminToken);

        const id = post.body._id;

        const res = await request(app)
            .put(`/api/equipment/${id}`)
            .send(edit)
            .set("Authorization", userToken);

        expect(res.status).toBe(401);
        expect(Equipment.findByIdAndUpdate).not.toHaveBeenCalled();

        const equipment = await Equipment.findById(id);

        expect(equipment?.name).toBe(original.name);
        expect(equipment?.description).toBe(original.description);
        expect(equipment?.price).toBe(original.price);
    });

    it("admin edit equipment", async () => {
        vi.spyOn(Equipment, "findByIdAndUpdate");

        const original = fakeEquipment();
        const edit = fakeEquipment();

        const post = await request(app)
            .post("/api/equipment")
            .send(original)
            .set("Authorization", adminToken);

        const id = post.body._id;

        const res = await request(app)
            .put(`/api/equipment/${id}`)
            .send(edit)
            .set("Authorization", adminToken);

        expect(res.status).toBe(200);
        expect(Equipment.findByIdAndUpdate).toHaveBeenCalledOnce();

        const data = await Equipment.findById(id);
        expect(data?.name).toBe(edit.name);
        expect(data?.description).toBe(edit.description);
        expect(data?.price).toBe(edit.price);
    });

    it("user or guest can't delete equipment", async () => {
        vi.spyOn(Equipment, "findByIdAndDelete");

        const post = await request(app)
            .post("/api/equipment")
            .send(fakeEquipment())
            .set("Authorization", adminToken);

        const id = post.body._id;

        const guest = await request(app).delete(`/api/equipment/${id}`);
        expect(guest.status).toBe(403);

        const user = await request(app)
            .delete(`/api/equipment/${id}`)
            .set("Authorization", userToken);

        expect(user.status).toBe(401);
        expect(Equipment.findByIdAndDelete).not.toHaveBeenCalled();

        const data = await Equipment.findById(id);
        expect(data).toBeTruthy();
    });

    it("admin delete equipment", async () => {
        vi.spyOn(Equipment, "findByIdAndDelete");

        const post = await request(app)
            .post("/api/equipment")
            .send(fakeEquipment())
            .set("Authorization", adminToken);

        const id = post.body._id;

        const res = await request(app)
            .delete(`/api/equipment/${id}`)
            .set("Authorization", adminToken);

        expect(res.status).toBe(200);
        expect(Equipment.findByIdAndDelete).toHaveBeenCalledExactlyOnceWith(id);

        const data = await Equipment.findById(id);
        expect(data).toBeFalsy();
    });
});
