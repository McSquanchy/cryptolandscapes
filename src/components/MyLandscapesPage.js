import { useSelector } from "react-redux";
import { Loader } from "rsuite";
import { useAccountLandscapes } from "../hooks/landscapes";
import LandscapesList from './LandscapesList/LandscapesList';

export default function MyLandscapesPage() {
    const myAddress = useSelector((state) => state.app.ethAddress);
    const {myLandscapes, loading} = useAccountLandscapes(myAddress);

    if(loading){
        return <Loader size="lg" center />;
    } else {
        return (
                <LandscapesList landscapes={myLandscapes} />
        );
    }
}
