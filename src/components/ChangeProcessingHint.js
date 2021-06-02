import { Loader } from "rsuite";

export default function ChangeProcessingHint({ processing }) {
    if (processing) {
        return (
            <div style={{ display: "flex", alignItems: "center" }}>
                <Loader />
                <p style={{ display: "inline-block", marginLeft: 3, color: "grey" }}>Change is being processed...</p>
            </div>
        );
    } else {
        return null;
    }
}
