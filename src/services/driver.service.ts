import Driver, { IDriver } from "../models/driver.model"
import { getCompanyDrivers, getDrivers, getUserById, IDriverRepository, saveDriverToDB } from "../repositories/driver.repository"
import { ICompanyRepository } from "./company.service"

export const handleDriverMessage = async (message: any) => {
    const {
        userId,
        name,
        email,
        username,
        
        role,
        companyRefId,
        personalDetails: { emergencyContact, address },
    } = message

    if (!userId) {
        throw new Error("Missing userId in message")
    }

    const newDriver = new Driver({
        _id: userId,
        name,
        email,
        username,
        role,
        
         companyRefId,
        personalDetails: {
            emergencyContact: {
                name: emergencyContact.name,
                phoneNumber: emergencyContact.phoneNumber,
            },
            address: {
                addressLine1: address.addressLine1,
                addressLine2: address.addressLine2,
                city: address.city,
                state: address.city,
                postalCode: address.postalCode,
            },
        },
    })


     await saveDriverToDB(newDriver)
    console.log("Driver data saved:", newDriver)
}
export const fetchDriverById = async (id: string): Promise<IDriver | null> => {
    try {
        
        
        // Call the repository to get the user
        return await getUserById(id)
    } catch (error) {
        console.error("Error in fetchDriverById service:", error)
        throw new Error("Service error while fetching user")
    }
}
export const getAllDrivers = async (): Promise<IDriver []| null> => {
    try {
        // Call the repository to get the user
        return await getDrivers()
    } catch (error) {
        console.error("Error in fetchDriverById service:", error)
        throw new Error("Service error while fetching user")
    }
}
export const getAllCompanyDrivers = async (id:string): Promise<IDriver[] | null> => {
    try {
        // Call the repository to get the user
        return await getCompanyDrivers(id)
    } catch (error) {
        console.error("Error in fetchDriverById service:", error)
        throw new Error("Service error while fetching user")
    }
}


