import log4js from "log4js";
import config from '../config';

log4js.configure({
    appenders: { 
        bos: { 
            type: "file", 
            filename: config.IS_DEV ? "./src/static/bos.log" : "./dist/static/bos.log",
            maxLogSize: 10 * 1024 * 1024 
        },
        out: { 
            type: "stdout"
        } 
    },
    categories: { 
        default: { 
            appenders: [
                "bos", 
                "out"
            ], 
            level: "debug" 
        } 
    }
});

function initLogger() {

    const logger = log4js.getLogger()

    logger.level = "debug"

    console.log = (message, ...optionalParams)=> {
        logger.debug(message, ...optionalParams);    
    }

    console.trace = (message, ...optionalParams)=> {
        logger.trace(message, ...optionalParams);    
    }

    console.info = (message, ...optionalParams)=> {
        logger.info(message, ...optionalParams);    
    }

    console.debug = (message, ...optionalParams)=> {
        logger.debug(message, ...optionalParams);    
    }

    console.warn = (message, ...optionalParams)=> {
        logger.warn(message, ...optionalParams);    
    }
    
    console.error = (message, ...optionalParams)=> {
        logger.error(message, ...optionalParams);    
    }
}

initLogger()

export default initLogger