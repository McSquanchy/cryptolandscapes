import { useSelector } from "react-redux";
import LandscapesList from './LandscapesList/LandscapesList';

export default function MyLandscapesList({landscapes}) {
    const myLandscapes = useSelector(state => state.myLandscapes.landscapes);
    return (
        <>
            <h2>My landscapes</h2>
            <LandscapesList landscapes={myLandscapes} />
        </>
    );
}
