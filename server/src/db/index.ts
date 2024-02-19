function connectDB(onMongoConnected: () => void, onMongoConnectError: (err: Error) => void) {
    // do your DB connection here
    onMongoConnected();
}

function disconnectDB(onMongoDisconnected: () => void, onMongoDisconnectError: (err: Error) => void) {
    // do your DB disconnection here
    onMongoDisconnected();
}

export async function connectDBAsync() {
    return new Promise((resolve: any, reject) => {
        connectDB(
            () => {
                console.log('connectDBAsync 1');
                resolve()
            },
            (err) => {
                reject(err)
            }
        )
    })
}

export async function disconnectDBAsync() {
    return new Promise((resolve: any, reject) => {
        disconnectDB(
            () => {
                console.log('disconnectDBAsync 1');
                resolve()
            },
            (err) => {
                reject(err)
            }
        )
    })
}