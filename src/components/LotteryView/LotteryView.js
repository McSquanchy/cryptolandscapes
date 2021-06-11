import { useSelector } from "react-redux";
import {
    Button,
    Divider,
    InputNumber,
    List,
    Icon,
} from "rsuite";
import contractService from "../../web3/contract.service";
import { noParticipants } from "../../web3/notifications";
import LotteryWithdrawModal from "../LotteryWithdrawModal/LotteryWithdrawModal";
import store from "../../state/store";
import { setShowWithdrawModal } from "../../state/slices/lottery.reducer";

export default function LotteryView() {
    const lotteryLocked = useSelector((state) => state.lottery.locked);
    const lotteryAdminLocked = useSelector((state) => state.lottery.adminLocked);
    const lotteryWithdrawLocked = useSelector((state) => state.lottery.withdrawLocked);
    const isOwner = useSelector((state) => state.app.owner);
    const myShares = useSelector((state) => state.lottery.myShares);
    const totalShares = useSelector((state) => state.lottery.totalShares);
    const participants = useSelector((state) => state.lottery.participants);
    const availableWinWithdrawals = useSelector((state) => state.lottery.availableWinWithdrawals);

    const showModal = () => {
        store.dispatch(setShowWithdrawModal(true));
    };

    let buyAmount = 1;
    const changeBuy = (e) => {
        buyAmount = e;
    };
    const tryResolve = () => {
        if (participants.length > 0) contractService.resolveLottery();
        else noParticipants();
    };

    return (
        <>
            <LotteryWithdrawModal />
            <div style={{padding: '0.1em'}}>
                <h4>Lottery</h4>
                <InputNumber defaultValue={1} min={1} max={10} step={1} onChange={changeBuy} disabled={lotteryLocked} />
                <span>1 share = 0.0005 ETH</span>
                <br /><br />
                <Button
                    appearance="ghost"
                    block
                    onClick={() => contractService.participateLottery(buyAmount)}
                    disabled={lotteryLocked}
                    loading={lotteryLocked}
                >
                    <Icon name="ticket" /> Buy lottery shares
                </Button>
                <br />
                <table style={{ width: "100%" }}>
                    <tbody>
                        <tr>
                            <td>My shares</td>
                            <td style={{ width: "50%", textAlign: "left" }}>{myShares}</td>
                        </tr>
                        <tr>
                            <td>Win Chance:</td>
                            <td>
                                <strong>{totalShares > 0 ? ((myShares / totalShares) * 100).toFixed(2) : '0.00'}%</strong>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <br />

                <p style={{visibility: (availableWinWithdrawals > 0) ? 'visible' : 'hidden'}}>
                        <h4>You have won a price!</h4>
                        <Button appearance="ghost" onClick={showModal} block disabled={lotteryWithdrawLocked} loading={lotteryWithdrawLocked}>
                            Claim CryptoLandscape
                        </Button>
                    </p>
                {isOwner && (
                    <>
                        <Divider />
                        <h4>ADMIN FUNCTIONS</h4>
                        <br />

                        <table style={{ width: "100%" }}>
                            <tbody>
                                <tr>
                                    <td># of participants:</td>
                                    <td>{participants?.length}</td>
                                </tr>
                                <tr>
                                    <td># of shares:</td>
                                    <td>
                                        {totalShares} ({(totalShares * 0.0005).toFixed(4)} ETH)
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <br />
                        <Button appearance="ghost" block loading={lotteryAdminLocked} disabled={lotteryAdminLocked} onClick={tryResolve}>
                            Resolve lottery
                        </Button>
                        <br />
                        <span>Participants</span>
                        <List size="sm" bordered={false} hover={false} sortable={false}>
                            {participants.map((e) => (
                                <List.Item key={e}>{e.substr(0, 6) + "..." + e.substr(e.length - 4, e.length)}</List.Item>
                            ))}
                            {participants.length === 0 && <span>No participants yet</span>}
                        </List>
                    </>
                )}
            </div>
        </>
    );
}
