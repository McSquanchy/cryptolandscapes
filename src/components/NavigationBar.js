import { useSelector } from "react-redux";
import { Nav, Navbar } from "rsuite";
import ContractAPI from "../web3/contract.service";

export default function NavigationBar(props) {
    const currKeyword = useSelector(state => state.app.navState?.keyword);

    const navigate = (keyword) => {
        return () => props.navigate({keyword: keyword});
    };

    const withdraw = () => {
        ContractAPI.withdraw();
    };

    return (
        <Navbar>
            <Navbar.Header>
                <a href="#home" onClick={navigate("my-landscapes")} className="navbar-brand logo">
                    NFT Bunker
                </a>
            </Navbar.Header>
            <Navbar.Body>
                <Nav>
                    <Nav.Item active={currKeyword === 'my-landscapes'} onSelect={navigate("my-landscapes")}>My Landscapes</Nav.Item>
                    <Nav.Item active={currKeyword === 'my-auctions'} onSelect={navigate("my-auctions")}>My Auctions</Nav.Item>
                    <Nav.Item active={currKeyword === 'all-landscapes'} onSelect={navigate("all-landscapes")}>All Landscapes</Nav.Item>
                    <Nav.Item active={currKeyword === 'all-auctions'} onSelect={navigate("all-auctions")}>All Auctions</Nav.Item>
                </Nav>
                <Nav pullRight>
                    <Nav.Item onSelect={withdraw}>Withdraw</Nav.Item>
                </Nav>
            </Navbar.Body>
        </Navbar>
    );
}
