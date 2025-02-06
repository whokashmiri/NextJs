"use server"

import prisma from "@/lib/prisma";
import { getDbUserId } from "./user.action"
import { revalidatePath } from "next/cache";


export async function createPost(content:string , image:string) {
    try {
        
        const userid = await getDbUserId();
        if(!userid) return;
        const post = await prisma.post.create({
            data:{
                content,
                image,
                authorId:userid
            }
        })
        revalidatePath("/");
        return{success:true , post}
    } catch (error) {
        console.log("Failed to create Post :", error );
        return {success: false , error :"Failed to create Post"}
        
    }
    
}

export async function getPosts() {
    try {
        const posts = await prisma.post.findMany({
            orderBy:{
                createdAt:"desc"
            },
            include:{
                author:{
                    select:{
                        name: true,
                        image:true,
                        username:true
                    }
                },
                comments:{
                    include:{
                        author:{
                            select:{
                                id:true,
                                username:true,
                                image:true,
                                name:true
                            }
                        }
                    }
                },
                likes:{
                select:{
    userId:true
                    }
                }
            }
        })
    } catch (error) {
        
    }
    
}