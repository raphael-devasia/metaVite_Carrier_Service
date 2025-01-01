import { FileStorageService } from "../controllers/driver.controller"
import Driver, { IDriver } from "../models/driver.model"
import  Truck  from "../models/vehicle.model" 
import Company, { ICompany } from "../models/company.model"
import { getCarrierById } from "./company.repository"
export interface IDriverRepository {
    getAllDrivers(): Promise<IDriver[]>
    getDriverById(id: string): Promise<IDriver | null>
}
// export const getUserById = async (id: string): Promise<IDriver | null> => {
//     try {
//         // Log the ID being queried
//         console.log("Fetching user with ID:", id)

//         // Query the database for the driver with the given ID
//         const user: any = await Driver.findById(id).exec()
       

//         if (!user) {
//             console.log("No user found with the given ID.")
//             return null
//         }

//         // Fetch company details using the companyRefId
//         const company: any = await getCarrierById(user.companyRefId)
       

//         if (company && company.companyDetails) {
//             // Ensure user.companyDetails is initialized
//             user.companyDetails = user.companyDetails || {}
// console.log(user);

//             // Merge company details into driver's company information where fields are empty
//             user.companyDetails = {
//                 companyName:
//                     user.companyDetails.companyName ||
//                     company.companyDetails.companyName,
//                 companyEmail:
//                     user.companyDetails.companyEmail ||
//                     company.companyDetails.companyEmail,
//                 companyPhone:
//                     user.companyDetails.companyPhone ||
//                     company.companyDetails.companyPhone,
//                 taxId:
//                     user.companyDetails.taxId || company.companyDetails.taxId,
//                 address: {
//                     addressLine1:
//                         user.companyDetails.address?.addressLine1 ||
//                         company.companyDetails.address.addressLine1,
//                     addressLine2:
//                         user.companyDetails.address?.addressLine2 ||
//                         company.companyDetails.address.addressLine2,
//                     city:
//                         user.companyDetails.address?.city ||
//                         company.companyDetails.address.city,
//                     state:
//                         user.companyDetails.address?.state ||
//                         company.companyDetails.address.state,
//                     postalCode:
//                         user.companyDetails.address?.postalCode ||
//                         company.companyDetails.address.postalCode,
//                 },
//             }
//         } else {
//             console.log(
//                 "No company details found for companyRefId:",
//                 user.companyRefId
//             )
//         }

//         // Log the updated user object
//         // console.log("Updated user with company details:", user)

//         // Return the updated user object
//         return user as IDriver
//     } catch (error) {
//         console.error("Error fetching user:", error)
//         throw new Error("Failed to fetch user data")
//     }
// }


// export const getUserById = async (id: string): Promise<IDriver | null> => {
//     try {

//         // Query the database for the user with the given ID
//         console.log(" from the repository ", id);

//         const user = await Driver.findById(id)
//         console.log(user)

//         // Return the user data if found, otherwise null
//         return user ? (user as IDriver) : null
//     } catch (error) {
//         console.error("Error fetching user:", error)
//         throw new Error("Failed to fetch user data")
//     }
// }

// export const getUserById = async (id: string): Promise<IDriver | null> => {
//     try {
//         // Log the ID being queried
//         console.log("Fetching user with ID:", id)

//         // Query the database for the user with the given ID
//         const user:any = await Driver.findById(id).exec() // Adding exec() for better readability with Promises
        
//         // Log the result of the query
//         console.log("User found:", user)

//         // Return the user data if found, otherwise null
//         return user ? (user as IDriver) : null
//     } catch (error) {
//         console.error("Error fetching user:", error)
//         throw new Error("Failed to fetch user data")
//     }
// }



