import NFT from "../NFT/NFT";
import NFTOptions from "../NFTOptions/NFTOptions";
import "./LandscapeView.css";

export default function LandscapeView(props) {
    return (
        <div className ="LandscapeView" >
            <li key={props.object.id} >    
                <h2 className ="LandscapeTitle">{props.object.name}</h2>
                <NFT dna={props.object.dna} name={props.object.name} />
                <NFTOptions name={props.object.name} id={props.object.id}  />                
            </li>
        </div>
    );
}