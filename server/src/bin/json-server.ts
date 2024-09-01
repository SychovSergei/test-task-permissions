import * as jsonServer from "json-server";

const serverJson = jsonServer.create();

const middlewaresJson = jsonServer.defaults();
serverJson.use(middlewaresJson);
serverJson.use(jsonServer.bodyParser);

export default serverJson;
