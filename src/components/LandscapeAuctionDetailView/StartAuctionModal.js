import { useState } from "react";
import { Button, ControlLabel, Form, FormGroup, InputNumber, Modal } from "rsuite";
import contractService from "../../web3/contract.service";


const fromMillis = (millis) => Math.floor(millis / 1000);

export default function StartAuctionModal({setShowModal, showModal, landscape}){
    const [formValueTime, setFormValueTime] = useState(5);
    const [formValueAmount, setFormValueAmount] = useState(0.001);

    const submitForm = () => {
        setShowModal(false);
        const durationMin = formValueTime * 60;
        contractService.startAuction(landscape.landscapeId, fromMillis(Date.now()) + durationMin, formValueAmount + "");
    };

    return (
        <Modal show={showModal} onHide={() => setShowModal(false)} size="xs">
        <Modal.Header>
            <Modal.Title>Create a new Auction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form fluid>
                <FormGroup>
                    <ControlLabel>Duration in Minutes</ControlLabel>
                    <InputNumber value={formValueTime} step={1} onChange={setFormValueTime} min={1} />
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Startprice</ControlLabel>
                    <InputNumber value={formValueAmount} step={0.001} onChange={setFormValueAmount} min={0.001} />
                </FormGroup>
            </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button appearance="primary" type="submit" onClick={submitForm}>
                Submit
            </Button>
            <Button onClick={() => setShowModal(false)} appearance="subtle">
                Cancel
            </Button>
        </Modal.Footer>
    </Modal>
    )
}