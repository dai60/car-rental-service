import express from "express";
import userRoutes from "./routes/userRoutes";
import carRoutes from "./routes/carRoutes";
import reservationRoutes from "./routes/reservationRoutes";

const app = express();
app.use(express.json());
app.use("/public", express.static("public"));

app.use((req, res, next) => {
    console.log(req.method, req.url, req.body);
    next();
});

app.use("/api/cars", carRoutes);
app.use("/api/reservation", reservationRoutes);
app.use("/api/user", userRoutes);

export default app;
