"use server";

import { auth } from "@clerk/nextjs";

import { InputType, ReturnType } from "./types"; 
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSafeActions } from "@/lib/create-safe-action";
import { DeleteBoard } from "./schema";

const hander = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
        return {
            error: "Unauthorized",
        };
    }


    const { id } = data;
    let board;

    try {
        board = await db.board.delete({
            where: {
                id,
                orgId,
            },
        });
    } catch (error) {
        return {
            error: "Something went wrong, failed to delete board",
        }
    }

    revalidatePath(`/organization/${orgId}`);
    redirect(`/organization/${orgId}`);
}



export const deleteBoard = createSafeActions(DeleteBoard, hander);