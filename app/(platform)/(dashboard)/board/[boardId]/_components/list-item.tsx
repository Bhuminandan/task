"use client"

import { ListWithCards } from "@/types"
import { ListHeader } from "./list-header";
import { ElementRef, useRef, useState } from "react";
import { CardForm } from "./card-form";

interface ListItemProps {
    data: ListWithCards;
    index: number;
}


export const ListItem = ({ 
    data, 
    index 
}: ListItemProps) => {


    const textAreaRef = useRef<ElementRef<"textarea">>(null);

    const [isEditing, setIsEditing] = useState(false);

    const disableEditing = () => {
        setIsEditing(false);
    }

    const enableEditing = () => {

        console.log("Getting called");

        setIsEditing(true);
        setTimeout(() => {
            textAreaRef.current?.focus();
        })
    }

    return (
        <li className="shrink-0 h-full w-[272px] select-none">
            <div className="w-full rounded-md bg-[#f1f2f4] shadow-md pb-2">
                <ListHeader 
                    onAddCard={enableEditing}
                    data={data}
                />
                <CardForm
                    listId={data.id}
                    ref={textAreaRef}
                    isEditing={isEditing}
                    enableEditing={enableEditing}
                    disableEditing={disableEditing}
                />
            </div>
        </li> 
                
    )
}