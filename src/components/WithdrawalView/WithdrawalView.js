import { Button, Panel } from "rsuite";
import contractService from "../../web3/contract.service";

export default function WithdrawalView() {
    const withdraw = () => {
        contractService.withdraw();
    };

    return (
        <Panel header="Withdrawal">
            <Button onClick={withdraw}>Withdraw</Button>
        </Panel>
    );
}
