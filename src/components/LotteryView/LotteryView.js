import { useSelector } from "react-redux";
import { Button, InputNumber } from "rsuite";
import contractService from "../../web3/contract.service";
import { noParticipants } from "../../web3/notifications";

export default function LotteryView() {
  const lotteryLocked = useSelector((state) => state.lottery.locked);
  const isParticipating = useSelector((state) => state.lottery.participating);
  const isOwner = useSelector((state) => state.app.owner);
  const myShares = useSelector((state) => state.lottery.myShares);
  const totalShares = useSelector((state) => state.lottery.totalShares);
  const participants = useSelector((state) => state.lottery.participants);
  const listItems = participants.map((e) => <li key={participants.indexOf(e)}>{e.substr(0, 6) + '...' + e.substr(e.length-4, e.length)}</li>);
  
  let buyAmount = 1;
  const changeBuy = (e) => {buyAmount = e};
  const tryResolve = () => {if (participants.length > 0) contractService.resolveLottery(); else noParticipants();};

  if (isParticipating) {
    return (
      <fieldset>
        <legend>Lottery</legend>
        <span>Waiting for lottery ending...</span>
        <br />
        <br />
        <InputNumber min={1} max={10} defaultValue={1} onChange={changeBuy} />
        <br />
        <Button
          disabled={lotteryLocked}
          onClick={() => contractService.participateLottery(buyAmount)}
        >
          Buy more Shares
        </Button>
        {isOwner && (
          <>
            <br />
            <br />
            <Button
              disabled={lotteryLocked}
              onClick={tryResolve}
            >
              Resolve lottery
            </Button>
            <br />

            {participants.length > 0 && !lotteryLocked && (
              <>
                <br />
                <span>Participants:</span>
                <br />
                <ul>{listItems}</ul>
              </>
            )}
          </>
        )}
        {!lotteryLocked && (
          <>
            <span>My shares: {myShares}</span>
            <br />
            <span>Winning Probability: {((myShares / totalShares) * 100).toFixed(2)}%</span>
          </>
        )}
      </fieldset>
    );
  } else {
    return (
      <fieldset>
        <legend>Lottery</legend>
        <Button
          disabled={lotteryLocked}
          onClick={() => contractService.participateLottery(1)}
        >
          Participate in lottery
        </Button>
        {isOwner && (
          <>
            <Button
              disabled={lotteryLocked}
              onClick={tryResolve}
            >
              Resolve lottery
            </Button>
            {totalShares > 0 &&
              <>
              <br />
              <span>Total shares bought: {totalShares}</span>
              <br />
              </>
            }
            {participants.length > 0 && !lotteryLocked && (
              <>
                <br />
                <span>Participants:</span>
                <br />
                <ul>{listItems}</ul>
              </>
            )}
          </>
        )}
      </fieldset>
    );
  }
}
