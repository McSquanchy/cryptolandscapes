import { appNavigate } from "../state/slices/app.reducer";
import store from "../state/store";

export default function LandscapeLink({ children, landscapeId }) {
    return (
        <a
            href={"#" + landscapeId}
            onClick={(e) => {
                e.preventDefault();
                store.dispatch(appNavigate({ keyword: "landscape-detail", landscapeId }));
            }}
        >
            {children}
        </a>
    );
}
