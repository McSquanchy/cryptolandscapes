import { useMyLandscapes } from "../hooks/landscapes";
import LandscapesList from './LandscapesList/LandscapesList';

export default function MyLandscapesPage() {
    const {myLandscapes, loading} = useMyLandscapes();

    if(loading){
        return <div>Loading</div>
    } else {
        return (
            <>
                <h2>My landscapes</h2>
                <LandscapesList landscapes={myLandscapes} />
            </>
        );
    }
}
