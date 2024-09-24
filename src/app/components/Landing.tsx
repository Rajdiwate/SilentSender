'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'


const messages = [
  { sender: "SecretAdmirer", content: "I really liked your recent post!", time: "2 hours ago" },
  { sender: "AnonymousFan", content: "Your work is truly inspiring!", time: "1 day ago" },
  { sender: "MysteryObserver", content: "Keep up the great content!", time: "3 hours ago" }
]

export default function Landing() {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length)
    }, 3000) // Change message every 8 seconds (slowed down)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <header className="p-4 flex justify-between items-center bg-gray-950">
        <h1 className="text-2xl font-bold">True Feedback</h1>
       <Link href="/login"> <Button 
          variant="outline" 
          className="text-black bg-white border-white hover:bg-gray-200 hover:text-black"
        >
          Login
        </Button></Link>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center px-4 text-center">
        <h2 className="text-4xl md:text-6xl font-bold mb-4 max-w-4xl">
          Dive into the World of Anonymous Feedback
        </h2>
        <p className="text-xl mb-12">
          True Feedback - Where your identity remains a secret.
        </p>

        <div className="w-full max-w-md overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentMessageIndex}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 100, damping: 20, duration: 1 }}
            >
              <Card className="bg-white text-gray-900">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Message from {messages[currentMessageIndex].sender}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-500 flex-shrink-0"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    <div className="flex-grow">
                      <p className="mt-1">{messages[currentMessageIndex].content}</p>
                      <p className="text-sm text-gray-500 mt-1">{messages[currentMessageIndex].time}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <footer className="p-4 text-center bg-gray-950">
        <p className="text-sm text-gray-400">© 2023 True Feedback. All rights reserved.</p>
      </footer>
    </div>
  )
}