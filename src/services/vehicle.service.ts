import { ITruck } from "../models/vehicle.model";
import { fetchAllTrucks, fetchGetAllTrucks, fetchTruck } from "../repositories/vehicle.repository";

export const getAllTrucks = async (
    id: string
): Promise<{ success: boolean; trucks: any[]; message: string }> => {
    try {
        console.log(id)

        // Call the repository to register the client
        return await fetchGetAllTrucks(id)
    } catch (error) {
        console.error("Error in adding Address:", error)
        throw new Error("Service error while fetching user")
    }
}
export const fetchAllVehicles = async (
    
): Promise<{ success: boolean; vehicles: ITruck[]; message: string }> => {
    try {
        

        // Call the repository to register the client
        return await fetchAllTrucks()
    } catch (error) {
        console.error("Error in adding Address:", error)
        throw new Error("Service error while fetching user")
    }
}
export const fetchTruckById = async (
    id: string
): Promise<{  truck:ITruck | null}> => {
    try {
        console.log(id)

        // Call the repository to register the client
        return await fetchTruck(id)
    } catch (error) {
        console.error("Error in adding Address:", error)
        throw new Error("Service error while fetching user")
    }
}
