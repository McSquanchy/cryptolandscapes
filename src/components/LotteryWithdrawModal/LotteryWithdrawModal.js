import { useState } from "react";
import { useSelector } from "react-redux";
import { Button, Modal, Form, FormGroup, ControlLabel, FormControl, Schema, ButtonToolbar } from "rsuite";
import contractService from "../../web3/contract.service";
import store from "../../state/store";
import {
    setShowWithdrawModal,
} from "../../state/slices/lottery.reducer";


export default function LotteryWithdrawModal() {
    const [formValue, setFormValue] = useState();
    const showWithdrawModal = useSelector((state) => state.lottery.showWithdrawModal);

    const closeModal = () => {
        store.dispatch(setShowWithdrawModal(false));
    }

    const submitForm = () => {
        contractService.collectWin(formValue["name"]);
        store.dispatch(setShowWithdrawModal(false));
    }

    const { StringType } = Schema.Types;
    const model = Schema.Model({
        name: StringType().isRequired('This field is required.')
    });

    return(
        <Modal show={showWithdrawModal} onHide={closeModal}>
          <Modal.Header>
            <Modal.Title>Collect your NFT</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <Form model={model} onChange={setFormValue}>
                <FormGroup>
                <ControlLabel>Name</ControlLabel>
                <FormControl name="name" />
                </FormGroup>
                <ButtonToolbar>
                <Button appearance="primary" type="submit" onClick={submitForm}>
                    Submit
                </Button>
                </ButtonToolbar>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={closeModal} appearance="subtle">
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
    );
}