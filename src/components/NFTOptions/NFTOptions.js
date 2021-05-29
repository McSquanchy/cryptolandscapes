import contractService from "../../web3/contract.service";

export default function NFTOptions(props) {
    let newNFTName = "";

    function handleChange(event) {
        newNFTName = event.target.value;
    }

    function handleSubmit(event, id, oldName) {
        event.preventDefault();
        if(oldName !== newNFTName) {
            contractService.changeName(id, newNFTName);
        } else {
            console.log("new value equals old one!");
        }
    }

    return (
        <>
            <form onSubmit={(e) => handleSubmit(e,props.id, props.name)}>
                <label>
                    Change Name:
                    <input id="newName" onChange={(e) => handleChange(e)} />
                    <input type="submit" value="Accept" />
                </label>
            </form>
            <button type="button" onClick={() => contractService.startAuction(props.id, Math.ceil(Date.now() / 1000) + 60, 0)}>Start auction</button>
        </>
    );
}



