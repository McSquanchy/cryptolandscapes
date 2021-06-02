import { useEffect, useMemo, useState } from "react";
import { Timeline } from "rsuite";
import contractService from "../../web3/contract.service";
import AccountAddress from "../AccountAddress";

export default function OwnerHistoryView({ landscapeId }) {
    const [events, setEvents] = useState([]);

    const firstOwner = useMemo(() => {
        return events[events.length - 1]?.oldOwner;
    }, [events]);

    useEffect(() => {
        (async () => {
            try {
                setEvents((await contractService.loadOwnerHistory(landscapeId)) || []);
            } catch (e) {
                console.error(e);
            }
        })();
    }, [landscapeId]);

    if(events == null || events.length == 0) {
        return null;
    }

    return (
        <div>
            <h3>Transfer History</h3>
            <Timeline align="left">
                {events.map((transfer, index) => (
                    <OwnerHistoryEntry key={index} time={transfer.time} newOwner={transfer.newOwner} />
                ))}
                <OwnerHistoryEntry key="last" newOwner={firstOwner} time={null} />
            </Timeline>
        </div>
    );
}

const OwnerHistoryEntry = ({ newOwner, time }) => {
    const timeFormatted = useMemo(() => {
        if (time == null) return " ";
        return new Date(time * 1000).toLocaleString();
    }, [time]);
    return (
        <Timeline.Item time={timeFormatted}>
            To: <AccountAddress address={newOwner} />
        </Timeline.Item>
    );
};
