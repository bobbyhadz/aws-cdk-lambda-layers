const DATABASE_URL_IN_APP = process.env.DATABASE_URL

export const sayHello = () => {
    console.log(`DATABASE_URL_IN_APP=${DATABASE_URL_IN_APP}`)
    return "Hello World!"
}
