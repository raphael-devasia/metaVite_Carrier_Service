import mongoose, { Schema, Document } from "mongoose"

export interface ITruck extends Document {
    companyRefId: string
    VehicleType: string
    VehicleRegistrationNumber: string
    VehicleColor: string
    VehicleWeight: number
    Status: string
    YearOfManufacture: number
    NumberOfAxles: number
    LicensePlateNumber: string
    VehicleInspectionStatus: string
    MakeAndModel: string
    FuelType: string
    VehicleCapacity: number
    RCOwnerName: string
    ExpiryDate: Date
    InsuranceProvider: string
    PolicyNumber: string
}

const TruckSchema: Schema = new Schema({
    companyRefId: { type: String, required: true },
    VehicleType: { type: String, required: true },
    VehicleRegistrationNumber: { type: String, required: true },
    VehicleColor: { type: String, required: true },
    VehicleWeight: { type: Number, required: true, min: 0 },
    Status: { type: String, required: true, default: "Active" },
    workStatus: { type: String, default: "Idle" },
    YearOfManufacture: { type: Number, required: true },
    NumberOfAxles: { type: Number, required: true, min: 1 },
    LicensePlateNumber: { type: String, required: true },
    VehicleInspectionStatus: { type: String, required: true },
    MakeAndModel: { type: String, required: true },
    FuelType: { type: String, required: true },
    VehicleCapacity: { type: Number, required: true },
    RCOwnerName: { type: String, required: true },
    ExpiryDate: { type: Date, required: true },
    InsuranceProvider: { type: String, required: true },
    PolicyNumber: { type: String, required: true },
    isActive: { type: Boolean, default: true },
})

export default mongoose.model<ITruck>("Truck", TruckSchema)
