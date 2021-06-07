import { Notification } from "rsuite";

export function noParticipants() {
    Notification["error"]({
    title: "Cannot resolve the lottery",
    duration: 2000,
    description: <p style={{ width: 320 }} rows={3} >No participants!</p>
    });
}