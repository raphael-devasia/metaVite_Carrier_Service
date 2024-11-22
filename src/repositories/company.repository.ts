import Company,{ ICompany } from "../models/company.model"


export const createCompany = async (companyData: ICompany) => {
    const newCompany = new Company(companyData)
    return await newCompany.save()
}
