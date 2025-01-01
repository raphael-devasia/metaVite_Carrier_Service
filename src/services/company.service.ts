import Company, { ICompany } from "../models/company.model"
export interface ICompanyRepository {
    getAllDrivers(): Promise<ICompany[]>
    getDriverById(id: string): Promise<ICompany | null>
}

export const handleCarrierAdminMessage = async (message: any) => {
    const { userId, name, email, companyRefId, companyDetails } = message

    const {
        companyName,
        companyEmail,
        companyPhone,
        taxId,
        address: companyAddress,
    } = companyDetails

    const { addressLine1, addressLine2, city, state, postalCode } =
        companyAddress

    if (!userId) {
        throw new Error("Missing userId in message")
    }

    const newCompany = new Company({
        _id: userId,
        name,
        email,
        companyRefId,
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
}
