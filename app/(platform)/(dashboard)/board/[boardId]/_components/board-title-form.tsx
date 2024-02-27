"use client"

import { ElementRef, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Board } from "@prisma/client"
import { FormInput } from "@/components/form/form-input";

import { useAction } from "@/hooks/use-action"; 
import { toast } from "sonner";
import { updateBoard } from "@/actions/update-board";


interface BoardTitleFormProps {
    data: Board;
}

export const BoardTitleForm = ({ data }: BoardTitleFormProps) => {


    const { execute } = useAction(updateBoard, {
        onSuccess: (data) => {
            toast.success(`Board ${data.title} updated`);
            setTitle(data.title);
            disableEditing();
        },

        onError: (error) => {
            toast.error(error);
        }
    });

    const formRef =  useRef<ElementRef<"form">>(null);
    const inputRef =  useRef<ElementRef<"input">>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(data.title);

    const enableEditing = () => {

        setTimeout(() => {
            inputRef.current?.focus();
            inputRef.current?.select();
        })
        setIsEditing(true);
    }

    const disableEditing = () => {
        setIsEditing(false);
    }

    const onSubmit = (formData: FormData) => {
        const title = formData.get("title") as string;
        
        execute({
            title,
            id: data.id
        })
    }

    const onBLur = () => {
        formRef.current?.requestSubmit();
    }

    if (isEditing) {
        return (
            <form 
            ref={formRef}
            action={onSubmit}
            className="flex items-center gap-x-2"
            >
                <FormInput
                id="title"
                ref={inputRef}
                onBlur={onBLur}
                defaultValue={title}
                className="text-lg font-bold px-[7px] py-1 h-7 bg-transparent focus-visible:outline-none focus-visible:ring-transparent border-none"
                
                />
            </form>
        )
    }

    return (
        <Button
            onClick={enableEditing}
            variant="transperant"
            className="font-bold text-lg h-auto w-auto  p-1 px-2"
        >
            {title}
        </Button>
    )
}