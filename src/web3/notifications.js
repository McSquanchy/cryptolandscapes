import { Notification, Input, InputGroup, Icon } from "rsuite";
import contractService from "../web3/contract.service";

var changedName = "";

const handleInputEvent = (e) => {
    changedName = e;
}

const doWithdraw = async () => {
    await contractService.collectWin(changedName);
}

export function withDrawNftDialogue() {
        Notification["info"]({
        title: "Collect your NFT",
        duration: 10000,
        description: <><p style={{ width: 320 }} rows={3} >Name your NFT</p><br/><InputGroup><Input placeholder="myFancyNFT" defaultValue={changedName} onChange={handleInputEvent} /><InputGroup.Button onClick={doWithdraw} ><Icon icon="check" />
                </InputGroup.Button>
            </InputGroup></>
    });
}

export function wonDialogue() {
    Notification["success"]({
        title: "You won the lottery, congrats!",
        duration: 10000,
        description: <><p style={{ width: 320 }} rows={3} >Name your NFT and withdraw it!</p><br/><InputGroup><Input placeholder="myFancyNFT" defaultValue={changedName} onChange={handleInputEvent} /><InputGroup.Button onClick={doWithdraw} ><Icon icon="check" />
                </InputGroup.Button>
            </InputGroup></>
    });
}

export function noParticipants() {
    Notification["error"]({
    title: "Cannot resolve the lottery",
    duration: 2000,
    description: <p style={{ width: 320 }} rows={3} >No participants!</p>
    });
}