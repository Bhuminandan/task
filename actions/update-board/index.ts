"use server";

import { auth } from "@clerk/nextjs";

import { InputType, ReturnType } from "./types"; 
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeActions } from "@/lib/create-safe-action";
import { UpdateBoard } from "./schema";

const hander = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
        return {
            error: "Unauthorized",
        };
    }


    const { title, id } = data;
    let board;

    try {
        board = await db.board.update({
            where: {
                id,
                orgId,
            },
            data: {
                title,
            }
        });
    } catch (error) {
        return {
            error: "Something went wrong, failed to update board",
        }
    }

    revalidatePath(`/board/${id}`);
    return { data: board };
}



export const updateBoard = createSafeActions(UpdateBoard, hander);