export const getUserById = async (id: string): Promise<IDriver | null> => {
    try {
        // Log the ID being queried
        console.log("Fetching user with ID:", id)

        // Use aggregate with $lookup to join the Company details
        const user: any = await Driver.aggregate([
            { $match: { _id: id } },
            {
                $lookup: {
                    from: "companies", // The collection to join
                    localField: "companyRefId", // Field from the Driver collection
                    foreignField: "companyRefId", // Field from the Company collection
                    as: "companyDetails", // Alias for the joined data
                },
            },
            {
                $unwind: {
                    path: "$companyDetails",
                    preserveNullAndEmptyArrays: true,
                },
            },
        ]).exec()

        if (!user || user.length === 0) {
            console.log("No user found with the given ID.")
            return null
        }

        // Log the updated user object
        

        // Return the updated user object
        return user[0] as IDriver
    } catch (error) {
        console.error("Error fetching user:", error)
        throw new Error("Failed to fetch user data")
    }
}

export const saveDriverToDB = async (driverData: IDriver): Promise<void> => {
    try {
        const newDriver = new Driver(driverData)
        await newDriver.save()
        console.log("Driver saved to database:", driverData)
    } catch (error) {
        console.error("Error saving driver to database:", error)
        throw new Error("Failed to save driver to database")
    }
}

// export const getDrivers = async (): Promise<IDriver[] | null> => {
//     try {

//         // Query the database for the user with the given ID
//         const user = await Driver.find().exec() // Adding exec() for better readability with Promises

//         // Log the result of the query
//         console.log("User found:", user)

