import { AxiosRequestConfig } from "axios";
import "dotenv/config";

export const jsonServerConfig: AxiosRequestConfig<any> = {
  baseURL: `http://localhost:3001`,
  responseType: "json",
  proxy: {
    protocol: "http",
    host: "127.0.0.1",
    port: 3001,
  },
};
