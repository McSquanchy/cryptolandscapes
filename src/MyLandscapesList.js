import { useSelector } from "react-redux";

export default function MyLandscapesList() {
    const myLandscapes = useSelector((state) => state.myLandscapes.landscapes) || [];

    return (
        <fieldset>
            <legend>My Landscapes</legend>
            <ul>
                {myLandscapes.map((l) => (
                    <li key={l.id}>
                        {l.name} ({l.dna})
                    </li>
                ))}
            </ul>
        </fieldset>
    );
}
