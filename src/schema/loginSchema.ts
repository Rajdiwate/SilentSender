import { z } from "zod";

export const loginSchema = z.object({
    username : z.string({required_error : "username is required" , invalid_type_error : 
        "Username must be String"
    }),
    password : z.string({required_error : "password is required"}).min(8 , "Password should be more than 8 characters"),

})