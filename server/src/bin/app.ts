import express from "express";
import { Express } from "express";
import cors from "cors";

import errorMiddleware from "../middleware/error-middleware";
import router from "../routes/index";
import { getRouter } from "../routes/json-router";
import serverJson from "./json-server";

const app: Express = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

app.use(cors());

serverJson.use("/api-json", (req, res, next) => {
  const routerJson = getRouter();
  routerJson(req, res, next);
});

app.use("/api", router);

app.get("/", (req, res) => {
  res.send("Server is working!");
});

/** mist be last middleware */
app.use(errorMiddleware);

serverJson.listen(process.env.PORT_JSON, () => {
  console.log("Server JSON ready on port", process.env.PORT_JSON);
});

export default app;
