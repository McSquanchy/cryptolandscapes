import { navTo } from "../nav";

export default function AccountAddress({ address }) {
    const navigate = e => {
        e.preventDefault();
        navTo({ keyword: "account-detail", address });
    };
    return (
        <a href={'#account-' + address} onClick={navigate}>
            {address}
        </a>
    );
}
