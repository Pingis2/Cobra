import { useEffect, useState } from "react";
import { connectToDatabase } from "../services/connectToDatabase";


export const AppLoader = ({children}: {children: React.ReactNode}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        const checkDatabaseConnection = async () => {
            try {
                setIsLoading(true);
                await connectToDatabase();
                setIsLoading(false);
            } catch (error) {
                console.error("Error during health check:", error);
                setHasError(true);
                setIsLoading(false);
            }
        }
        checkDatabaseConnection();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (hasError) {
        return <div>Failed to connect to the database.</div>;
    }

    return <>{children}</>
    
}