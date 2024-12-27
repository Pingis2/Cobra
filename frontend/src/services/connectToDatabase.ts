

export const connectToDatabase = async () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const isSuccess = true;
            if (isSuccess) {
                resolve("Database connection successful");
            } else {
                reject(new Error("Database connection failed"));
            }
        }, 2000);
    });
}