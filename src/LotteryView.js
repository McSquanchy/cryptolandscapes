import { useSelector } from "react-redux";
import contractService from "./web3/contract.service";

export default function LotteryView() {
    const lotteryLocked = useSelector((state) => state.lottery.locked);
    const isParticipating = useSelector((state) => state.lottery.participating);

    if (isParticipating) {
        return (
            <fieldset>
                <legend>Lottery</legend>
                <span>Waiting for lottery ending...</span>
                <br />
                <button type="button" disabled={lotteryLocked} onClick={contractService.resolveLottery}>
                    Resolve lottery
                </button>
            </fieldset>
        );
    } else {
        return (
            <fieldset>
                <legend>Lottery</legend>
                <button type="button" disabled={lotteryLocked} onClick={contractService.participateLottery}>
                    Participate in lottery
                </button>
            </fieldset>
        );
    }
}
