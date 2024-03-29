"use client"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
    PopoverClose
} from "@/components/ui/popover"

import { useAction } from "@/hooks/use-action"
import { createBoard } from "@/actions/create-board"

import { FormInput } from "./form-input"
import { FormSubmit } from "./form-submit" 
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

import { toast } from "sonner"
import { FormPicker } from "./form-picker"
import { ElementRef, useRef } from "react"
import { useRouter } from "next/navigation"

interface FormPopoverProps {
    children: React.ReactNode;
    side?: "top" | "bottom" | "left" | "right";
    align?: "start" | "center" | "end";
    sideOffset?: number;
}


export const FormPopover = ({
    children,
    side = "bottom",
    align,
    sideOffset = 0,
} : FormPopoverProps) => {

    const closeRef = useRef<ElementRef<"button">>(null);
    const router = useRouter();

    const { execute, fieldErrors } = useAction(createBoard, {
        onSuccess: (data) => {
            toast.success("Board created")
            closeRef.current?.click();
            router.push(`/board/${data.id}`);
        },
        onError: (error) => {
            toast.error(error)
            console.log({error})
        }
    })

    const onSubmit = ( formData: FormData) => {
        const title = formData.get("Title") as string;
        const image = formData.get("Image") as string;

        console.log({title, image})

        execute({title , image})
    }

    return(
        <Popover>
            <PopoverTrigger asChild>
                {children}
            </PopoverTrigger>
            <PopoverContent
             align={align}
             side={side}
             sideOffset={sideOffset}
             className="w-80 pt-3"
            >
                <div className="text-sm font-medium text-center text-neutral-600 dark:text-neutral-300 pb-4">
                    Create board
                </div>
            <PopoverClose 
             ref={closeRef}
             asChild
            >
                <Button 
                className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600 dark:text-neutral-300"
                 variant={"ghost"}
                >
                    <X className="w-4 h-4"/>
                </Button>
            </PopoverClose>
            <form action={onSubmit} className="space-y-4">
                <div className="space-y-4">
                    <FormPicker
                    id="Image"
                    errors={fieldErrors}
                    />
                    <FormInput 
                        id="Title"
                        label="Board Title"
                        type="text"
                        errors={fieldErrors}
                    />
                </div>
                <FormSubmit className="w-full">
                    Create
                </FormSubmit>
            </form>
            </PopoverContent>
        </Popover>
    )
}