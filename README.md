# MetaMask-Forensics
Forensic Analysis of MetaMask


# 0. Install
- Node(tested on v18.10.0)
- `npm install levelup leveldown`

# 1. Parse MetaMask LevelDB

## 1.1. Copy LevelDB

Browser extensions of MetaMask are stored on
- Chrome: `%USERNAME%\AppData\Local\Google\Chrome\User Data\{Profile}\Extensions\{ID}\{VER}\`
  - ID: nkbihfbeogaeaoehlefnkodbefgpgknn
- Edge: `%USERNAME%\AppData\Local\Microsoft\Edge\User Data\{PROFILE}\Extensions\{ID}\{VER}`
  - ID: ejbalbakoplchlghecdalmeeeajnimhm


Copy the folder and paste to another location.

## 1.2. Configuration

replace `PATH` variable to your folder location

```javascript
// PATH OF LevelDB
const PATH = '[PATH OF LEVELDB]'
```

## 1.3. Execute

```bash
node parseLevelDB.js 
```

Sample Result
```text
➜  2022_MetaMask git:(main) ✗ node parseLevelDB.js
###### AddressBookController ######
AddressList in network 0x5
{"0x7Ed746476A7F6520BABD24eeE1fDbCD0F7FB271f":{"address":"0x7Ed746476A7F6520BABD24eeE1fDbCD0F7FB271f","chainId":"0x5","isEns":false,"memo":"","name":""}}


###### AppStateController ######
User OS: win, browser: chrome(may be incorrect)


###### CachedBalancesController ######
Balance #1 (provider 0x1)
{"0x49d26a887758e12c57a94ef20ee84e28ea5a6b4b":"0x0"}
Balance #2 (provider 0x5)
{"0x49d26a887758e12c57a94ef20ee84e28ea5a6b4b":"0x160a16867c16c18"}


###### CurrencyController ######
Last Sync Time(User access time): 2022-10-17T13:45:33.000Z


###### IncomingTransactionsController ######
Incoming Transaction #1, 0x354761830fd43093bcc3ad567329630a24afa122a5073d8629dca74fd44e311c
{"blockNumber":"7785255","chainId":"0x5","hash":"0x354761830fd43093bcc3ad567329630a24afa122a5073d8629dca74fd44e311c","id":1047731694428588,"metamaskNetworkId":"5","status":"confirmed","time":1666010868000,"txParams":{"from":"0x7ed746476a7f6520babd24eee1fdbcd0f7fb271f","gas":"0xa410","gasPrice":"0x45361f3b0","nonce":"0x1b56d","to":"0x49d26a887758e12c57a94ef20ee84e28ea5a6b4b","value":"0x16345785d8a0000"},"type":"incoming"}
Incoming Transaction #2, 0xa5e9cc05712470ad8ab40bf4e14dcd41af8c41e79670f6813c6e4925911f6a60
{"blockNumber":"7785479","chainId":"0x5","hash":"0xa5e9cc05712470ad8ab40bf4e14dcd41af8c41e79670f6813c6e4925911f6a60","id":3900121443198328,"metamaskNetworkId":"5","status":"confirmed","time":1666014312000,"txParams":{"from":"0xd4a690155e7d84928a6de26088976b91108496ef","gas":"0x5208","gasPrice":"0x685b97e58","nonce":"0x0","to":"0x49d26a887758e12c57a94ef20ee84e28ea5a6b4b","value":"0x6a94d74f430000"},"type":"incoming"}


###### MetaMetricsController ######


###### NetworkController ######
Now: {"chainId":"0x5","nickname":"","rpcUrl":"","ticker":"GoerliETH","type":"goerli"}
Previous: {"chainId":"0x5","nickname":"","rpcUrl":"","ticker":"GoerliETH","type":"goerli"}


###### PreferencesController ######
Selected Identity: "0x49d26a887758e12c57a94ef20ee84e28ea5a6b4b"
Identity #1
{"address":"0x49d26a887758e12c57a94ef20ee84e28ea5a6b4b","lastSelected":1666010210720,"name":"Account 1"}


###### SubjectMetadataController ######
Recentely visited #1
name: MetaMask < = > Ledger Bridge, origin: https://metamask.github.io
Recentely visited #2
name: ogs.google.com, origin: https://ogs.google.com


###### TokensController ######


###### TransactionController ######
Outgoing Transaction #1, 0x111f00299d26ebe5d5b0e6317e5b7faef4d5f6b3803176d1212716848fc1defa
status: dropped, time: 2022-10-17T13:31:39.601Z, submittedTime: 2022-10-17T13:31:46.330Z
{"from":"0x49d26a887758e12c57a94ef20ee84e28ea5a6b4b","gas":"0x5208","maxFeePerGas":"0x71dc49071","maxPriorityFeePerGas":"0x59682f00","nonce":"0x1","to":"0x7ed746476a7f6520babd24eee1fdbcd0f7fb271f","type":"0x2","value":"0x470de4df820000"}
Outgoing Transaction #2, 0xde1d53e104c0e9256aa54cb6449dcec7a3f0b924557e6a49aafb5a9f781c1ec1
status: confirmed, time: 2022-10-17T13:31:57.022Z, submittedTime: 2022-10-17T13:31:58.034Z
{"estimateSuggested":"medium","estimateUsed":"high","from":"0x49d26a887758e12c57a94ef20ee84e28ea5a6b4b","gas":"0x5208","maxFeePerGas":"0x8fcb36409","maxPriorityFeePerGas":"0x77359400","nonce":"0x1","to":"0x7ed746476a7f6520babd24eee1fdbcd0f7fb271f","type":"0x2","value":"0x470de4df820000"}


###### firstTimeInfo ######
date: 2022-10-17T12:36:08.938Z
version: 10.20.0


Done!!
```

# 2. Extract Mnemonic Code

## 2.1. Configuration

replace `PATH` variable to your folder location

```javascript
// PATH OF LevelDB
const PATH = '[PATH OF LEVELDB]'
```

## 2.2. Execute
```bash
node parseLevelDB.js 
```

It needs User Password, which is same with login password.

Sample Result
```
➜  2022_MetaMask git:(main) ✗ node extractMnemonic.js
Password: [USER_INPUT_PASSWORD]
[
  {
    type: 'HD Key Tree',
    data: {
      mnemonic: [USER_RESTORED_MNEMONIC_CODE],
      numberOfAccounts: 1,
      hdPath: "m/44'/60'/0'/0"
    }
  },
  {
    type: 'Ledger Hardware',
    data: {
      hdPath: "m/44'/60'/0'",
      accounts: [],
      accountDetails: {},
      bridgeUrl: 'https://metamask.github.io/eth-ledger-bridge-keyring',
      implementFullBIP44: false
    }
  }
]
```
