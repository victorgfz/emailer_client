"use client"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "./ui/badge"

interface Response {
    productive: boolean
    response: string
    prompt: string
}

interface EmailsReceived {
    emails: Response[]
}


function EmailCard({ productive, response, prompt }: Response) {
    return (
        <div className={`rounded-lg border p-4 bg-gray-100/30`}>
            <div className="space-y-2 text-sm mb-3">
                <p className="text-black font-semibold">Mensagem enviada</p>
                <p className="text-muted-foreground leading-relaxed">
                    {prompt}
                </p>

            </div>
            <div className="space-y-2 text-sm">

                <div className="pt-3 border-t mt-3">
                    <p className="text-black font-semibold">Mensagem recebida</p>
                    <p className="text-muted-foreground leading-relaxed">{response}</p>
                </div>
            </div>
        </div>
    )
}

export function EmailList({ emails }: EmailsReceived) {
    return (
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <CardTitle>Lista de Emails</CardTitle>
            </CardHeader>
            <CardContent>
                {emails && emails.length > 0 ? <Accordion type="multiple" className="w-full">
                    {emails.map((item, index) => (
                        <AccordionItem key={index} value={index.toString()}>
                            <AccordionTrigger className="hover:cursor-pointer hover:no-underline">
                                <div className="flex justify-start items-center gap-2">
                                    {item.productive
                                        ? <Badge className="bg-green-600">Produtivo</Badge>
                                        : <Badge className="bg-red-600" >Improdutivo</Badge>}
                                    <span className="font-semibold">Email #{index + 1}</span>

                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="flex flex-col gap-4 pt-2">
                                    <EmailCard productive={item.productive} response={item.response} prompt={item.prompt} />
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion> : <p className="text-muted-foreground text-sm italic">Nenhum email enviado até o momento!</p>}

            </CardContent>
        </Card>
    )
}
