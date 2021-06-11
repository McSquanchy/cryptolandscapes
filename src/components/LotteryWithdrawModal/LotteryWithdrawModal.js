import { useState } from "react";
import { useSelector } from "react-redux";
import { Button, Modal, Form, FormGroup, ControlLabel, FormControl, Schema } from "rsuite";
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
        <Modal show={showWithdrawModal} onHide={closeModal} size="xs">
          <Modal.Header>
            <Modal.Title>🥳🎊🎉🎊🥳🎉🎊🎉🥳🎊🎉🎊🥳</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p style={{textAlign: 'center'}}>🥳🎊🎉🎊🥳🎉🎊🎉🥳🎊🎉🎊🥳🎉🎊🎉🎊🎉</p>
              <p>
                Congratulations, you have won a CryptoLandscape 🥳🥳
              </p>
              <br />
              <Form model={model} onChange={setFormValue} fluid>
                <FormGroup>
                <ControlLabel>Name</ControlLabel>
                <FormControl name="name" />
                </FormGroup>
            </Form>
            <p style={{textAlign: 'center',margin: '0.3em'}}>🥳🎊🎉🎊🥳🎉🎊🎉🥳🎊🎉🎊🥳🎉🎊🎉🎊🎉</p>
          </Modal.Body>
          <Modal.Footer>
          <Button appearance="primary" onClick={submitForm}>
                    Submit
                </Button>
            <Button onClick={closeModal} appearance="subtle">
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
    );
}