import express from "express";
import { Express } from "express";

import * as jsonServer from "json-server";
import cors from "cors";
import errorMiddleware from "../middleware/error-middleware";
import router from "../routes";

const app: Express = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

app.use(cors());

const jsonServerMiddlewares = jsonServer.defaults();
app.use(jsonServerMiddlewares);

/** ALL ROUTES */
app.use("/api", router);

app.get("/", (req, res) => {
  res.send("Server is working!");
});

/** mist be last middleware */
app.use(errorMiddleware);

export default app;
