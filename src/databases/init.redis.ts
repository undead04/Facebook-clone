import Redis from "ioredis";
import config from "../configs/config";
const redisClient = new Redis({
  host: config.redisHost,
  port: config.redisPort,
  password: config.redisPassword,
});

redisClient.ping(function (err, result) {
  console.log(result);
});

redisClient.on("connect", () => {
  console.log("Redis connected");
});

redisClient.on("error", (err) => {
  console.error("Redis error: ", err);
});

export default redisClient;
