import { useState } from "react";
import { Alert, Button, ControlLabel, Form, FormControl, FormGroup, Icon, Modal } from "rsuite";
import { useUiState } from "../../hooks/landscapes";
import { navTo } from "../../nav";
import ContractService from "../../web3/contract.service";
import ChangeProcessingHint from "../ChangeProcessingHint";

export default function TransferOwnershipView({ landscapeId }) {
    const [formValue, setFormValue] = useState();
    const [confirmOpened, setConfirmOpened] = useState(false);
    const [isTransferInProgress] = useUiState(landscapeId, "processingOwnershipTransfer");
    const [valid, setValid] = useState(true);

    const submitForm = () => {
        if (formValue && formValue["newOwnerAddress"] !== "" && ContractService.isValidAddress(formValue["newOwnerAddress"])) {
            setConfirmOpened(true);
            setValid(true);
        } else {
            setValid(false);
        }
    };
    const executeTransfer = async () => {
        try {
            setConfirmOpened(false);
            await ContractService.transferOwnership(landscapeId, formValue["newOwnerAddress"]);
            navTo({ keyword: "my-landscapes" });
        } catch (e) {
            Alert.error("Transfer failed");
            console.error(e);
        }
    };

    const cancelTransfer = () => {
        setConfirmOpened(false);
    };

    return (
        <div>
            <h4>Transfer ownership</h4>
            <Form layout="inline" onChange={setFormValue}>
                <FormGroup>
                    <ControlLabel>Address of new owner</ControlLabel>
                    <FormControl name="newOwnerAddress" size="lg" errorMessage={!valid ? "Invalid target address" : null} />
                </FormGroup>
                <Button disabled={isTransferInProgress} appearance="ghost" onClick={submitForm}>
                    Transfer
                </Button>
                <ChangeProcessingHint processing={isTransferInProgress} />
            </Form>

            <Modal backdrop="static" show={confirmOpened} onHide={cancelTransfer} size="xs">
                <Modal.Body>
                    <Icon
                        icon="remind"
                        style={{
                            color: "#ffb300",
                            fontSize: 60,
                        }}
                    />
                    {"  "}
                    <br />
                    This action will transfer ownership of this landscape to new address:
                    <pre>{(formValue || {})["newOwnerAddress"]}</pre>
                    This operation cannot be undone.
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={executeTransfer} appearance="primary" color="red">
                        Transfer
                    </Button>
                    <Button onClick={cancelTransfer} appearance="subtle">
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