//         // Return the user data if found, otherwise null
//         return user ? (user as IDriver[]) : null
//     } catch (error) {
//         console.error("Error fetching user:", error)
//         throw new Error("Failed to fetch user data")
//     }
// }
export const getDrivers = async (): Promise<IDriver[] | null> => {
    try {
        const drivers = await Driver.aggregate([
            {
                $lookup: {
                    from: "companies", // Collection name for companies
                    localField: "companyRefId",
                    foreignField: "companyRefId",
                    as: "companyDetails",
                },
            },
            {
                $unwind: {
                    path: "$companyDetails",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    email: 1,
                    companyRefId: 1,
                    personalDetails: 1,
                    isBoardingCompleted:1,
                    workStatus:1,
                    username: 1,
                    status: 1,
                    role: 1,
                    companyDetails: {
                        companyName:
                            "$companyDetails.companyDetails.companyName",
                        companyEmail:
                            "$companyDetails.companyDetails.companyEmail",
                        companyPhone:
                            "$companyDetails.companyDetails.companyPhone",
                        taxId: "$companyDetails.companyDetails.taxId",
                        address: "$companyDetails.address",
                        companyRefId: "$companyDetails.companyRefId",
                    },
                },
            },
        ])
        
        console.log('the fetched driver is ',drivers[1]);
        

        return drivers as IDriver[]
    } catch (error) {
        console.error("Error fetching drivers with company info:", error)
        throw new Error("Failed to fetch drivers")
    }
}
export const updateDriverInfo = async (
    id: string,
    updatedData: any
): Promise<{ success: boolean; message: string }> => {
    try {
        //   const { contractFile, idFile } = updatedData;
        //   if (contractFile && idFile) {
        //     const contractFilePath = await FileStorageService.uploadFile(contractFile);
        //     const idFilePath = await FileStorageService.uploadFile(idFile);

        //     updatedData.contractFile = contractFilePath;
        //     updatedData.idFile = idFilePath;}

        // Handle inactive status separately
        if (updatedData.isActive === false) {
            const deactivationResult = await Driver.findByIdAndUpdate(
                id,
                { $set: { isActive: false } },
                { new: true }
            )

            if (deactivationResult) {
                console.log(
                    "Driver deactivated successfully:",
                    deactivationResult
                )
                return {
                    success: true,
                    message: "Driver deactivated successfully",
                }
            } else {
                console.log("Driver not found for deactivation:", id)
                return {
                    success: false,
                    message: "Driver not found for deactivation",
                }
            }
        }

        // Find the driver by ID and update the fields
        const result = await Driver.findByIdAndUpdate(
            id, // ID of the driver to update
            {
                // Fields to update
                $set: {
                    name: {
                        firstName: updatedData.firstName,
                        lastName: updatedData.lastName,
                    },
                    personalDetails: {
                        emergencyContact: {
                            name: updatedData.emergencyContactName,
                            phoneNumber: updatedData.emergencyNumber,
                        },
                        address: {
                            addressLine1: updatedData.addressLine1,
                            addressLine2: updatedData.addressLine2,
                            city: updatedData.city,
                            postalCode: updatedData.postalCode,
                            state: updatedData.state,
                        },
                    },
                    aadharCardNumber: updatedData.aadharCardNumber,
                    accountNumber: updatedData.accountNumber,
                    contractFile: updatedData.contractFile, // Handle file upload separately
                    idFile: updatedData.idFile, // Handle file upload separately
                    dateOfBirth: updatedData.dateOfBirth,
                    driversLicenseExpiry: updatedData.driversLicenseExpiry,
                    driversLicenseNumber: updatedData.driversLicenseNumber,
                    phoneNumber: updatedData.phoneNumber,
                    ifscCode: updatedData.ifscCode,
                    status: updatedData.status || "Pending",
                    workStatus: updatedData.workStatus || "Idle",
                    isBoardingCompleted: true,
                },
            },
            { new: true, runValidators: true } // Options: return updated doc & validate
        )

        if (result) {
            console.log("Driver updated successfully:", result)
            return { success: true, message: "Driver updated successfully" }
        } else {
            console.log("Driver not found with the given ID:", id)
            return {
                success: false,
                message: "Driver not found with the given ID",
            }
        }
    } catch (error) {
        console.error("Error updating driver:", error)
        return {
            success: false,
            message: "Error updating driver",
        }
    }
}
export const updateTruckInfo = async (
    id: string,
    updatedData: any
): Promise<{ success: boolean; message: string }> => {
    try {
        console.log("data is reaching here", id, updatedData)

        // Handle inactive status separately
        if (updatedData.isActive === false) {
            const deactivationResult = await Truck.findByIdAndUpdate(
                id,
                { $set: { isActive: false } },
                { new: true }
            )

            if (deactivationResult) {
                console.log(
                    "Truck deactivated successfully:",
                    deactivationResult
                )
                return {
                    success: true,
                    message: "Truck deactivated successfully",
                }
            } else {
                console.log("Truck not found for deactivation:", id)
                return {
                    success: false,
                    message: "Truck not found for deactivation",
                }
            }
        }

        // Find the truck by ID and update the fields
        const result = await Truck.findByIdAndUpdate(
            id, // ID of the truck to update
            {
                // Fields to update
                $set: {
                    companyRefId: updatedData.companyRefId,
                    VehicleType: updatedData.VehicleType,
                    VehicleRegistrationNumber:
                        updatedData.VehicleRegistrationNumber,
                    VehicleColor: updatedData.VehicleColor,
                    VehicleWeight: updatedData.VehicleWeight,
                    Status: updatedData.Status,
                    YearOfManufacture: updatedData.YearOfManufacture,
                    NumberOfAxles: updatedData.NumberOfAxles,
                    LicensePlateNumber: updatedData.LicensePlateNumber,
                    VehicleInspectionStatus:
                        updatedData.VehicleInspectionStatus,
                    MakeAndModel: updatedData.MakeAndModel,
                    FuelType: updatedData.FuelType,
                    VehicleCapacity: updatedData.VehicleCapacity,
                    RCOwnerName: updatedData.RCOwnerName,
                    ExpiryDate: updatedData.ExpiryDate, // Ensure date is in the correct format
                    InsuranceProvider: updatedData.InsuranceProvider,
                    PolicyNumber: updatedData.PolicyNumber,
                },
            },
            { new: true, runValidators: true } // Options: return updated doc & validate
        )

        if (result) {
            console.log("Truck updated successfully:", result)
            return { success: true, message: "Truck updated successfully" }
        } else {
            console.log("Truck not found with the given ID:", id)
            return {
                success: false,
                message: "Truck not found with the given ID",
            }
        }
    } catch (error) {
        console.error("Error updating truck:", error)
        return {
            success: false,
            message: "Error updating truck",
        }
    }
}


