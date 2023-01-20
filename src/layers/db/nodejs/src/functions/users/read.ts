import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const getAllUsers = async () => {
    console.log(`Get All Users DB_URL => ${process.env.DATABASE_URL}`)
    const users = await prisma.user.findMany({
        include: {
            post: true
        }
    })
    console.dir(users, {depth: null})
    return users
}
