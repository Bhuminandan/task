"use client"

import { DragDropContext, Droppable  } from "@hello-pangea/dnd"


import { useAction } from "@/hooks/use-action";
import { updateCardOrder } from "@/actions/update-card-order";
import { updateListOrder } from "@/actions/update-list-order";
import { ListWithCards } from "@/types";

import { ListForm } from "./list-form";
import { ListItem } from "./list-item";

import { useEffect, useState } from "react";
import { toast } from "sonner";


interface ListContainerProps {
    boardId: string;
    data: ListWithCards[];
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};



export const ListContainer = ( { boardId, data }: ListContainerProps) => {

    const [orderedData, setOrderedData] = useState(data);

    const { execute : executeUpdateListOrder} = useAction(updateListOrder, {
        onSuccess: () => {
            toast.success(`List reordered`);
        },

        onError: (error) => {
            toast.error(error);
        }

    });

    const { execute : executeUpdateCardOrder} = useAction(updateCardOrder, {
        onSuccess: () => {
            toast.success(`Card reordered`);
        },

        onError: (error) => {
            toast.error(error);
        }

    })

    
    const onDragEnd = (result: any) => {
        const { destination, source, type } = result;

        if (!destination) {
            return;
        }

        // if dropped in the same position
        if(
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        // User moves a list
        if(type === "list") {
            let items = reorder(
                orderedData,
                source.index,
                destination.index            
            ).map((item, index) => ({
                ...item, order: index 
            }));

            setOrderedData(items);
            executeUpdateListOrder({
                items, boardId
            })
        }

        // User moves a card
        if(type === "card") {
            let newOrderedData = [...orderedData];

            // Source and Destination list
            const sourceList = newOrderedData.find(list => list.id === source.droppableId);
            const destinationList = newOrderedData.find(list => list.id === destination.droppableId);

            if(!sourceList || !destinationList) {
                return;
            }

            // Check if cards exists on the source list
            if(!sourceList.cards) {
                sourceList.cards = [];
            }

            // Check if cards exists on the destination list
            if(!destinationList.cards) {
                destinationList.cards = [];
            }

            // Moving the card in the same list
            if(source.droppableId === destination.droppableId) {
                const reorderedCards = reorder(
                    sourceList.cards,
                    source.index,
                    destination.index
                );

                reorderedCards.forEach((card, index) => {
                    card.order = index;
                });

                sourceList.cards = reorderedCards;

                setOrderedData(newOrderedData);
                executeUpdateCardOrder({
                    items: reorderedCards, boardId
                });
            }
            else{
                // Remove card from the souce list 

                const [movedCard] = sourceList.cards.splice(source.index, 1);

                // Assign new llist id to the new card
                movedCard.listId = destination.droppableId;

                // Add card to the destination list
                destinationList.cards.splice(destination.index, 0, movedCard);

                sourceList.cards.forEach((card, index) => {
                    card.order = index;
                });

                // Update the order for each card in the destination list

                destinationList.cards.forEach((card, index) => {
                    card.order = index;
                });

                setOrderedData(newOrderedData);
                executeUpdateCardOrder({
                    items: destinationList.cards, boardId
                })
            }
        }
    }



    useEffect(() => {
        setOrderedData(data);
    }, [data]);

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="lists" type="list" direction="horizontal">
            {(provided) => (
            <ol 
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex gap-x-3 h-full"
            >
                {
                    orderedData.map((list, index) => {
                        return (
                            <ListItem
                                key={list.id}
                                data={list}
                                index={index}
                            />
                        )
                    })
                }
                {
                    provided.placeholder
                }
                <ListForm/>
                <div className="flex-shrink-0 w-1" />
            </ol>
            )}
            </Droppable>
            </DragDropContext>
    )
}