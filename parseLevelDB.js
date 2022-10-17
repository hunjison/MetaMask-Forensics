// PATH OF LevelDB
const PATH = '[PATH OF LEVELDB]'

var levelup = require('levelup');
var leveldown = require('leveldown');

function toDate (unixTimestamp) {  
    return new Date(unixTimestamp).toISOString()
}

var db = levelup(leveldown(PATH))

db.get('data', function(err, value){

    var data = JSON.parse(value)

    console.log('###### Network Provider ######')
    console.log('Now: ' + JSON.stringify(data.NetworkController.provider))
    console.log('Previous: ' + JSON.stringify(data.NetworkController.previousProviderStore))

    console.log('\n##### First Time Info ######')
    console.log('date: ' + toDate(data.firstTimeInfo.date))
    console.log('version: ' + data.firstTimeInfo.version)

    console.log('\n###### Incoming Transactions ######')
    var incomingTransactionList = data.IncomingTransactionsController.incomingTransactions
    var incomingTransactionNumbering = 0
    for(TxnHash in incomingTransactionList){
        incomingTransactionNumbering += 1
        console.log(`Transaction #${incomingTransactionNumbering}, ${TxnHash}`)
        console.log(JSON.stringify(incomingTransactionList[TxnHash]))
    }

    console.log('\n###### Outgoing Transactions ######')
    var outgoingTransactionList = data.TransactionController.transactions
    var outgoingTransactionNumbering = 0
    for(transID in outgoingTransactionList){
        outgoingTransactionNumbering += 1
        var outgoingTransaction = outgoingTransactionList[transID]
        console.log(`Transaction #${outgoingTransactionNumbering}, ${outgoingTransaction.hash}`)
        console.log(`status: ${outgoingTransaction.status}, time: ${toDate(outgoingTransaction.time)}, submittedTime: ${toDate(outgoingTransaction.time)}`)
        console.log(JSON.stringify(outgoingTransaction.txParams))
        
    }

    console.log('\n###### Identities ######')
    console.log('Selected Identity: ' + JSON.stringify(data.PreferencesController.selectedAddress))
    var identities = data.PreferencesController.identities
    var identityNumbering = 0
    for(identity in identities){
        identityNumbering += 1
        console.log(`Identity #${identityNumbering}`)
        console.log(JSON.stringify(identities[identity]))
    }

    console.log('\n###### Cached Balances ######')
    var balanceList = data.CachedBalancesController.cachedBalances
    var balanceNumbering = 0
    for(key in balanceList){
        balanceNumbering += 1
        console.log(`Balance #${balanceNumbering} (provider ${key})`)
        console.log(JSON.stringify(balanceList[key]))
    }

    // Dump Full LevelDB for debugging
    // console.log(JSON.stringify(data))
})