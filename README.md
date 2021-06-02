blch - Gruppe 2
# Idee 1.0:
* DNA für generierung  Collectible (Farben, Transparenz...)
* Jeder bekommt jede Adresse ein Collectible
* Jedes Collectible hat einen Besitzer
* Kombination Lotterie/Collectibles
* Collectibleer können nach Gewinn verkauft werden
    * Benutzer können Collectible für Auktion frei geben (Mindestpreis, Endzeitpunkt)
    * Liste mit allen laufenden Auktion
      * Mitbieten
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
2. Run `npm run redeploy-contract` to deploy a new smart contract


# Generierung Landscape DNA

* Zufällig
* Nicht abhängig vom Namen, da bei Lotterie immer derselbe Startname verwendet wird.

# Lotterie

* Fixe Teilnahmegebühr um sich einzutragen (0.0005 ETH)
* Der `Resolver` löst die Lotterie auf
   * Er bekommt alle eingezahlten Beiträge (bis zum einem gewissen Maximum (1.0 ETH))
* Der Gewinner der Lotterie erhält ein Landscape.


# TODOs

## Lotterie
* Make resolve visible to contract owner only
* Display number of participants and winning chance
* Allow for users to buy multiple "tickets"
* Handle auction end / naming of NFT

## Auktion
* Replace standard buttons with rsuite Buttons
* Create LandscapeView for each NFT with an ongoing auction
* Bonusfeature: store user's auction history in browser localstorage and make a display for it

## NFT Detailansicht
* Create info page for each NFT with
   * Display image
   * Allow user to make a bid
   * Show bidding history (for auctions only)
   * Show previous owners (bonus)
   * Allow owner to close auction (only if auction ongoing) / change name / transfer ownership (if no auction ongoing)

## NFT
* Fix landscape viewport size / mask

## Notifications
* Create Notifications for each emitted Event and for lottery participation