import { Notification } from "rsuite";

export function noParticipants() {
    Notification["error"]({
    title: "Cannot resolve the lottery",
    duration: 2000,
    description: <p style={{ width: 320 }} rows={3} >No participants!</p>
    });
}

export function didNotWinLottery() {
    Notification["alert"]({
    title: "Lottery over",
    duration: 2000,
    description: <p style={{ width: 320 }} rows={3} >Unfortunately, you did not win!</p>
    }); 
}

export function valueToSmall() {
    Notification["error"]({
    title: "Value must be greater than highest bid",
    duration: 2000,
    description: <p style={{ width: 320 }} rows={3} >Value to small</p>
    });
}