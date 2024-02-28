"use client"

import { Card } from "@prisma/client";

import { Draggable } from "@hello-pangea/dnd"; 


interface CardItemProps {
    data: Card,
    index: number
}

export const CardItem = ({ 
    data, 
    index 
}: CardItemProps) => {


    return (
        <Draggable index={index} draggableId={data.id}>
            {(provided) => (
                <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps} 
                role="button"
                className="truncate border-2 border-transparent hover:border-black py-2 px-3 text-sm bg-white rounded-md shadow-sm dark:bg-neutral-600 dark:hover:border-black/10">
                {data.title}
                </div>
            )}
        </Draggable>
    );
}