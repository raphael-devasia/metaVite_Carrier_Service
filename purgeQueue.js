const amqp  = require("amqplib")

const purgeQueue = async (queueName) => {
    try {
        const connection = await amqp.connect("amqp://localhost")
        const channel = await connection.createChannel()
        await channel.assertQueue(queueName, { durable: true })
        await channel.purgeQueue(queueName)
        console.log(`Queue ${queueName} purged successfully`)
        await channel.close()
        await connection.close()
    } catch (error) {
        console.error(`Error purging queue ${queueName}:`, error)
    }
}

// Usage example
purgeQueue("carrierServiceQueue")
