import * as fs from "fs"
const multer = require("multer")

const storage = multer.diskStorage({
    destination: function (req:any, file:any, cb:any) {
        cb(null, "uploads/") // Define your upload path here
    },
    filename: function (req:any, file:any, cb:any) {
        cb(null, Date.now() + "-" + file.originalname) // Make file names unique
    },
})

const upload = multer({ storage: storage })

export class FileStorageService {
    static async uploadFile(file: Buffer): Promise<string> {
        return new Promise((resolve, reject) => {
            const filePath = "uploads/" + Date.now() + ".jpg" // Example for JPG files
            fs.writeFile(filePath, file, (err) => {
                if (err) reject(err)
                resolve(filePath)
            })
        })
    }
}
