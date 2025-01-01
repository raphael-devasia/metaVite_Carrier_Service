import Company, { ICompany } from "../models/company.model"

export const createCompany = async (companyData: ICompany) => {
    const newCompany = new Company(companyData)
    return await newCompany.save()
}

export const getCarrierById = async (id: string): Promise<ICompany | null> => {
    try {
        // Log the ID being queried
        console.log("Fetching carrier with ID:", id)

        // Query the database for the user with the given ID
        let user = await Company.findById(id).exec() // Adding exec() for better readability with Promises
        if (!user) {
            user = await Company.findOne({ companyRefId: id })
        }

        // Log the result of the query

        // Return the user data if found, otherwise null
        return user ? (user as ICompany) : null
    } catch (error) {
        console.error("Error fetching user:", error)
        throw new Error("Failed to fetch user data")
    }
}

