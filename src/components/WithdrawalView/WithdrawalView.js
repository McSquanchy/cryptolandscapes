import { Button, Panel } from "rsuite";
import contractService from "../../web3/contract.service";

export default function WithdrawalView() {
    const withdraw = () => {
        contractService.withdraw();
    };

    return (
        <div>
            <h4>Withdrawal</h4>
            <Button onClick={withdraw}>Withdraw</Button>
        </div>
    );
}
