
import Company from "../models/company.model"
import { connectRabbitMQ } from "./rabbitMq.services"

const consumeCarrierServiceQueue = async () => {
    const { connection, channel } = await connectRabbitMQ()
    const queue = "carrierServiceQueue"

    await channel.assertQueue(queue, { durable: true })
    console.log("Waiting for messages in queue:", queue)

    channel.consume(queue, async (msg: any) => {
        if (msg !== null) {
            const message = JSON.parse(msg.content.toString())
            console.log("Received message:", message)

            const {
                userId,
                name,
                email,
                companyRefId,
                personalDetails: { emergencyContact },
                companyDetails,
            } = message

            const {
                companyName,
                companyEmail,
                companyPhone,
                taxId,
                address: companyAddress,
            } = companyDetails

            const { addressLine1, addressLine2, city, state, postalCode } =
                companyAddress

            try {
                if (!userId) {
                    throw new Error("Missing userId in message")
                }

                const newCompany = new Company({
                    _id: userId,
                    name,
                    email,
                    companyRefId,
                    address: {
                        addressLine1,
                        addressLine2,
                        city,
                        state,
                        postalCode,
                    },
                    personalDetails: {
                        emergencyContact: {
                            name: emergencyContact.name,
                            phoneNumber: emergencyContact.phoneNumber,
                            address: emergencyContact.address,
                        },
                    },
                    companyDetails: {
                        companyName,
                        companyEmail,
                        companyPhone,
                        taxId,
                        address: {
                            addressLine1,
                            addressLine2,
                            city,
                            state,
                            postalCode,
                        },
                    },
                })

                await newCompany.save()
                console.log("Company data saved:", newCompany)
                channel.ack(msg)
            } catch (error) {
                console.error("Error saving company data:", error)
                channel.nack(msg)
            }
        }
    })
}

consumeCarrierServiceQueue().catch(console.error)
