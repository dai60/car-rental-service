import express from "express";
import userRoutes from "./routes/userRoutes";
import equipmentRoutes from "./routes/equipmentRoutes";
import reservationRoutes from "./routes/reservationRoutes";

const app = express();
app.use(express.json());

app.use((req, res, next) => {
    console.log(req.method, req.url, req.body);
    next();
});

app.use("/api/equipment", equipmentRoutes);
app.use("/api/reservation", reservationRoutes);
app.use("/api/user", userRoutes);

export default app;
