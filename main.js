let { ethers, getDefaultProvider } = require('ethers')
let { EthersAdapter, SafeFactory, ContractNetworksConfig} = require('@safe-global/protocol-kit')
let Safe = require('@safe-global/protocol-kit').default
console.log(Safe)
let SafeApiKit = require('@safe-global/api-kit')
let { MetaTransactionData } = require('@safe-global/safe-core-sdk-types')
const web3Provider = "http://54.234.167.187:3044/v1"
const provider = getDefaultProvider(web3Provider)
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
let abiCoder = new ethers.utils.AbiCoder()
// connect the wallet to the provider
// const signer = wallet.connect(provider);
const safeOwner = provider.getSigner(0);
console.log(wallet);
let safeSDK;

const ethAdapterOwner1 = new EthersAdapter({
  ethers,
  signerOrProvider: wallet
})

// or using a custom service
const safeService = new SafeApiKit.default({
  chainId: 336n, // set the correct chainId
  txServiceUrl: "http://54.234.167.187:8000/api/"
})

async function main () {
  const safeFactory = await SafeFactory.create({ ethAdapter: ethAdapterOwner1 })
  console.log(safeFactory);

  const safeAccountConfig = {
    owners: [
      await wallet.getAddress()
    ],
    threshold: 1,
    // ... (Optional params)
  }

  const safeSdkOwner1 = await safeFactory.deploySafe({ safeAccountConfig })
  const safeAddress = await safeSdkOwner1.getAddress()

  console.log('Your Safe has been deployed:')
  console.log(`safeAddress:${safeAddress}`)

}

async function buildTx() {
  return {
    to: await safeSDK.getAddress(),
    data: '0x',
    value: 0
  }
}

async function vote() {
  let ABI = [
    "function vote(bytes32 multisignAccount, uint64 sequence_number, bool approve)",
    "function callMove(bytes32 account, bytes memory data)"
  ];
  let iface = new ethers.utils.Interface(ABI);
  const safeFactory = await SafeFactory.create({ ethAdapter: ethAdapterOwner1 })
  let moveContract = "0x0000000000000000000000000000000000000000000000000000000000000001"
  let precompileContract = "0x0000000000000000000000000000000000000009"
  let safeAddress =        "0x0218e69EA455B4Fa2b2dF10131303A7470f900c6"
  let multiAccount = "0x2322cb51e00e61f53795a1171ce0bb0a3dfd5687573b81d364d32b6d0a993e52"
  safeSDK = await Safe.create({ ethAdapter: ethAdapterOwner1, safeAddress })
  
  // 1.encode the predefine vote calldata, using 1 as 
  // function vote(bytes32 multisignAccount, uint sequenceNumber, bool approve) 
  let calldata = iface.encodeFunctionData("vote", [multiAccount, 1, true]);
  console.log(calldata.toString())

  let txdata = iface.encodeFunctionData("callMove", [moveContract, calldata])
  let safeTransactionData = {
    to: precompileContract,
    data: txdata,
    value: 0
  }

  const safeTransaction = await safeSDK.createTransaction({ safeTransactionData})
  console.log(safeTransaction)

  console.log("sign and propose");
  const safeTxHash = await safeSDK.getTransactionHash(safeTransaction)
  const senderSignature = await safeSDK.signTransactionHash(safeTxHash)
  await safeService.proposeTransaction({
    safeAddress,
    safeTransactionData: safeTransaction.data,
    safeTxHash,
    senderAddress: await wallet.getAddress(),
    senderSignature: senderSignature.data,
  })

  console.log("confirm tx")
  await safeService.confirmTransaction(safeTxHash, senderSignature.data)

  console.log("execute tx");
  const executeTxResponse = await safeSDK.executeTransaction(safeTransaction)
  const receipt = await executeTxResponse.transactionResponse?.wait()

  console.log(`Transaction executed:${receipt}`, receipt);
}

async function run() {
  // Any address can be used. In this example you will use vitalik.eth
  const destination = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
  const amount = 1e15.toString()
  // Create a Safe transaction with the provided parameters

  const safeAccountConfig = {
    owners: [
      await wallet.getAddress()
    ],
    threshold: 1
    // ... (Optional params)
  }

  const safeFactory = await SafeFactory.create({ ethAdapter: ethAdapterOwner1 })
  console.log("deploy safe");
  safeSDK = await safeFactory.deploySafe({ safeAccountConfig, saltNonce: parseInt(Math.random() * 1e8)  })
  const safeAddress = await safeSDK.getAddress()
  console.log(`safe address: ${safeAddress}`)

  // const safeTransactionData = await buildTx();

  // const tx = await wallet.sendTransaction(transactionParameters)
  // console.log('Fundraising.')
  // console.log(`Deposit Transaction: https://goerli.etherscan.io/tx/${tx.hash}`)
  // console.log(`Initial balance of Safe: ${await safeSDK.getBalance()} ETH`)

  // const safeTransaction = await safeSDK.createTransaction({ safeTransactionData})
  // console.log(safeTransaction)

  // console.log("sign and propose");
  // const safeTxHash = await safeSDK.getTransactionHash(safeTransaction)
  // const senderSignature = await safeSDK.signTransactionHash(safeTxHash)
  // await safeService.proposeTransaction({
  //   safeAddress,
  //   safeTransactionData: safeTransaction.data,
  //   safeTxHash,
  //   senderAddress: await wallet.getAddress(),
  //   senderSignature: senderSignature.data,
  // })

  // console.log("confirm tx")
  // const response = await safeService.confirmTransaction(safeTxHash, senderSignature.data)

  // console.log("execute tx");
  // const executeTxResponse = await safeSDK.executeTransaction(safeTransaction)
  // const receipt = await executeTxResponse.transactionResponse?.wait()

  // console.log('Transaction executed:')
  // console.log(`https://goerli.etherscan.io/tx/${receipt.transactionHash}`)

  // console.log(`The final balance of the Safe: ${await safeSDK.getBalance()} ETH`)


  // console.log(`Deposit Transaction: https://goerli.etherscan.io/tx/${tx.hash}`)
}

vote().then()