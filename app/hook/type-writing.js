import { useEffect, useRef, useState } from 'react';

export function useTypingEffect(textToType, interKeyStorkeDurationInMs) {
    const [currentPostion, setCurrentPosition] = useState(0);
    const currentPostionRef = useRef(0);

    useEffect(() => {

        const intervalId = setInterval(() => {
            setCurrentPosition((value) => value + 1);
            
            currentPostionRef.current += 1;

            if(currentPostionRef.current > textToType.length) {
                clearInterval(intervalId)
            }
        }, interKeyStorkeDurationInMs);

        return () => {
            clearInterval(intervalId);
            currentPostionRef.current = 0;
            setCurrentPosition(0);
        }

    }, [interKeyStorkeDurationInMs, textToType]);

    return textToType.substring(0, currentPostion);
}