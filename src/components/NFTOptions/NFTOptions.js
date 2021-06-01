import contractService from "../../web3/contract.service";
import { Button, Input, InputGroup, Icon } from "rsuite";

export default function NFTOptions(props) {
  let newNFTName = "";

  function handleChange(event) {
    newNFTName = event;
  }

  function handleSubmit(id, oldName) {
    if (newNFTName.length < 1) {
      console.log("cannot change to empty string");
    } else if (oldName !== newNFTName) {
      contractService.changeName(id, newNFTName);
    } else {
      console.log("new value equals old one!");
    }
    document.querySelector("#changeNameField" + props.id).value = "";
    newNFTName = "";
  }

  const styles = {
    width: 300,
    marginBottom: 10,
    marginTop: 10,
  };

  return (
    <>
      <InputGroup style={styles}>
        <Input
          id={"changeNameField" + props.id}
          placeholder="Change Name"
          onChange={(e) => handleChange(e)}
        />
        <InputGroup.Button onClick={() => handleSubmit(props.id, props.name)}>
          <Icon icon="check" />
        </InputGroup.Button>
      </InputGroup>
      <Button
        type="button"
        onClick={() =>
          contractService.startAuction(
            props.id,
            Math.ceil(Date.now() / 1000) + 60,
            0
          )
        }
        color="blue"
      >
        Start auction
      </Button>
    </>
  );
}
