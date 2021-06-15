# blch - Gruppe 2

# How to start v1.0

. Start a local webserver for the `v1.0` directory
** e.g. `serve -s v1.0`
** e.g. `http-server v1.0`

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
