"use client"

import { KeyboardEventHandler, forwardRef } from "react"


import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

import { cn } from "@/lib/utils";
import { FormErrors } from "./form-errors";
import { useFormStatus } from "react-dom";

interface FormTextareaProps {
    id: string;
    label?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    errors?: Record<string, string[] | undefined>;
    onBlur?: () => void;
    onClick?: () => void;
    onKeyDown?: KeyboardEventHandler<HTMLTextAreaElement> | undefined;
    defaultValue?: string;
    className?: string
};


export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(({
    id,
    label,
    placeholder,
    required,
    disabled,
    errors,
    onBlur,
    onClick,
    onKeyDown,
    defaultValue,
    className
}, ref) => {


    const {pending} = useFormStatus();

    return (
        <div className="space-y-2 w-full">
            <div className="space-y-1 w-full">
                {label && (
                    <Label
                    htmlFor={id}
                    className="text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                    >
                        {label}
                    </Label>
                )}
                <Textarea 
                    onKeyDown={onKeyDown}
                    onClick={onClick}
                    onBlur={onBlur}
                    id={id}
                    name={id}
                    ref={ref}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled || pending}
                    defaultValue={defaultValue}
                    className={cn(
                        "resize-none focus-visible:ring-0 focus-visible:ring-offset-0 ring-0 focus:ring-0 outline-none shadow-sm",
                        className
                    )}
                    area-description={`${id}-error`}
                />
            </div>
            <FormErrors id={id} errors={errors} />
        </div>
    )
})


FormTextarea.displayName = "FormTextarea";