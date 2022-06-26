//reusable timeout hook
import { useCallback, useEffect, useRef } from "react";

export default function useTimeout(callBack, delay) {
    const callBackRef = useRef(callBack)
    const timeoutRef = useRef()

    useEffect(() => {
        callBackRef.current = callBack
    }, [callBack])

    const set = useCallback(() => {
        timeoutRef.current = setTimeout(() => callBackRef.current(), delay)
    }, [delay])

    const clear = useCallback(() => {
        timeoutRef.current && clearTimeout(timeoutRef.current)
    }, [])

    useEffect(() => {
        set()
        return clear
    }, [delay, set, clear])

    const reset = useCallback(() => {
        clear()
        set()
    }, [clear, set])

    return { reset, clear }
}