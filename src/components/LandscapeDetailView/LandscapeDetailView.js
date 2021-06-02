

import LandscapeAuctionDetailView from '../LandscapeAuctionDetailView/LandscapeAuctionDetailView'
import NFT from "../NFT/NFT"
import "./LandscapeDetailView.css"
export default function LandscapeDetailView({landscape}){

    return <div className="landscape-detail-view">
            <h3>Hello Landscape {landscape.id}</h3>
            <NFT />
            <LandscapeAuctionDetailView />
    </div>
}