import { useSelector } from "react-redux";
import { Button } from "rsuite";
import contractService from "../../web3/contract.service";

export default function LotteryView() {
    const lotteryLocked = useSelector((state) => state.lottery.locked);
    const isParticipating = useSelector((state) => state.lottery.participating);

    if (isParticipating) {
        return (
            <fieldset>
                <legend>Lottery</legend>
                <span>Waiting for lottery ending...</span>
                <br />
                <Button disabled={lotteryLocked} onClick={contractService.resolveLottery}>
                    Resolve lottery
                </Button>
            </fieldset>
        );
    } else {
        return (
            <fieldset>
                <legend>Lottery</legend>
                <Button disabled={lotteryLocked} onClick={contractService.participateLottery}>
                    Participate in lottery
                </Button>
            </fieldset>
        );
    }
}
