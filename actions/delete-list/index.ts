"use server";

import { auth } from "@clerk/nextjs";

import { InputType, ReturnType } from "./types"; 
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSafeActions } from "@/lib/create-safe-action";
import { DeleteList } from "./schema";

const hander = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
        return {
            error: "Unauthorized",
        };
    }


    const { id, boardId } = data;
    let list;

    try {
        list = await db.list.delete({
            where: {
                id,
                boardId,
                board: {
                    orgId
                }
            },
        });
    } catch (error) {
        return {
            error: "Something went wrong, failed to delete list",
        }
    }

    revalidatePath(`/organization/${boardId}`);
    return {
        data: list
    };
};



export const deleteList = createSafeActions(DeleteList, hander);