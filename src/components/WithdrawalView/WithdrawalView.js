import { useSelector } from "react-redux";
import { Button } from "rsuite";
import contractService from "../../web3/contract.service";

export default function WithdrawalView() {
    const myBalance = useSelector((state) => state.app.withdrawableEth);
    const withdrawing = useSelector((state) => state.app.isWithdrawing);
    const withdraw = () => {
        contractService.withdraw();
    };

    return (
        <div>
            <h4>Withdrawal</h4>
            <table style={{ width: "100%" }}>
                <tbody>
                    <tr>
                        <td>Credit:</td>
                        <td style={{ width: "50%", textAlign: "left" }}>{Number(myBalance).toFixed(3)} ETH</td>
                    </tr>
                </tbody>
            </table>
            <br />
            <Button block appearance="ghost" onClick={withdraw} disabled={withdrawing} loading={withdrawing}>Withdraw</Button>
        </div>
    );
}
