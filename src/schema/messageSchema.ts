import {z} from 'zod'


export const messageSchema = z.object({
    content : z.string().min(10 , "content must be of atleat 10 characters").max(200 , "content must not exceed 200 characters"),
    username : z.string()
})