import { useSelector } from "react-redux";

export default function NotFoundPage(){
    const navState = useSelector(state => state.app.navState);

    return <h3>Page not found: {navState.keyword}</h3>
}