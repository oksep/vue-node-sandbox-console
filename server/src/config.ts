import dotenv from 'dotenv';

const ENV_NAME = process.env.ENV_NAME

console.log('ENV_NAME', ENV_NAME)

if (ENV_NAME == "dev") {
    dotenv.config({ path: "./env/.dev.env" })
} else if (ENV_NAME == "prod") {
    dotenv.config({ path: "./env/.prod.env" })
}
class AppConfig {
    static IS_DEV = ENV_NAME == "dev"
    static SERVER_PORT = process.env.SERVER_PORT as string
}

export default AppConfig
