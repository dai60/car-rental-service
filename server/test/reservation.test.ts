import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { dbConnect, dbDisconnect } from "./setup";
import { faker } from "@faker-js/faker";
import request from "supertest";
import app from "../app";
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

function fakeDate() {
    const start = faker.date.soon({ days: 10 });
    return {
        start,
        end: faker.date.soon({ days: 10, refDate: start }),
    }
}

describe("/api/reservation", () => {
    let adminId: string;
    let adminToken: string;
    let carId: string;

    const car = {
        model: faker.vehicle.vehicle(),
        price: faker.number.float({ min: 99.99, max: 99999.99, fractionDigits: 2 }),
    };

    const newUser = async (admin: boolean = false): Promise<[string, string]> => {
        const res = await request(app)
            .post("/api/user/signup")
            .send({ email: faker.internet.email(), password: faker.internet.password(), admin });
        return [res.body._id, `Bearer ${res.body.token}`];
    }

    beforeAll(async () => {
        [adminId, adminToken] = await newUser(true);

        const post = await request(app)
            .post("/api/cars")
            .field("json", JSON.stringify(car))
            .set("Authorization", adminToken);

        carId = post.body._id;
    });

    it("user create new reservation", async () => {
        vi.spyOn(Reservation, "create");

        const [userId, userToken] = await newUser();

        const date = fakeDate();
        const res = await request(app)
            .post("/api/reservation")
            .send({ car: carId, date })
            .set("Authorization", userToken);

        expect(res.status).toBe(200);
        expect(Reservation.create).toHaveBeenCalledOnce();

        const reservation = await Reservation.findById(res.body._id);
        expect(reservation).toBeTruthy();
        expect(reservation?.user.equals(userId)).toBeTruthy();
        expect(reservation?.car.equals(carId)).toBeTruthy();
        expect(reservation?.date?.start).toStrictEqual(date.start);
        expect(reservation?.date?.end).toStrictEqual(date.end);
        expect(reservation?.status).toBe("pending");
    });

    it("user can't create reservation in the past", async () => {
        vi.spyOn(Reservation, "create");

        const [userId, userToken] = await newUser();

        const res = await request(app)
            .post("/api/reservation")
            .send({ car: carId, date: { start: faker.date.past() } })
            .set("Authorization", userToken);

        expect(res.status).toBe(400);
        expect(res.body.error).toBe("reservation start can't be in the past");
        expect(Reservation.create).not.toHaveBeenCalledOnce();
    });

    it("user can't create reservation ending before start", async () => {
        vi.spyOn(Reservation, "create");

        const [userId, userToken] = await newUser();
        const start = faker.date.soon({ days: 30 });
        const end = faker.date.recent({ days: 10, refDate: start })

        const res = await request(app)
            .post("/api/reservation")
            .send({ car: carId, date: { start, end } })
            .set("Authorization", userToken);

        expect(res.status).toBe(400);
        expect(res.body.error).toBe("reservation end can't be before start");
        expect(Reservation.create).not.toHaveBeenCalledOnce();
    });

    it("user can't create multiple reservations in the same day", async () => {
        vi.spyOn(Reservation, "create");

        const [userId, userToken] = await newUser();

        const start = faker.date.soon({ days: 10 });

        const first = await request(app)
            .post("/api/reservation")
            .send({ car: carId, date: { start } })
            .set("Authorization", userToken);

        const second = await request(app)
            .post("/api/reservation")
            .send({ car: carId, date: { start } })
            .set("Authorization", userToken);

        const third = await request(app)
            .post("/api/reservation")
            .send({ car: carId, date: { start, end: faker.date.soon({ days: 10, refDate: start }) } })
            .set("Authorization", userToken);

        expect(first.status).toBe(200);
        expect(second.status).toBe(400);
        expect(second.body.error).toBe("date already reserved");
        expect(third.status).toBe(400);
        expect(third.body.error).toBe("date already reserved");

        expect(Reservation.create).toHaveBeenCalledOnce();
    });

    it("user can't change reservation status", async () => {
        const [userId, userToken] = await newUser();
        const user = await request(app)
            .post("/api/reservation")
            .send({ car: carId, date: fakeDate() })
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
            .send({ car: carId, date: fakeDate() })
            .set("Authorization", userToken);

        const accepted = await request(app)
            .patch(`/api/reservation/status/${user.body._id}`)
            .send({ status: "accepted" })
            .set("Authorization", adminToken);

        expect(accepted.status).toBe(200);

        const reservation = await Reservation.findById(user.body._id);
        expect(reservation?.status).toBe("accepted");
    });

    it("user change reservation date", async () => {
        const [userId, userToken] = await newUser();
        const user = await request(app)
            .post("/api/reservation")
            .send({ car: carId, date: fakeDate() })
            .set("Authorization", userToken);

        const edit = fakeDate();
        const res = await request(app)
            .patch(`/api/reservation/date/${user.body._id}`)
            .send({ start: edit.start, end: edit.end })
            .set("Authorization", userToken);

        expect(res.status).toBe(200);

        const reservation = await Reservation.findById(user.body._id);
        console.log(reservation);
        expect(reservation?.date?.start).toStrictEqual(edit.start);
        expect(reservation?.date?.end).toStrictEqual(edit.end);
    });

    it("admin can't change reservation date", async () => {
        const [userId, userToken] = await newUser();
        const date = fakeDate();
        const user = await request(app)
            .post("/api/reservation")
            .send({ car: carId, date })
            .set("Authorization", userToken);

        const accepted = await request(app)
            .patch(`/api/reservation/date/${user.body._id}`)
            .send({ start: faker.date.soon({ days: 10 }) })
            .set("Authorization", adminToken);

        expect(accepted.status).toBe(401);

        const reservation = await Reservation.findById(user.body._id);
        expect(reservation?.date?.start).toStrictEqual(date.start);
        expect(reservation?.date?.end).toStrictEqual(date.end);
    });


    it("user cancel reservation", async () => {
        vi.spyOn(Reservation, "findByIdAndDelete");

        const [userId, userToken] = await newUser();
        const post = await request(app)
            .post("/api/reservation")
            .send({ car: carId, date: fakeDate() })
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
            .send({ car: carId, date: fakeDate() })
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

    it("admin get all reservations", async () => {
        const car = {
            model: faker.vehicle.vehicle(),
            price: faker.number.float({ min: 99.99, max: 99999.99, fractionDigits: 2 })
        };

        const post = await request(app)
            .post("/api/cars")
            .field("json", JSON.stringify(car))
            .set("Authorization", adminToken);

        const carId = post.body._id;

        const [userId, userToken] = await newUser();
        const [userId2, userToken2] = await newUser();

        await request(app)
            .post("/api/reservation")
            .send({ car: carId, date: { start: faker.date.soon({ days: 10 }) } })
            .set("Authorization", userToken);

        await request(app)
            .post("/api/reservation")
            .send({ car: carId, date: { start: faker.date.soon({ days: 10 }) } })
            .set("Authorization", userToken2);

        const res = await request(app)
            .get("/api/reservation/admin")
            .set("Authorization", adminToken);

        expect(res.status).toBe(200);
        expect(res.body.length).toBeGreaterThanOrEqual(2);
    });

    it("user get own reservations", async () => {
        const car = {
            model: faker.vehicle.vehicle(),
            price: faker.number.float({ min: 99.99, max: 99999.99, fractionDigits: 2 })
        };

        const post = await request(app)
            .post("/api/cars")
            .field("json", JSON.stringify(car))
            .set("Authorization", adminToken);

        const carId = post.body._id;

        const [userId, userToken] = await newUser();
        const [userId2, userToken2] = await newUser();

        await request(app)
            .post("/api/reservation")
            .send({ car: carId, date: { start: faker.date.soon({ days: 10 }) } })
            .set("Authorization", userToken);

        await request(app)
            .post("/api/reservation")
            .send({ car: carId, date: { start: faker.date.soon({ days: 10 }) } })
            .set("Authorization", userToken2);

        const res = await request(app)
            .get("/api/reservation/user")
            .set("Authorization", userToken);

        expect(res.status).toBe(200);
        expect(res.body.length).toBe(1);
        expect(res.body[0].user._id).toBe(userId);
    });

    it("admin get all reservations by car", async () => {
        const car = {
            model: faker.vehicle.vehicle(),
            price: faker.number.float({ min: 99.99, max: 99999.99, fractionDigits: 2 })
        };

        const post = await request(app)
            .post("/api/cars")
            .field("json", JSON.stringify(car))
            .set("Authorization", adminToken);

        const carId = post.body._id;

        const [userId, userToken] = await newUser();
        const [userId2, userToken2] = await newUser();

        await request(app)
            .post("/api/reservation")
            .send({ car: carId, date: { start: faker.date.soon({ days: 10 }) } })
            .set("Authorization", userToken);

        await request(app)
            .post("/api/reservation")
            .send({ car: carId, date: { start: faker.date.soon({ days: 10 }) } })
            .set("Authorization", userToken2);

        const res = await request(app)
            .get(`/api/reservation/for/${carId}`)
            .set("Authorization", adminToken);

        expect(res.status).toBe(200);
        expect(res.body.length).toBe(2);
    });

    it("user get own reservations by car", async () => {
        const car = {
            model: faker.vehicle.vehicle(),
            price: faker.number.float({ min: 99.99, max: 99999.99, fractionDigits: 2 })
        };

        const post = await request(app)
            .post("/api/cars")
            .field("json", JSON.stringify(car))
            .set("Authorization", adminToken);

        const carId = post.body._id;

        const [userId, userToken] = await newUser();
        const [userId2, userToken2] = await newUser();

        await request(app)
            .post("/api/reservation")
            .send({ car: carId, date: { start: faker.date.soon({ days: 10 }) } })
            .set("Authorization", userToken);

        await request(app)
            .post("/api/reservation")
            .send({ car: carId, date: { start: faker.date.soon({ days: 10 }) } })
            .set("Authorization", userToken2);

        const res = await request(app)
            .get(`/api/reservation/for/${carId}`)
            .set("Authorization", userToken);

        expect(res.status).toBe(200);
        expect(res.body.length).toBe(1);
        expect(res.body[0].user._id).toBe(userId);
    });
});
