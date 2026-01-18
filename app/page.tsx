"use client"
import { EmailForm } from "@/components/email-form"
import { EmailList } from "@/components/email-list"
import { useState } from "react"

interface Response {
  productive: boolean,
  response: string
  prompt: string
}



export default function Home() {
  const [emails, setEmails] = useState<Response[]>([])
  return (
    <main className="min-h-screen flex flex-col gap-4 items-center justify-start mt-10 p-4 bg-background">
      <EmailForm emails={emails} setEmails={setEmails} />
      <EmailList emails={emails} />
    </main>
  )
}
