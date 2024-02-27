"use client"

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Sidebar } from "./Sidebar";

import { useMobileSidebar } from "@/hooks/use-mobile-sidebar";


export const MobileSidebar = () => {

    const pathName = usePathname();
    const [isMounted, setIsMounted] = useState(false);

    const { isOpen, onOpen, onClose } = useMobileSidebar();

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        onClose();
    }, [pathName, onClose])

    if(!isMounted) return null;

    return (
        <>
        <Button 
         onClick={onOpen} 
         variant="ghost" 
         className="block md:hidden mr-2"
         size={"sm"}
        >
            <Menu className="w-4 h-4"/>
        </Button>
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent
            side={"left"}
            className="p-2 pt-10"
            >
                <Sidebar 
                    storageKey="t-mobile-sidebar-state"
                />
            </SheetContent>
        </Sheet>
        </>
    )
}