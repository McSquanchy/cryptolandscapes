import { useState } from "react";
import { Alert, Icon, IconButton, Input, InputGroup } from "rsuite";
import { useUiState } from "../../hooks/landscapes";
import contractService from "../../web3/contract.service";
import ChangeProcessingHint from "../ChangeProcessingHint";

export default function LandscapeNameView({ landscapeId, name, isUserOwner }) {
    const [isChangingName, startChangingName, stopChangingName] = useUiState(landscapeId, "isChangingName");
    const [isProcessingChange] = useUiState(landscapeId, "processingNameChange");
    const [changedName, setChangedName] = useState(name);

    const doNameChange = async () => {
        if (changedName !== name) {
            try {
                await contractService.changeName(landscapeId, changedName);
            } catch (e) {
                Alert.error("Could not change name");
                console.error(e);
            }
        }
        stopChangingName();
    };

    if (isChangingName && !isProcessingChange) {
        return (
            <InputGroup>
                <Input value={changedName} onChange={setChangedName} />
                <InputGroup.Button onClick={doNameChange} appearance="ghost">
                    <Icon icon="check" />
                </InputGroup.Button>
                <InputGroup.Button onClick={stopChangingName} appearance="ghost">
                    <Icon icon="close" />
                </InputGroup.Button>
            </InputGroup>
        );
    } else {
        return (
            <div style={{ display: "flex", flexWrap: "nowrap", flexDirection: "row", alignItems: "center" }}>
                <h3>{name}</h3>
                <div style={{ flex: 1, width: "auto" }}></div>
                <ChangeProcessingHint processing={isProcessingChange} />
                {isUserOwner && !isProcessingChange && (
                    <IconButton
                        appearance="ghost"
                        onClick={() => {
                            startChangingName();
                            setChangedName(name);
                        }}
                        icon={<Icon icon="pencil" />}
                    />
                )}
            </div>
        );
    }
}
