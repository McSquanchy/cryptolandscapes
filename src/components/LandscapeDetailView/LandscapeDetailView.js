import { Divider } from "rsuite";
import { useIsUserOwner } from "../../hooks/landscapes";
import AccountAddress from "../AccountAddress";
import LandscapeAuctionDetailView from "../LandscapeAuctionDetailView/LandscapeAuctionDetailView";
import LandscapeNameView from "../LandscapeNameView/LandscapeNameView";
import NFT from "../NFT/NFT";
import OwnerHistoryView from "../OwnerHistoryView/OwnerHistoryView";
import TransferOwnershipView from "../TransferOwnershipView/TransferOwnershipView";

import "./LandscapeDetailView.css";

export default function LandscapeDetailView({ landscape }) {
    const isUserOwner = useIsUserOwner(landscape);

    return (
        <div className="landscape-detail-view">
            <NFT dna={landscape.dna} style={{ width: "100%" }} />
            <div style={{ paddingLeft: "2em", paddingRight: "1em" }}>
                <LandscapeNameView landscapeId={landscape.landscapeId} name={landscape.name} isUserOwner={isUserOwner} />
                <table className="landscape-data-table">
                    <tbody>
                        <tr>
                            <td>DNA:</td>
                            <td>{landscape.dna}</td>
                        </tr>
                        <tr>
                            <td>Owner:</td>
                            <td>
                                <AccountAddress address={landscape.owner} />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <Divider />
                {isUserOwner && <TransferOwnershipView landscapeId={landscape.landscapeId} />}
                <Divider />
                <LandscapeAuctionDetailView landscape={landscape} isUserOwner={isUserOwner} />
                <Divider />
                <OwnerHistoryView landscapeId={landscape.landscapeId} />
            </div>
        </div>
    );
}
