# Project Overview

This project is a JavaScript application that interacts with the Aptos and Safe protocols. It is designed to perform a series of operations such as deploying a new Safe contract, setting up a new Move multisig account, and voting on a Safe contract.

## Dependencies

The project uses several npm packages:

- `ethers`: Ethereum wallet and utilities.
- `@safe-global/protocol-kit`: A toolkit for interacting with the Safe protocol.
- `aptos`: A library for interacting with the Aptos protocol.
- `dotenv`: A zero-dependency module that loads environment variables from a `.env` file into `process.env`.

## Key Functions

The application includes several key functions:

- `deploySafe()`: Deploys a new Safe contract.
- `setupMoveMultisigAccount(safeAddress)`: Sets up a new Move multisig account.
- `vote(safeAddress, multiAccount)`: Votes on a Safe contract.
- `checkSafeContractVoted(safeAddress, multiAccount)`: Checks if a Safe contract has voted.
- `submitTx(rawTxn)`: Submits a transaction.
- `fix(multiAccount)`: Fixes the multiAccount address.

## Running the Application

The main function `run()` orchestrates the operations. It first deploys a new Safe contract, then sets up a new Move multisig account, and finally votes on the Safe contract.

```javascript
async function run() {
  let safeAddress = await deploySafe()
  let multiAccount = fix(await setupMoveMultisigAccount(safeAddress))
  await vote(safeAddress, multiAccount)
}
```

The application is run by calling `run().then()`.

## Environment Variables

The application uses several environment variables, which should be set in a `.env` file in the project root:

- `APTOS_RPC_ENDPOINT`: The RPC endpoint for the Aptos client.
- `MOVE_OWNER_PK`: The private key of the Move owner.
- `MOVE_MULTISIG_OTHER_OWNER_ADDR`: The address of the other owner of the Move multisig account.
- `EVM_RPC_ENDPOINT`: The RPC endpoint for the EVM.
- `EVM_OWNER_PK`: The private key of the EVM owner.
- `SAFE_SERVICE_API`: The API endpoint for the Safe service.
- `EVM_PRECOMPILE_CONTRACT`: The address of the EVM precompile contract.
- `MOVE_FRAMEWORK`: The address of the Move framework.

## Note

This is a basic overview of the project. For more detailed information, please refer to the comments in the source code.