export const registerTruckInfo = async (
    truck: any
): Promise<{ success: boolean; message: string }> => {
    try {
        const { companyRefId } = truck
        console.log("Company Reference ID:", companyRefId)

        if (!companyRefId) {
            return {
                success: false,
                message: "Company reference ID is not available",
            }
        }

        // Create a new Truck instance and save to the database
        const newTruck = new Truck(truck)
        await newTruck.save()
        console.log("Truck saved to database:", newTruck)

        return {
            success: true,
            message: "Truck registered successfully",
        }
    } catch (error) {
        console.error("Error registering truck:", error)
        return {
            success: false,
            message: "Error registering truck",
        }
    }
}
export const updateCarrierInfo = async (

    bid: any
): Promise<{ success: boolean; message: string }> => {
    try {
        const { vehicle, driver, companyRefId, loadRefId } = bid

        // Update truck's workStatus to 'Assigned'
        const truckUpdate = await Truck.findByIdAndUpdate(
            vehicle,
            { $set: { workStatus: "Assigned" } },
            { new: true, runValidators: true }
        )

        if (!truckUpdate) {
            console.log("Truck not found with the given ID:", vehicle)
            return {
                success: false,
                message: "Truck not found with the given ID",
            }
        }

        // Update driver's workStatus to 'Assigned'
        const driverUpdate = await Driver.findByIdAndUpdate(
            driver,
            {
                $set: { workStatus: "Assigned" },
                $push: { shipments: loadRefId },
            },
            { new: true, runValidators: true }
        )

        if (!driverUpdate) {
            console.log("Driver not found with the given ID:", driver)
            return {
                success: false,
                message: "Driver not found with the given ID",
            }
        }

        // Push loadRefId to the company's shipments array
        const companyUpdate = await Company.findOneAndUpdate(
            { companyRefId:companyRefId },
            { $push: { shipments: loadRefId } },
            { new: true, runValidators: true }
        )

        if (!companyUpdate) {
            console.log("Company not found with the given ID:", companyRefId)
            return {
                success: false,
                message: "Company not found with the given ID",
            }
        }

        console.log("Truck, driver, and company updated successfully")
        return {
            success: true,
            message: "Carrier information updated successfully",
        }
    } catch (error) {
        console.error("Error updating carrier information:", error)
        return { success: false, message: "Error updating carrier information" }
    }
}





export const getCompanyDrivers = async (id: string): Promise<IDriver[] | null> => {
    try {
        // Log the ID being queried
        console.log("Fetching user with ID:", id)

        // Use aggregate with $lookup to join the Company details
        const drivers: any = await Driver.aggregate([
            { $match: { companyRefId: id, isActive: { $ne: false } } },

            {
                $lookup: {
                    from: "companies", // The collection to join
                    localField: "companyRefId", // Field from the Driver collection
                    foreignField: "companyRefId", // Field from the Company collection
                    as: "companyDetails", // Alias for the joined data
                },
            },
            {
                $unwind: {
                    path: "$companyDetails",
                    preserveNullAndEmptyArrays: true,
                },
            },
        ]).exec()

        if (!drivers || drivers.length === 0) {
            console.log("No user found with the given ID.")
            return null
        }

        // Log the updated user object

        // Return the updated user object
        return drivers as IDriver[]
    } catch (error) {
        console.error("Error fetching user:", error)
        throw new Error("Failed to fetch user data")
    }
}

