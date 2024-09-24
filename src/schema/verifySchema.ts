import {z} from 'zod'

export const verifySchema = z.object({
    email : z.string().email("Invalid email"),
    code : z.string().length(6 , "code should be 6 digits")
})