"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Upload, FileText, X, CircleAlert } from "lucide-react"
import { Spinner } from "./ui/spinner"

interface Response {
    productive: boolean,
    response: string,
    prompt: string
}

type Props = {
    emails: Response[],
    setEmails: React.Dispatch<React.SetStateAction<Response[]>>

}

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export function EmailForm({ emails, setEmails }: Props) {
    const [emailData, setEmailData] = useState({

        prompt: "",
    })
    const [uploadedFile, setUploadedFile] = useState<File | null>(null)
    const [dragActive, setDragActive] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)


    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setEmailData((prev) => {
            return ({ ...prev, [name]: value })
        })
    }

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0]
            if (isValidFileType(file)) {
                setUploadedFile(file)
            }
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            if (isValidFileType(file)) {
                setUploadedFile(file)
            }
        }
    }

    const isValidFileType = (file: File) => {
        const validTypes = ["application/pdf", "text/plain"]
        return validTypes.includes(file.type)
    }

    const removeFile = () => {
        setUploadedFile(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(false)
        try {
            const response = await fetch(`${apiUrl}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(emailData)
            })
            const json = await response.json();
            setEmails([...emails, json])
            setEmailData({ prompt: "" })

        } catch (error) {
            setError(true)
            console.error(error)
        } finally {
            setLoading(false)
        }

    }

    const handleUploadSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(false)
        const formData = new FormData();
        formData.append('file', uploadedFile as Blob);
        try {
            const response = await fetch(`${apiUrl}`, {
                method: "POST",
                body: formData
            })
            const json = await response.json();
            setEmails([...emails, json])
            setUploadedFile(null)
        } catch (error) {
            setError(true)
            console.error(error)
        } finally {
            setLoading(false)
        }

    }

    return (
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <CardTitle className="text-2xl">Emailer</CardTitle>
                <CardDescription>Escreva um email ou envio um documento</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="email" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="email" className="gap-2">
                            <Mail className="h-4 w-4" />
                            Escrever um email
                        </TabsTrigger>
                        <TabsTrigger value="upload" className="gap-2">
                            <Upload className="h-4 w-4" />
                            Enviar um documento
                        </TabsTrigger>
                    </TabsList>
                    {loading ?
                        <div className="w-full flex flex-col items-center justify-center">
                            <Spinner className="size-8 text-muted-foreground    " />
                            <p className="text-muted-foreground font-semibold">Enviando...</p>
                        </div>


                        :

                        <>

                            <TabsContent value="email">
                                <form onSubmit={handleEmailSubmit} className="space-y-4">



                                    <div className="space-y-2">
                                        <Label htmlFor="body">Mensagem</Label>
                                        <Textarea
                                            id="prompt"
                                            name="prompt"
                                            placeholder="Escreva a sua mensagem aqui..."
                                            value={emailData.prompt}
                                            onChange={handleEmailChange}
                                            rows={8}
                                            required
                                        />
                                    </div>

                                    <Button type="submit" className="w-full">
                                        <Mail className="mr-2 h-4 w-4" />
                                        Enviar Email
                                    </Button>
                                </form>
                            </TabsContent>

                            <TabsContent value="upload">
                                <form onSubmit={handleUploadSubmit} className="space-y-4">
                                    <div
                                        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive
                                            ? "border-primary bg-primary/5"
                                            : "border-muted-foreground/25 hover:border-muted-foreground/50"
                                            }`}
                                        onDragEnter={handleDrag}
                                        onDragLeave={handleDrag}
                                        onDragOver={handleDrag}
                                        onDrop={handleDrop}
                                    >
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept=".pdf,.txt,application/pdf,text/plain"
                                            onChange={handleFileChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />

                                        {uploadedFile ? (
                                            <div className="flex items-center justify-center gap-3">
                                                <FileText className="h-10 w-10 text-primary" />
                                                <div className="text-left">
                                                    <p className="font-medium">{uploadedFile.name}</p>
                                                    <p className="text-sm text-muted-foreground">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                                                </div>
                                                <Button type="button" variant="ghost" size="icon" onClick={removeFile} className="ml-2">
                                                    <X className="h-4 w-4" />
                                                    <span className="sr-only">Remover arquivo</span>
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
                                                <p className="text-lg font-medium">Solte o seu arquivo aqui ou clique para fazer o upload</p>
                                                <p className="text-sm text-muted-foreground">Apenas aquivos PDF ou TXT</p>
                                            </div>
                                        )}
                                    </div>

                                    <Button type="submit" className="w-full" disabled={!uploadedFile}>
                                        <Upload className="mr-2 h-4 w-4" />
                                        Enviar Documento
                                    </Button>
                                </form>
                            </TabsContent>
                            {error &&
                                <div className="w-full border rounded-lg p-4 border-red-600/30 flex items-center justify-center gap-2">
                                    <CircleAlert className="text-red-600" size={20} />
                                    <p className="text-red-600 text-sm text-center">Ocorreu um erro, tente novamente!</p>
                                </div>
                            }
                        </>}

                </Tabs>
            </CardContent>

        </Card>
    )
}

