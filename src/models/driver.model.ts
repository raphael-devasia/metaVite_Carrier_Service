import mongoose, { Schema, Document } from "mongoose"
import { ICompany, ICompanyDetails } from "./company.model"

interface IAddress {
    addressLine1: string
    addressLine2?: string
    city: string
    state: string
    postalCode: string
}

interface IEmergencyContact {
    name: string
    phoneNumber: string
}

export interface IDriver extends Document {
    _id: string
    name: {
        firstName: string
        lastName: string
    }
    email: string
    companyRefId: string
    username: string
    role: string
    address: IAddress
    personalDetails: {
        emergencyContact: IEmergencyContact
    }
    companyDetails?: ICompanyDetails // Populated field after lookup
    status: string
    workStatus: string
    isBoardingCompleted: boolean
}

const AddressSchema: Schema = new Schema(
    {
        addressLine1: { type: String, required: true },
        addressLine2: { type: String },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: String, required: true },
    },
    { _id: false }
)

const EmergencyContactSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        phoneNumber: { type: String, required: true },
    },
    { _id: false }
)

const DriverSchema: Schema = new Schema({
    _id: { type: String, required: true },
    name: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
    },
    email: { type: String, required: true },
    companyRefId: { type: String, required: true },
    username: { type: String, required: true },
    role: { type: String, required: true },
    phoneNumber: { type: String },

    personalDetails: {
        emergencyContact: { type: EmergencyContactSchema, required: true },
        address: { type: AddressSchema, required: true },
    },
    status: { type: String, default: "Pending" },
    workStatus: { type: String, default: "Idle" },
    isBoardingCompleted: { type: Boolean, default: false },
    aadharCardNumber: { type: String },
    accountNumber: { type: String },
    contractFile: { type: String }, // File path or base64-encoded string
    idFile: { type: String }, // File path or base64-encoded string
    dateOfBirth: { type: Date },
    driversLicenseExpiry: { type: Date },
    driversLicenseNumber: { type: String },
    shipments: { type: [String], default: [] }, // Added field
    ifscCode: { type: String },
    isActive:{type:Boolean,default:true}
})

export default mongoose.model<IDriver>("Driver", DriverSchema)
