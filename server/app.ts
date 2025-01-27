import express from "express";
import userRoutes from "./routes/userRoutes";

const app = express();
app.use(express.json());

app.use((req, res, next) => {
    console.log(req.method, req.url, req.body);
    next();
})

app.use("/api/user", userRoutes);

export default app;
