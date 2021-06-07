import { useSelector } from "react-redux";
import { Nav, Navbar } from "rsuite";

export default function NavigationBar(props) {
    const currKeyword = useSelector((state) => state.app.navState?.keyword);


    const navigate = (keyword) => {
        return e => {
            props.navigate({ keyword: keyword });
        }
        
    };

    return (
        <Navbar>
            <Navbar.Header>
                <a href="#home" onClick={e => {e.preventDefault(); navigate("my-landscapes")()}} className="navbar-brand logo">
                    CryptoLandscapes
                </a>
            </Navbar.Header>
            <Navbar.Body>
                <Nav>
                    <Nav.Item active={currKeyword === "my-landscapes"} onSelect={navigate("my-landscapes")}>
                        My Landscapes
                    </Nav.Item>
                    <Nav.Item active={currKeyword === "my-auctions"} onSelect={navigate("my-auctions")}>
                        My Auctions
                    </Nav.Item>
                    <Nav.Item active={currKeyword === "all-landscapes"} onSelect={navigate("all-landscapes")}>
                        All Landscapes
                    </Nav.Item>
                    <Nav.Item active={currKeyword === "all-auctions"} onSelect={navigate("all-auctions")}>
                        All Auctions
                    </Nav.Item>
                </Nav>
            </Navbar.Body>
        </Navbar>
    );
}
