import {PrismaClient} from '@prisma/client'
import {getAllUsers} from "./src/functions/users/read";
import {createUser} from "./db";

const prisma = new PrismaClient()

async function main() {
    /*const createUserWithPosts = async () => {
        const user = await prisma.user.create({
            data: {
                name: 'John A',
                email: 'john@email.com',
                post: {
                    create: {
                        title: 'Mud Bike',
                        content: 'This is my first ride in the Alps!'
                    }
                }
            }
        })
        console.log(user)
    }*/

    // await insertUser()
    // await createUserWithPosts()
    // await createUser("Johnny J", "johnny@email.com")
    await getAllUsers();
    // await getAllUsers()
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
