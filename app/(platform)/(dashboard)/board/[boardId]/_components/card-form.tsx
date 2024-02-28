"use client"

import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import { useAction } from "@/hooks/use-action";
import { createCard } from "@/actions/create-card";
import { 
    forwardRef, 
    useRef, 
    ElementRef, 
    KeyboardEventHandler 
} from "react";
import { useParams } from "next/navigation";
import { useOnClickOutside, useEventListener } from "usehooks-ts";

import { FormSubmit } from "@/components/form/form-submit";
import { FormTextarea } from "@/components/form/form-textarea";
import { Button } from "@/components/ui/button";


interface CardFormProps {
    listId: string,
    enableEditing: () => void,
    disableEditing: () => void,
    isEditing: boolean
}

export const CardForm  = forwardRef<HTMLTextAreaElement, CardFormProps>( ({

    listId,
    enableEditing,
    disableEditing,
    isEditing

}, ref) => {


    const params = useParams();
    const formRef= useRef<ElementRef<"form">>(null);

    const { execute, fieldErrors } = useAction(createCard, {
        onSuccess: (data) => {
            toast.success(`Card ${data.title} created`);
            formRef.current?.reset();
        },

        onError: (error) => {
            toast.error(error);
        }
    });

    const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
            disableEditing();
        }
    };

    useOnClickOutside(formRef, disableEditing);
    useEventListener("keydown", onKeyDown);

    const onTextAreaKeyDown : KeyboardEventHandler<HTMLTextAreaElement> = (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            formRef.current?.requestSubmit();
        }
    };

    const onSubmit = (formData: FormData) => {
        const title = formData.get("title") as string;
        const listId = formData.get("listId") as string;
        const boardId = params.boardId as string;

        console.log(title, listId, boardId);

        execute({ title, listId, boardId });
    }

    if (isEditing) {
        return (
        <form 
        ref={formRef}
        action={onSubmit}
        className="m-1 py-0.5 px-1 space-y-4">
            <FormTextarea
                ref={ref}
                id="title"
                onKeyDown={onTextAreaKeyDown}
                errors={fieldErrors}
                placeholder="Enter a title for this card..."
            />
            <input id="listId" name="listId" hidden value={listId} />
            <div className="flex items-center gap-x-1">
                <FormSubmit>
                    Add Card
                </FormSubmit>
                <Button
                 onClick={disableEditing}
                 size={"sm"}
                 variant={"ghost"}
                >
                    <X className="h-5 w-5" />
                </Button>
            </div>
        </form>
        )
    }

    return (
        <div className="pt-2 px-2">
            <Button
             onClick={enableEditing}
             className="h-auto px-2 py-1.5 w-full justify-start text-muted-foreground text-sm dark:text-neutral-400  dark:hover:bg-neutral-900"
             size={"sm"}
             variant={"ghost"}
            >
                <Plus className="h-4 w-4 mr-2" />
                Add a card
            </Button>
        </div>
    )
});


CardForm.displayName = "CardForm";