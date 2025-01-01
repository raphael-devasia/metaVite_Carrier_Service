import { ServerUnaryCall, sendUnaryData } from "@grpc/grpc-js"
import path from "path"
import { IDriver } from "../models/driver.model"
import { fetchDriverById, getAllCompanyDrivers, getAllDrivers } from "./driver.service"
import { ICompany } from "../models/company.model"
import { fetchCarrierById } from "./carrier.service"
import { registerTruckInfo, updateCarrierInfo, updateDriverInfo, updateTruckInfo } from "../repositories/driver.repository"
import { fetchAllVehicles, fetchTruckById, getAllTrucks } from "./vehicle.service"
import { ITruck } from "../models/vehicle.model"
const grpc = require("@grpc/grpc-js")
const protoLoader = require("@grpc/proto-loader")

// Define paths
const PROTO_PATH = path.join(__dirname, "../../../protos/carrier.proto")
console.log("Resolved proto file path:", PROTO_PATH)

// Load the .proto file with type options
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
})

// Create a typed object from the package definition
const carrierPackage = grpc.loadPackageDefinition(packageDefinition)
    .carrier as any

// Create the gRPC server
const server = new grpc.Server()

server.addService(carrierPackage.CarrierService.service, {
    RegisterUser: {},
    GetDriverInfo: async (
        call: ServerUnaryCall<
            {
                id: string
            },
            {
                success: boolean
                user: IDriver | null
                message: string
            }
        >,
        callback: sendUnaryData<{
            success: boolean
            user: IDriver | null
            message: string
        }>
    ) => {
        try {
            const id = call.request.id

            if (!id) {
                callback(null, {
                    success: false,
                    user: null,
                    message: "User ID is required",
                })
                return
            }

            const user = await fetchDriverById(id)
            console.log("the user result is ", user)

            if (!user) {
                callback(null, {
                    success: false,
                    user: null,
                    message: "User not found",
                })
                return
            }

            callback(null, {
                success: true,
                user,
                message: "User fetched successfully",
            })
        } catch (error) {
            console.error("Error in GetUser:", error)
            callback(null, {
                success: false,
                user: null,
                message: "Failed to fetch user",
            })
        }
    },
    // GetAllCarriers method
    // GetAllCarriers: async (
    //     call: ServerUnaryCall<{}, { success: boolean; carriers: ICompany[] | null; message: string }>,
    //     callback: sendUnaryData<{ success: boolean; carriers: ICompany[] | null; message: string }>
    // ) => {
    //     try {
    //         const carriers = await fetchAllCarriers();

    //         if (!carriers || carriers.length === 0) {
    //             callback(null, {
    //                 success: false,
    //                 carriers: null,
    //                 message: "No carriers found",
    //             });
    //             return;
    //         }

    //         callback(null, {
    //             success: true,
    //             carriers,
    //             message: "Carriers fetched successfully",
    //         });
    //     } catch (error) {
    //         console.error("Error in GetAllCarriers:", error);
    //         callback(null, {
    //             success: false,
    //             carriers: null,
    //             message: "Failed to fetch carriers",
    //         });
    //     }
    // },

    // GetAllDrivers method
    GetAllDrivers: async (
        call: ServerUnaryCall<
            {},
            { success: boolean; drivers: IDriver[] | null; message: string }
        >,
        callback: sendUnaryData<{
            success: boolean
            drivers: IDriver[] | null
            message: string
        }>
    ) => {
        try {
            const drivers = await getAllDrivers()

            console.log("received something", drivers)

            if (!drivers || drivers.length === 0) {
                callback(null, {
                    success: false,
                    drivers: null,
                    message: "No drivers found",
                })
                return
            }

            callback(null, {
                success: true,
                drivers,
                message: "Drivers fetched successfully",
            })
        } catch (error) {
            console.error("Error in GetAllDrivers:", error)
            callback(null, {
                success: false,
                drivers: null,
                message: "Failed to fetch drivers",
            })
        }
    },
    GetAllCompanyDrivers: async (
        call: ServerUnaryCall<
            { id: string },
            { success: boolean; drivers: IDriver[] | null; message: string }
        >,
        callback: sendUnaryData<{
            success: boolean
            drivers: IDriver[] | null
            message: string
        }>
    ) => {
        try {
            console.log("received request")
            const id = call.request.id
            if (!id) {
                callback(null, {
                    success: false,
                    drivers: null,
                    message: "User ID is required",
                })
                return
            }
            const drivers = await getAllCompanyDrivers(id)

            console.log("received something", drivers)

            if (!drivers || drivers.length === 0) {
                callback(null, {
                    success: false,
                    drivers: null,
                    message: "No drivers found",
                })
                return
            }

            callback(null, {
                success: true,
                drivers,
                message: "Drivers fetched successfully",
            })
        } catch (error) {
            console.error("Error in GetAllDrivers:", error)
            callback(null, {
                success: false,
                drivers: null,
                message: "Failed to fetch drivers",
            })
        }
    },

    GetCompanyInfo: async (
        call: ServerUnaryCall<
            {
                companyRefId: string
            },
            {
                user: ICompany | null
            }
        >,
        callback: sendUnaryData<{
            success: boolean
            user: ICompany | null
            message: string
        }>
    ) => {
        try {
            const id = call.request.companyRefId
            console.log("the incomimg id is ", id)

            if (!id) {
                callback(null, {
                    success: false,
                    user: null,
                    message: "User ID is required",
                })
                return
            }

            const user = await fetchCarrierById(id)
            console.log("the data is ", user)

            if (!user) {
                callback(null, {
                    success: false,
                    user: null,
                    message: "User not found",
                })
                return
            }

            callback(null, {
                success: true,
                user,
                message: "User fetched successfully",
            })
        } catch (error) {
            console.error("Error in GetUser:", error)
            callback(null, {
                success: false,
                user: null,
                message: "Failed to fetch user",
            })
        }
    },

    PostDriverOnboarding: async (
        call: ServerUnaryCall<
            {
                id: string
                driver: any
            },
            {
                success: boolean
            }
        >,
        callback: sendUnaryData<{
            success: boolean

            message: string
        }>
    ) => {
        try {
            const id = call.request.id
            const driver = call.request.driver
            console.log("the incomimg id is ", id)
            console.log("the incomimg driver data is ", driver)

            if (!id) {
                callback(null, {
                    success: false,

                    message: "User ID is required",
                })
                return
            }

            const user = await updateDriverInfo(id, driver)
            console.log("the data is ", user)

            if (!user.success) {
                callback(null, {
                    success: false,

                    message: user.message,
                })
                return
            }

            callback(null, {
                success: true,

                message: "Driver Updated successfully",
            })
        } catch (error) {
            console.error("Error in Updating Driver:", error)
            callback(null, {
                success: false,

                message: "Error in Updating Driver",
            })
        }
    },
    updateDriverDetails: async (
        call: ServerUnaryCall<
            {
                id: string
                driver: any
            },
            {
                success: boolean
            }
        >,
        callback: sendUnaryData<{
            success: boolean

            message: string
        }>
    ) => {
        try {
            const id = call.request.id
            const driver = call.request.driver
            console.log("the incomimg id is ", id)
            console.log("the incomimg driver data is ", driver)

            if (!id) {
                callback(null, {
                    success: false,

                    message: "User ID is required",
                })
                return
            }

            const user = await updateDriverInfo(id, driver)
            console.log("the data is ", user)

            if (!user.success) {
                callback(null, {
                    success: false,

                    message: user.message,
                })
                return
            }

            callback(null, {
                success: true,

                message: "Driver Updated successfully",
            })
        } catch (error) {
            console.error("Error in Updating Driver:", error)
            callback(null, {
                success: false,

                message: "Error in Updating Driver",
            })
        }
    },
    PostTruckUpdate: async (
        call: ServerUnaryCall<
            {
                id: string
                truck: any
            },
            {
                success: boolean
            }
        >,
        callback: sendUnaryData<{
            success: boolean

            message: string
        }>
    ) => {
        try {
            const id = call.request.id
            const truck = call.request.truck
            console.log("the incomimg id is ", id)
            console.log("the incomimg truck data is ", truck)

            if (!id) {
                callback(null, {
                    success: false,

                    message: "User ID is required",
                })
                return
            }

            const user = await updateTruckInfo(id, truck)
            console.log("the data is ", user)

            if (!user.success) {
                callback(null, {
                    success: false,

                    message: user.message,
                })
                return
            }

            callback(null, {
                success: true,

                message: "Truck Updated successfully",
            })
        } catch (error) {
            console.error("Error in Updating Truck:", error)
            callback(null, {
                success: false,

                message: "Error in Updating Truck",
            })
        }
    },
    RegisterNewTruck: async (
        call: ServerUnaryCall<
            {
                truck: any
            },
            {
                success: boolean
            }
        >,
        callback: sendUnaryData<{
            success: boolean

            message: string
        }>
    ) => {
        try {
            const truck = call.request.truck

            console.log("the incomimg truck data is ", truck)

            if (!truck) {
                callback(null, {
                    success: false,

                    message: "data  is required",
                })
                return
            }
            delete truck._id
            const user = await registerTruckInfo(truck)
            console.log("the data is ", user)

            if (!user.success) {
                callback(null, {
                    success: false,

                    message: user.message,
                })
                return
            }

            callback(null, {
                success: true,

                message: "Truck Updated successfully",
            })
        } catch (error) {
            console.error("Error in Updating Truck:", error)
            callback(null, {
                success: false,

                message: "Error in Updating Truck",
            })
        }
    },
    GetAllCarrierTrucks: async (
        call: ServerUnaryCall<
            { id: string },
            { success: boolean; trucks: any | null; message: string }
        >,
        callback: sendUnaryData<{
            success: boolean
            trucks: any | null
            message: string
        }>
    ) => {
        try {
            const id = call.request.id
            console.log("the id os ", id)

            const result = await getAllTrucks(id)
            const trucks = result.trucks

            console.log("received something", trucks)

            console.log("received something", trucks)

            if (!trucks || trucks.length === 0) {
                callback(null, {
                    success: false,
                    trucks: null,
                    message: "No clients found",
                })
                return
            }

            callback(null, {
                success: true,
                trucks,
                message: "Clients fetched successfully",
            })
        } catch (error) {
            console.error("Error in GetAllClients:", error)
            callback(null, {
                success: false,
                trucks: null,
                message: "Failed to fetch clients",
            })
        }
    },
    fetchTruckData: async (
        call: ServerUnaryCall<
            {
                id: string
            },
            {
                truck: ITruck | null
            }
        >,
        callback: sendUnaryData<{
            success: boolean
            truck: any | null
            message: string
        }>
    ) => {
        try {
            const id = call.request.id
            console.log("the incomimg id is ", id)

            if (!id) {
                callback(null, {
                    success: false,
                    truck: null,
                    message: "Truck ID is required",
                })
                return
            }

            const truck = await fetchTruckById(id)
            console.log("the data is ", truck.truck)

            if (!truck) {
                callback(null, {
                    success: false,
                    truck: null,
                    message: "Truck not found",
                })
                return
            }

            callback(null, {
                success: true,
                truck: truck.truck,
                message: "Truck fetched successfully",
            })
        } catch (error) {
            console.error("Error in GetTruck:", error)
            callback(null, {
                success: false,
                truck: null,
                message: "Failed to fetch truck",
            })
        }
    },

    // GetAllVehicles method
    GetAllVehicles: async (
        call: ServerUnaryCall<
            {},
            { success: boolean; vehicles: ITruck[] | null; message: string }
        >,
        callback: sendUnaryData<{
            success: boolean
            vehicles: ITruck[] | null
            message: string
        }>
    ) => {
        try {
            // Ensure fetchAllVehicles returns Promise<ITruck[]>
            const trucks = await fetchAllVehicles()
            let vehicles
            if (trucks.success) {
                vehicles = trucks.vehicles
            }

            if (!vehicles || vehicles.length === 0) {
                callback(null, {
                    success: false,
                    vehicles: [],
                    message: "No vehicles found",
                })
                return
            }

            callback(null, {
                success: true,
                vehicles: trucks.vehicles,
                message: "Vehicles fetched successfully",
            })
        } catch (error) {
            console.error("Error in GetAllVehicles:", error)
            callback(null, {
                success: false,
                vehicles: [],
                message: "Failed to fetch vehicles",
            })
        }
    },
    UpdateCarrierResources: async (
        call: ServerUnaryCall<
            {
                
                bid: any
            },
            {
                success: boolean
            }
        >,
        callback: sendUnaryData<{
            success: boolean

            message: string
        }>
    ) => {
        try {
            
            const bid = call.request.bid
            
            console.log("the incomimg bid data is ", bid)

            if (!bid) {
                callback(null, {
                    success: false,

                    message: "User Bid is required",
                })
                return
            }

            const user = await updateCarrierInfo(bid)
            console.log("the data is ", user)

            if (!user.success) {
                callback(null, {
                    success: false,

                    message: user.message,
                })
                return
            }

            callback(null, {
                success: true,

                message: "Bid Updated successfully",
            })
        } catch (error) {
            console.error("Error in Updating Bid:", error)
            callback(null, {
                success: false,

                message: "Error in Updating Bid",
            })
        }
    },

    
})


// Start the gRPC server
server.bindAsync(
    "0.0.0.0:3002",
    grpc.ServerCredentials.createInsecure(),
    () => {
        console.log("Auth Service gRPC server running at http://0.0.0.0:3002")
        server.start()
    }
)
