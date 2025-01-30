import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { dbConnect, dbDisconnect } from "./setup";
import { faker } from "@faker-js/faker";
import request from "supertest";
import app from "../app";
import User from "../models/User";
import Reservation from "../models/Reservation";

beforeAll(async () => {
    await dbConnect();
});

afterAll(async () => {
    await dbDisconnect();
});

afterEach(async () => {
    vi.clearAllMocks();
});

describe("/api/reservation", () => {
    let adminId: string;
    let adminToken: string;
    let equipmentId: string;

    const equipment = {
        name: faker.commerce.product(),
        price: faker.number.float({ min: 0.99, max: 99999.99, fractionDigits: 2 }),
    };

    const newUser = async (admin: boolean = false): Promise<[string, string]> => {
        const res = await request(app)
            .post("/api/user/signup")
            .send({ email: faker.internet.email(), password: faker.internet.password() });

        if (admin) {
            await User.findByIdAndUpdate(res.body._id, { admin: true });
        }

        return [res.body._id, `Bearer ${res.body.token}`];
    }

    beforeAll(async () => {
        [adminId, adminToken] = await newUser(true);

        const post = await request(app)
            .post("/api/equipment")
            .send(equipment)
            .set("Authorization", adminToken);

        equipmentId = post.body._id;
    });

    it("user create new reservation", async () => {
        vi.spyOn(Reservation, "create");

        const [userId, userToken] = await newUser();

        const date = faker.date.future();
        const res = await request(app)
            .post("/api/reservation")
            .send({ equipment: equipmentId, date })
            .set("Authorization", userToken);

        expect(res.status).toBe(200);
        expect(Reservation.create).toHaveBeenCalledOnce();

        const reservation = await Reservation.findById(res.body._id);
        expect(reservation).toBeTruthy();
        expect(reservation?.user.equals(userId)).toBeTruthy();
        expect(reservation?.equipment.equals(equipmentId)).toBeTruthy();
        expect(reservation?.date).toStrictEqual(date);
        expect(reservation?.status).toBe("pending");
    });

    it("user can't create reservation in the past", async () => {
        vi.spyOn(Reservation, "create");

        const [userId, userToken] = await newUser();

        const date = faker.date.past();
        const res = await request(app)
            .post("/api/reservation")
            .send({ equipment: equipmentId, date })
            .set("Authorization", userToken);

        expect(res.status).toBe(400);
        expect(res.body.error).toBe("can't make a reservation in the past");
        expect(Reservation.create).not.toHaveBeenCalledOnce();
    });

    it("user can't create multiple reservations in the same day", async () => {
        vi.spyOn(Reservation, "create");

        const [userId, userToken] = await newUser();

        const date = faker.date.soon({ days: 10 });
        const first = await request(app)
            .post("/api/reservation")
            .send({ equipment: equipmentId, date })
            .set("Authorization", userToken);

        const second = await request(app)
            .post("/api/reservation")
            .send({ equipment: equipmentId, date })
            .set("Authorization", userToken);

        expect(first.status).toBe(200);
        expect(second.status).toBe(400);
        expect(second.body.error).toBe("reservation already exists");
        expect(Reservation.create).toHaveBeenCalledOnce();
    });

    it("user can't change reservation status", async () => {
        const [userId, userToken] = await newUser();
        const user = await request(app)
            .post("/api/reservation")
            .send({ equipment: equipmentId, date: faker.date.soon({ days: 10 }) })
            .set("Authorization", userToken);

        const accepted = await request(app)
            .patch(`/api/reservation/status/${user.body._id}`)
            .send({ status: "accepted" })
            .set("Authorization", userToken);

        expect(accepted.status).toBe(401);

        const reservation = await Reservation.findById(user.body._id);
        expect(reservation?.status).toBe("pending");
    });

    it("admin change reservation status", async () => {
        const [userId, userToken] = await newUser();
        const user = await request(app)
            .post("/api/reservation")
            .send({ equipment: equipmentId, date: faker.date.future() })
            .set("Authorization", userToken);

        const accepted = await request(app)
            .patch(`/api/reservation/status/${user.body._id}`)
            .send({ status: "accepted" })
            .set("Authorization", adminToken);

        expect(accepted.status).toBe(200);

        const reservation = await Reservation.findById(user.body._id);
        expect(reservation?.status).toBe("accepted");
    });

    it("user cancel reservation", async () => {
        vi.spyOn(Reservation, "findByIdAndDelete");

        const [userId, userToken] = await newUser();
        const post = await request(app)
            .post("/api/reservation")
            .send({ equipment: equipmentId, date: faker.date.future() })
            .set("Authorization", userToken);

        const deleted = await request(app)
            .delete(`/api/reservation/${post.body._id}`)
            .set("Authorization", userToken);

        expect(deleted.status).toBe(200);
        expect(Reservation.findByIdAndDelete).toHaveBeenCalledExactlyOnceWith(post.body._id);

        const reservation = await Reservation.findById(post.body._id);
        expect(reservation).toBeFalsy();
    });

    it("admin or wrong user can't cancel reservation", async () => {
        vi.spyOn(Reservation, "findByIdAndDelete");

        const [userId, userToken] = await newUser();
        const [userId2, userToken2] = await newUser();

        const post = await request(app)
            .post("/api/reservation")
            .send({ equipment: equipmentId, date: faker.date.future() })
            .set("Authorization", userToken);

        const wrongUserDeleted = await request(app)
            .delete(`/api/reservation/${post.body._id}`)
            .set("Authorization", userToken2);

        const adminDeleted = await request(app)
            .delete(`/api/reservation/${post.body._id}`)
            .set("Authorization", adminToken);

        expect(wrongUserDeleted.status).toBe(401);
        expect(adminDeleted.status).toBe(401);
        expect(Reservation.findByIdAndDelete).not.toHaveBeenCalled();

        const reservation = await Reservation.findById(post.body._id);
        expect(reservation).toBeTruthy();
    });
});
