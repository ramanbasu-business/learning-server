import amqp, { Channel, ChannelModel } from 'amqplib';
import { ReportRequestPayload } from '@learning/shared';

const QUEUE_NAME = 'pdf_generation_queue';

function getRabbitMQUrl(): string {
    const user = process.env.RABBITMQ_USER || 'guest';
    const password = process.env.RABBITMQ_PASSWORD || 'guest';
    const host = process.env.RABBITMQ_HOST || 'localhost';
    const port = process.env.RABBITMQ_PORT || '5672';

    return `amqp://${user}:${password}@${host}:${port}`;
}

async function getRabbitChannel(): Promise<{ connection: ChannelModel; channel: Channel }> {
    const connection = await amqp.connect(getRabbitMQUrl());
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });
    return { connection, channel };
}

export async function publishReportRequest(payload: ReportRequestPayload): Promise<void> {
    const { connection, channel } = await getRabbitChannel();

    try {
        channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(payload)), { persistent: true });
    } finally {
        await channel.close();
        await (connection as unknown as { close: () => Promise<void> }).close();
    }
}

export async function consumeReportRequests(
    handler: (payload: ReportRequestPayload) => Promise<void>
): Promise<void> {
    const { channel } = await getRabbitChannel();

    await channel.consume(QUEUE_NAME, async (msg) => {
        if (!msg) return;

        try {
            const payload = JSON.parse(msg.content.toString()) as ReportRequestPayload;
            await handler(payload);
            channel.ack(msg);
        } catch (error) {
            console.error('[RabbitMQ] Failed to process message:', error);
            channel.nack(msg, false, false);
        }
    });

    console.log(`[RabbitMQ] Waiting for messages on queue: ${QUEUE_NAME}`);
}
