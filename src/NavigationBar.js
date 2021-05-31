import { Nav, Navbar } from "rsuite";
import ContractAPI from "./web3/contract.service";

export default function NavigationBar(props) {
    const navigate = (keyword) => {
        return () => props.navigate(keyword);
    };

    const withdraw = () => {
        ContractAPI.withdraw();
    };

    return (
        <Navbar>
            <Navbar.Header>
                <a href="#home" onClick={navigate("lottery")} className="navbar-brand logo">
                    NFT Bunker
                </a>
            </Navbar.Header>
            <Navbar.Body>
                <Nav>
                    <Nav.Item onSelect={navigate("my-landscapes")}>My Landscapes</Nav.Item>
                    <Nav.Item onSelect={navigate("my-auctions")}>My Landscapes</Nav.Item>
                    <Nav.Item onSelect={navigate("all-landscapes")}>All Landscapes</Nav.Item>
                    <Nav.Item onSelect={navigate("all-auctions")}>Auctions</Nav.Item>
                </Nav>
                <Nav pullRight>
                    <Nav.Item onSelect={withdraw}>Withdraw</Nav.Item>
                </Nav>
            </Navbar.Body>
        </Navbar>
    );
}
