import NFT from "../NFT/NFT";
import NFTOptions from "../NFTOptions/NFTOptions";

export default function LandscapeView(props) {
    return (
        <>
            <h3>{props.object.name}</h3>
            <NFT dna={props.object.dna} name={props.object.name} />
            <NFTOptions name={props.object.name} id={props.object.id} />                
        </>
    );
}