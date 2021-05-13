blch - Gruppe 2
# Idee 1.0:
* DNA für generierung  Collectible (Farben, Transparenz...)
* Jeder bekommt jede Adresse ein Collectible
* Jedes Collectible hat einen Besitzer
* Kombination Lotterie/Collectibles
* Collectibleer können nach Gewinn verkauft werden
    * Benutzer können Collectible für Auktion frei geben
    * Andere User können für ein Collectible bieten
    * Nach Ablauf der Zeit gewinnt der Meistbietende das Collectible
* Collectible können Namen zugewiesen werden, welche auch geändert werden können

## Technische Umsetzungen
* React Page
* Kovan Testnet
* Truffle


# How to start

* `npm run start`


# How to deploy contract

1. `npm install truffle -g`
2. Put your secret phrase into `.secret`:
```
{
   "mnemonic": "<YOUR-SECRET-MNEMONIC>",
   "projectId": "<YOUR_INFURE_PROJECT_KEY>"
}
```
2. Run `truffle deploy --reset` to deploy a new smart contract