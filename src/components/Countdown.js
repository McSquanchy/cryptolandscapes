import { useEffect, useState } from "react"

const recalc = (pointInTimeSeconds, ifFinished) => {
    const remainingSecs = (pointInTimeSeconds * 1000) - Date.now()
    if(remainingSecs <= 0){
        return ifFinished
    } else {
        const days = Math.floor(remainingSecs / (1000*60*60*24))
        const remAfterDays = remainingSecs % (1000*60*60*24)
        const hours = Math.floor(remAfterDays / (1000*60*60))
        const remAfterHours = remAfterDays % (1000*60*60)
        const minutes = Math.round(remAfterHours / (1000*60));
        let str = '';
        if(days > 0) str += days + ' days '
        if(hours > 0) str += hours + ' hours '
        if(minutes > 0) str += minutes + ' minutes '
        if(days === 0 && hours === 0 && minutes === 0) str += 'Few moments'
       return str.trim() + ' remaining'
    }
}

export default function Countdown({pointInTimeSeconds, ifFinished}) {
    const [remainingStr, setRemainingStr] = useState('');

    useEffect(() => {
        setRemainingStr(recalc(pointInTimeSeconds, ifFinished))
        const x = setInterval(() => setRemainingStr(recalc(pointInTimeSeconds, ifFinished)), 1000*60)
        return () => {
            clearInterval(x)
        }
    }, [pointInTimeSeconds, ifFinished])

    return <span>{remainingStr}</span>
}