import Truck, { ITruck } from "../models/vehicle.model"

export const fetchGetAllTrucks = async (
    id: string
): Promise<{ success: boolean; trucks: any[]; message: string }> => {
    try {
        console.log("Fetching trucks for company ID:", id)

        // Find trucks by companyRefId
        const trucks = await Truck.find({
            companyRefId: id,
            isActive: { $ne: false },
        })

        if (trucks.length === 0) {
            console.log("No trucks found for the given company ID.")
            return {
                success: true,
                message: "No trucks found for the given company ID.",
                trucks: [],
            }
        }

        console.log("Fetched truck details:", trucks)

        return {
            success: true,
            message: "Trucks fetched successfully.",
            trucks, // Returning the array of truck details
        }
    } catch (error) {
        console.error("Error fetching trucks:", error)
        return {
            success: false,
            message: "Failed to fetch trucks from the database.",
            trucks: [],
        }
    }
}

export const fetchAllTrucks = async (
    
): Promise<{ success: boolean; vehicles: any[]; message: string }> => {
    try {
       

        // Find trucks by companyRefId
        const vehicles = await Truck.find({ isActive: { $ne: false }})

        if (vehicles.length === 0) {
            console.log("No vehicles found ")
            return {
                success: true,
                message: "No vehicles found for the given company ID.",
                vehicles: [],
            }
        }

        console.log("Fetched truck details:", vehicles)

        return {
            success: true,
            message: "Vehicles fetched successfully.",
            vehicles, // Returning the array of truck details
        }
    } catch (error) {
        console.error("Error fetching vehicles:", error)
        return {
            success: false,
            message: "Failed to fetch vehicles from the database.",
            vehicles: [],
        }
    }
}
export const fetchTruck = async (id:string): Promise<{
    
    truck:ITruck |null
    
}> => {
    try {
        console.log(id);
        
        // Find trucks by companyRefId
        const truck = await Truck.findById(id)
        console.log(truck);
        
        if (!truck) {
            console.log("No truck found ")
            return {
                
                truck:null,
            }
        }

        console.log("Fetched truck details:", truck)

        return {
            
            truck, // Returning the array of truck details
        }
    } catch (error) {
        console.error("Error fetching truck:", error)
        return {
            
            truck:null,
        }
    }
}


