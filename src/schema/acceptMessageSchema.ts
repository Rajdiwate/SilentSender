import {z} from 'zod'

export const acceptMessageSchema = z.object({
    acceptMessage  : z.boolean({required_error : " accept message is required"})
})