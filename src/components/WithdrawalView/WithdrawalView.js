import { Button } from "rsuite";
import contractService from "../../web3/contract.service";

export default function WithdrawalView() {
    const withdraw = () => {
        contractService.withdraw();
    };

    return (
        <div>
            <h4>Withdrawal</h4>
            <Button appearance="ghost" onClick={withdraw}>Withdraw</Button>
        </div>
    );
}
