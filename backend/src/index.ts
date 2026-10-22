import http from "http";
import express from "express";
import "./config/logging";
import "reflect-metadata";
import helmet from "helmet";
import cors from "cors";

import { corsHandler, loggingHandler, route404 } from "./middleware";
import { server, testConnection } from "./config";
import { defineRoutes } from "./modules/routes";
import {
  CategoryController,
  ChapterController,
  MainController,
  ProductController,
  SalesController,
  TermController,
  TermLineController,
  UserController,
  UserLineController,
  UserTermController,
  AuthController,
  GooglePayController
} from "./controllers";
import StorageController from "./controllers/storageController";

export const app = express();
export let httpServer: ReturnType<typeof http.createServer>;

export const Main = async () => {
  logging.log("----------------------------------------");
  logging.log("Initializing API");
  logging.log("----------------------------------------");
  // Behind Render's proxy: use the real client IP for rate limiting.
  app.set("trust proxy", 1);
  app.use(helmet());
  app.use(corsHandler);
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  logging.log("----------------------------------------");
  logging.log("Connect to Mysql");
  logging.log("----------------------------------------");
  await testConnection();

  logging.log("----------------------------------------");
  logging.log("Logging & Configuration");
  logging.log("----------------------------------------");
  app.use(loggingHandler);

  logging.log("----------------------------------------");
  logging.log("Define Controller Routing");
  logging.log("----------------------------------------");
  defineRoutes(
    [
      MainController,
      AuthController,
      UserController,
      CategoryController,
      ChapterController,
      ProductController,
      TermController,
      SalesController,
      TermLineController,
      UserLineController,
      UserTermController,
      GooglePayController,
      StorageController,
    ],
    app,
  );

  logging.log("----------------------------------------");
  logging.log("Registering the 404 (route not found) handler");
  logging.log("----------------------------------------");
  app.use(route404);

  logging.log("----------------------------------------");
  logging.log("Starting Server");
  logging.log("----------------------------------------");
  httpServer = http.createServer(app);
  httpServer.listen(server.SERVER_PORT, () => {
    logging.log("----------------------------------------");
    logging.log(
      `Server started on ${server.SERVER_HOSTNAME}:${server.SERVER_PORT}`,
    );
    logging.log("----------------------------------------");
  });
};

export const Shutdown = (callback: any) =>
  httpServer && httpServer.close(callback);

Main();
