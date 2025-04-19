/**
 * Database initialization script
 * This script will initialize the database if it doesn't exist
 */

import Redis from "ioredis";
import config from "../configs/config";
import mongoose from "mongoose";
import amqp from "amqplib";

// Connect to MongoDB
async function initMongoDB() {
  try {
    await mongoose.connect(config.mongoURI);
    console.log("MongoDB connected successfully");

    // Check if the database is empty and create initial collections if needed
    // For example: creating indexes
    console.log("MongoDB initialized successfully");
  } catch (error) {
    console.error("MongoDB initialization failed:", error);
  }
}

// Connect to Redis
async function initRedis() {
  try {
    const redisClient = new Redis({
      host: config.redisHost,
      port: Number(config.redisHost),
      password: config.redisPassword,
    });

    await redisClient.ping();
    console.log("Redis connected successfully");

    // Flush Redis if needed (be careful in production)
    // await redisClient.flushall();

    await redisClient.quit();
    console.log("Redis initialized successfully");
  } catch (error) {
    console.error("Redis initialization failed:", error);
  }
}

// Connect to RabbitMQ and setup queues
async function initRabbitMQ() {
  try {
    const connection = await amqp.connect(config.rabbitMQUrl);
    const channel = await connection.createChannel();

    console.log("RabbitMQ connected successfully");

    // -------------- EMAIL QUEUE SETUP --------------
    // Setup email exchanges
    const emailExchange = "email-exchange";
    const emailRoutingKey = "email.routing.key";
    const emailQueue = "emailQueue";

    const emailDLXExchange = "email-DLX-exchange";
    const emailDLXRoutingKey = "email.DLX.routing.key";
    const emailDLXQueue = "emailDLXQueue";

    const emailRetryExchange = "email-retry-exchange";
    const emailRetryRoutingKey = "email.retry.routing.key";
    const emailRetryQueue = "emailRetryQueue";

    // Create email exchanges
    await channel.assertExchange(emailExchange, "direct", { durable: true });
    await channel.assertExchange(emailDLXExchange, "direct", { durable: true });
    await channel.assertExchange(emailRetryExchange, "direct", {
      durable: true,
    });

    // Create email queues
    await channel.assertQueue(emailRetryQueue, {
      durable: true,
      deadLetterExchange: emailExchange,
      deadLetterRoutingKey: emailRoutingKey,
      messageTtl: 5000,
    });

    await channel.assertQueue(emailQueue, {
      durable: true,
      deadLetterExchange: emailDLXExchange,
      deadLetterRoutingKey: emailDLXRoutingKey,
    });

    await channel.assertQueue(emailDLXQueue, { durable: true });

    // Bind email queues to exchanges
    await channel.bindQueue(
      emailRetryQueue,
      emailRetryExchange,
      emailRetryRoutingKey
    );
    await channel.bindQueue(emailQueue, emailExchange, emailRoutingKey);
    await channel.bindQueue(
      emailDLXQueue,
      emailDLXExchange,
      emailDLXRoutingKey
    );

    console.log("Email queues initialized successfully");

    // -------------- POST QUEUE SETUP --------------
    // Setup post exchanges
    const postExchange = "post-exchange";
    const postRoutingKey = "email.routing.key";
    const postQueue = "postQueue";

    const postExchangeDLX = "post-exchange-dlx";
    const postDLXRoutingKey = "post-dlx.routing.key";

    const postRetryExchange = "post-retry-exchange";
    const postRetryRoutingKey = "post.retry.routing.key";

    // Create post exchanges
    await channel.assertExchange(postExchange, "direct", { durable: true });
    await channel.assertExchange(postExchangeDLX, "direct", { durable: true });
    await channel.assertExchange(postRetryExchange, "direct", {
      durable: true,
    });

    // Create post queues (note: using same retry queue as email for some reason)
    await channel.assertQueue(postQueue, {
      durable: true,
      deadLetterExchange: postExchangeDLX,
      deadLetterRoutingKey: postDLXRoutingKey,
      messageTtl: 10000,
    });

    // Bind post queues to exchanges
    await channel.bindQueue(postQueue, postExchange, postRoutingKey);
    await channel.bindQueue(
      emailRetryQueue,
      postRetryExchange,
      postRetryRoutingKey
    );

    console.log("Post queues initialized successfully");

    // -------------- NOTIFICATION QUEUE SETUP --------------
    // Setup notification exchanges
    const notifiExchange = "notifi-exchange";
    const notifiRoutingKey = "notifi.routing.key";
    const notifiQueue = "notifiQueue";

    const notifiDLXExchange = "notifi-DLX-exchange";
    const notifiDLXRoutingKey = "notifi.DLX.routing.key";
    const notifiDLXQueue = "notifiDLXQueue";

    const notifiRetryExchange = "notifi-retry-exchange";
    const notifiRetryRoutingKey = "notifi.retry.routing.key";
    const notifiRetryQueue = "notifiRetryQueue";

    // Create notification exchanges
    await channel.assertExchange(notifiExchange, "direct", { durable: true });
    await channel.assertExchange(notifiDLXExchange, "direct", {
      durable: true,
    });
    await channel.assertExchange(notifiRetryExchange, "direct", {
      durable: true,
    });

    // Create notification queues
    await channel.assertQueue(notifiRetryQueue, {
      durable: true,
      deadLetterExchange: notifiExchange,
      deadLetterRoutingKey: notifiRoutingKey,
      messageTtl: 5000,
    });

    await channel.assertQueue(notifiQueue, {
      durable: true,
      deadLetterExchange: notifiDLXExchange,
      deadLetterRoutingKey: notifiDLXRoutingKey,
    });

    await channel.assertQueue(notifiDLXQueue, { durable: true });

    // Bind notification queues to exchanges
    await channel.bindQueue(
      notifiRetryQueue,
      notifiRetryExchange,
      notifiRetryRoutingKey
    );
    await channel.bindQueue(notifiQueue, notifiExchange, notifiRoutingKey);
    await channel.bindQueue(
      notifiDLXQueue,
      notifiDLXExchange,
      notifiDLXRoutingKey
    );

    console.log("Notification queues initialized successfully");

    // -------------- LEGACY NOTIFICATION QUEUE SETUP (Keep compatibility) --------------
    const notificationExchange = "notification-ex";
    const notificationRoutingKey = "notification-routing-key";
    const notificationQueue = "notificationQueue";

    const notificationExchangeDLX = "notification-exDLX";
    const notificationRoutingkeyDLX = "notification-routingkey-DLX";
    const notificationQueueHandler = "notificationQueueHandler";

    // Create legacy notification exchanges
    await channel.assertExchange(notificationExchange, "direct", {
      durable: true,
    });
    await channel.assertExchange(notificationExchangeDLX, "direct", {
      durable: true,
    });

    // Create legacy notification queues
    await channel.assertQueue(notificationQueue, {
      durable: true,
      arguments: {
        "x-dead-letter-exchange": notificationExchangeDLX,
        "x-dead-letter-routing-key": notificationRoutingkeyDLX,
      },
    });

    await channel.assertQueue(notificationQueueHandler, { durable: true });

    // Bind legacy notification queues
    await channel.bindQueue(
      notificationQueue,
      notificationExchange,
      notificationRoutingKey
    );
    await channel.bindQueue(
      notificationQueueHandler,
      notificationExchangeDLX,
      notificationRoutingkeyDLX
    );

    console.log("Legacy notification queues initialized successfully");

    await channel.close();
    await connection.close();
    console.log("RabbitMQ initialization completed successfully");
  } catch (error) {
    console.error("RabbitMQ initialization failed:", error);
  }
}

async function initAll() {
  console.log("Starting database initialization...");
  await initMongoDB();
  await initRedis();
  await initRabbitMQ();
  console.log("Database initialization completed.");
  process.exit(0);
}

initAll();
