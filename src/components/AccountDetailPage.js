import { Loader } from "rsuite";
import { useAccountLandscapes } from "../hooks/landscapes";
import LandscapesList from "./LandscapesList/LandscapesList";

export default function AccountDetailPage({ address }) {
    const { myLandscapes, loading } = useAccountLandscapes(address);

    if (loading) {
        return <Loader size="lg" />;
    } else {
        return (
            <>
                <h2>Landscapes of {address}</h2>
                <LandscapesList landscapes={myLandscapes} />
            </>
        );
    }
}
