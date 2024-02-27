"use client"

import { useEffect, useState } from "react" 

import { unsplash } from "@/lib/unsplash" 
import { Check, Loader2 } from "lucide-react"
import { useFormStatus } from "react-dom"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { defaultImages } from "@/constants/images"
import Link from "next/link"
import { FormErrors } from "./form-errors"

interface FormPickerProps {
    id: string
    errors?: Record<string, string[] | undefined>
}


export const FormPicker = ({
    id,
    errors
} : FormPickerProps ) => {

    const { pending } = useFormStatus();

    const [images, setImages] = useState<Array<Record<string, any>>>(defaultImages);
    const [isLoading, setIsLoading] = useState(true);
    const [selectecImageId, setSelectedImageId] = useState(null);

    useEffect(() => {
        const fetchImages = async () => {
            setIsLoading(true);
            try {
                const result = await unsplash.photos.getRandom({
                    collectionIds: ["317099"],
                    count: 9,
                })

                if (result && result.response) {
                    setImages(result.response as Array<Record<string, any>>);
                } else {
                    console.log("Error fetching images");
                }

            } catch (error) {
                console.log(error);
                setImages(defaultImages);
            } finally {
                setIsLoading(false);
            }
        }
        fetchImages();
    }, []);


    if(isLoading) {
        return (
            <div className="p-6 flex items-center justify-center">
                <Loader2  className="w-6 h-6 text-sky-700 animate-spin"/>
            </div>
        )
    }

   return (
        <div className="relative">
            <div className="grid grid-cols-3 gap-2 mb-2">
                {
                    images.map((image) => (
                        <div 
                         className={
                            cn(
                                "cursor-pointer relative group aspect-video hover:opacity-75 transition bg-muted",
                                pending && "opacity-50 hover:opacity-50 cursor-auto"
                            )
                         }
                         onClick={() => {
                            if(pending) return;
                            setSelectedImageId(image.id);
                         }}
                        >
                            <input 
                                type="radio"
                                className="hidden" 
                                id={id}
                                name={id}
                                checked={selectecImageId === image.id}
                                disabled={pending}
                                value={`${image.id}|${image.urls.thumb}|${image.urls.full}|${image.links.html}|${image.user.name}`}
                             />
                            <Image 
                                fill
                                alt="image"
                                src={image.urls.thumb}
                                className="object-cover rounded-sm"
                            />
                            {selectecImageId === image.id && (
                                <div className="absolute inset-0 w-full h-full bg-black/30 flex items-center justify-center">
                                    <Check className="w-4 h-4 text-white"/>
                                </div>
                            )}
                            <Link 
                            href={image.links.html} 
                            target="_blank"
                            className="opacity-0 absolute group-hover:opacity-100 bottom-0 w-full text-[10px] truncate text-white hover:underline p-1 bg-black/50" 
                            >
                                {image.user.name}
                            </Link>
                        </div>
                    ))
                }
            </div>
            <FormErrors errors={errors} id={id} />
        </div>
   )
}