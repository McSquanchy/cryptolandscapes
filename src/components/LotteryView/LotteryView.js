import { useSelector } from "react-redux";
import { Button, InputNumber } from "rsuite";
import contractService from "../../web3/contract.service";
import { noParticipants } from "../../web3/notifications";
import LotteryWithdrawModal from "../LotteryWithdrawModal/LotteryWithdrawModal";
import store from "../../state/store";
import {
    setShowWithdrawModal,
} from "../../state/slices/lottery.reducer";

export default function LotteryView() {
  const lotteryLocked = useSelector((state) => state.lottery.locked);
  const withdrawLocked = useSelector((state) => state.lottery.withdrawLocked);
  const isParticipating = useSelector((state) => state.lottery.participating);
  const isOwner = useSelector((state) => state.app.owner);
  const myShares = useSelector((state) => state.lottery.myShares);
  const totalShares = useSelector((state) => state.lottery.totalShares);
  const participants = useSelector((state) => state.lottery.participants);
  const availableWinWithdrawals = useSelector(
    (state) => state.lottery.availableWinWithdrawals
  );
  const listItems = participants.map((e) => (
    <li key={participants.indexOf(e)}>
      {e.substr(0, 6) + "..." + e.substr(e.length - 4, e.length)}
    </li>
  ));

  const showModal = () => {
    store.dispatch(setShowWithdrawModal(true));
  }

  let buyAmount = 1;
  const changeBuy = (e) => {
    buyAmount = e;
  };
  const tryResolve = () => {
    if (participants.length > 0) contractService.resolveLottery();
    else noParticipants();
  };

  const withdraw = () => {
    contractService.withdraw();
  };

  return (
    <>
    <LotteryWithdrawModal/>
      {isParticipating ? (
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
              <Button disabled={lotteryLocked} onClick={tryResolve}>
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
              <span>
                Winning Probability:{" "}
                {((myShares / totalShares) * 100).toFixed(2)}%
              </span>
            </>
          )}
        </fieldset>
      ) : (
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
              <br />
              <br />
              <Button disabled={lotteryLocked} onClick={tryResolve}>
                Resolve lottery
              </Button>
              {totalShares > 0 && (
                <>
                  <br />
                  <br />
                  <span>Total shares bought: {totalShares}</span>
                  <br />
                </>
              )}
              {participants.length > 0 && !lotteryLocked && (
                <>
                  <br />
                  <br />
                  <span>Participants:</span>
                  <br />
                  <ul>{listItems}</ul>
                </>
              )}
            </>
          )}
          {availableWinWithdrawals > 0 && (
            <>
              <br />
              <br />
              <span>Available Rewards: {availableWinWithdrawals}</span>
              <br />
              <Button onClick={showModal} disabled={withdrawLocked || lotteryLocked}>
                Collect Reward
              </Button>
            </>
          )}
        </fieldset>
      )}

      <fieldset>
        <legend>Auction</legend>

        <Button disabled={lotteryLocked} onClick={withdraw}>
          Withdraw
        </Button>
      </fieldset>
    </>
  );
}
