import dotenv from "dotenv";
import { app } from "./app.js";
import { DBconnection } from "./DB/DBconnection.js";

// --- //

dotenv.config({
  path: "./.env",
});

DBconnection()
  .then(() => {
    app.listen(process.env.PORT, () =>
      console.log(`http://127.0.0.1:${process.env.PORT}`)
    );
  })
  .catch((error) => console.log("DB not connected!", error));
