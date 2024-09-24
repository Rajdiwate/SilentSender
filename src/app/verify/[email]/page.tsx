"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

export default function VerifyEmailPage({ params }: any) {
  const [verificationCode, setVerificationCode] = useState("");
  const router = useRouter();
  const email = decodeURIComponent(params.email); // to convert %40 into @ again

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:3000/api/verify-code", {
        verifyCode: verificationCode,
        email,
      });

      if (res.data.success) {
        router.push("/home");
        toast({
          variant: "default",
          description: "Verified successfully",
        });
      } else {
        toast({
          variant: "destructive",
          description: "Invalid code",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Invalid code",
      });
    }
  };

  const handleResendCode = () => {
    // Here you would typically handle the logic to resend the verification code
    console.log("Resending verification code");
    // In a real application, you'd call your backend to resend the code
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Verify Your Email</CardTitle>
          <CardDescription>
            Enter the 6-digit code sent to your email.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="verificationCode">Verification Code</Label>
              <Input
                id="verificationCode"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength={6}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Verify
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="link" onClick={handleResendCode}>
            Resend Code
          </Button>
        </CardFooter>
      </Card>
      <Toaster/>
    </div>
  );
}
