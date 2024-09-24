import { resend } from "./resend";
import VerificationEmail from "@/lib/emails/verificationEmail";
import { ApiResponse } from "./types/ApiResponse";


export async function sendVerificationEmail(email : string , username : string , verifyCode : string) : Promise<ApiResponse>{
    try {
        const { data, error } = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: ' TrueFeedback Verification Code ',
            react: VerificationEmail({username , otp:verifyCode }),
          });

        return {
            success : true,
            message : " verification email sent successfully"
        }
    } catch (error) {
            console.error("Error in sending verification email" , error)
            return {
                success : false,
                message : "failed to send verification email"
            }
    }
}