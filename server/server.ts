import "dotenv/config";
import mongoose from "mongoose";
import app from "./app";

if (!process.env.DB) {
    console.error("DB not found in .env");
    process.exit(1);
}
if (!process.env.PORT) {
    console.error("PORT not found in .env");
    process.exit(1);
}

app.use((req, res, next) => {
    console.log(req.method, req.url, req.body);
    next();
});

mongoose.connect(process.env.DB)
    .then(_ => {
        console.log(`connected to ${process.env.DB}`);
        app.listen(process.env.PORT, () => {
            console.log(`listening on http://localhost:${process.env.PORT}`);
        });
    })
    .catch(err => {
        console.error(`error connecting to ${process.env.DB}`);
        console.error(err);
    });
