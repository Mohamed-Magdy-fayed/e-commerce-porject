//reusable debounce hook
import { useEffect } from "react";
import useTimeout from "./useTimeout";

const useDebounce = (callBack, delay, dependencies) => {
    const { reset, clear } = useTimeout(callBack, delay)
    useEffect(reset, [...dependencies, reset])
    useEffect(clear, [])
}

export default useDebounce