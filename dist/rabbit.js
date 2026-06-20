"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishReportRequest = publishReportRequest;
exports.consumeReportRequests = consumeReportRequests;
const amqplib_1 = __importDefault(require("amqplib"));
const QUEUE_NAME = 'pdf_generation_queue';
function getRabbitMQUrl() {
    const user = process.env.RABBITMQ_USER || 'guest';
    const password = process.env.RABBITMQ_PASSWORD || 'guest';
    const host = process.env.RABBITMQ_HOST || 'localhost';
    const port = process.env.RABBITMQ_PORT || '5672';
    return `amqp://${user}:${password}@${host}:${port}`;
}
async function getRabbitChannel() {
    const connection = await amqplib_1.default.connect(getRabbitMQUrl());
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });
    return { connection, channel };
}
async function publishReportRequest(payload) {
    const { connection, channel } = await getRabbitChannel();
    try {
        channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(payload)), { persistent: true });
    }
    finally {
        await channel.close();
        await connection.close();
    }
}
async function consumeReportRequests(handler) {
    const { channel } = await getRabbitChannel();
    await channel.consume(QUEUE_NAME, async (msg) => {
        if (!msg)
            return;
        try {
            const payload = JSON.parse(msg.content.toString());
            await handler(payload);
            channel.ack(msg);
        }
        catch (error) {
            console.error('[RabbitMQ] Failed to process message:', error);
            channel.nack(msg, false, false);
        }
    });
    console.log(`[RabbitMQ] Waiting for messages on queue: ${QUEUE_NAME}`);
}
//# sourceMappingURL=rabbit.js.map