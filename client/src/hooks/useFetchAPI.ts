import axios from "axios";
import { useState, useEffect } from "react";

enum options {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE"
}

const useFetchAPI = <T>(url: string, options: options, body?: any): [any, boolean, boolean] => {
    const [response, setResponse] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setIsError(false);
            const resp = await axios({
                method: options,
                url,
                data: body
            })
            setResponse(resp.data);
            setIsError(false);
            setIsLoading(false);
        }
        fetchData().catch(err => {
            console.error(err);
            setIsError(true);
            setIsLoading(false);
            setResponse(null);
        })
    }, []);
    // console.log("From Response")
    // console.log(response)

    return [response, isLoading, isError];
}

export default useFetchAPI