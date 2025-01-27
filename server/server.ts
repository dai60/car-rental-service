import "dotenv/config";
import express from "express";

if (!process.env.PORT) {
    console.error("PORT not found in .env");
    process.exit(1);
}

const app = express();

app.listen(process.env.PORT, () => {
    console.log(`listening on http://localhost:${process.env.PORT}`);
});
