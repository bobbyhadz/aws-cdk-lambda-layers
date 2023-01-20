import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const createUser = async (name: string, email: string) => {
    const createdUser = await prisma.user.create({
        data: {
            name, email
        }
    })
    console.log(`created ${JSON.stringify(createdUser)}`)
    return createdUser
}
