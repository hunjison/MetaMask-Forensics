// PATH OF LevelDB
const PATH = ''

var levelup = require('levelup');
var leveldown = require('leveldown');

function toDate(unixTimestamp) {
    if(isNaN(unixTimestamp)){
        return null;
    }
    if(unixTimestamp > 10**10) {
        return new Date(unixTimestamp).toISOString();
    } else {
        return new Date(unixTimestamp*1000).toISOString();
    }
}

function AddressBookController(key, data){
    console.log(`###### ${key} ######`);
    var addressList = data[key].addressBook;
    for(network in addressList){
        console.log(`AddressList in network ${network}`);
        console.log(JSON.stringify(addressList[network]));
    }
    console.log('\n')
}
function AppStateController(key, data){
    console.log(`###### ${key} ######`);
    var appState = data[key].browserEnvironment;
    console.log(`User OS: ${appState.os}, browser: ${appState.browser}(may be incorrect)`)
    console.log('\n')
}

function CachedBalancesController(key, data){
    console.log(`###### ${key} ######`);
    var balanceList = data[key].cachedBalances
    var balanceNumbering = 0
    for(key in balanceList){
        balanceNumbering += 1
        console.log(`Balance #${balanceNumbering} (provider ${key})`)
        console.log(JSON.stringify(balanceList[key]))
    }
    console.log('\n')
}

function CurrencyController(key, data){
    console.log(`###### ${key} ######`);
    var conversionDate = parseInt(data[key].conversionDate);
    console.log(`Last Sync Time(User access time): ${toDate(conversionDate)}`)
    console.log('\n')
}

function IncomingTransactionsController(key, data){
    console.log(`###### ${key} ######`);
    var incomingTransactionList = data[key].incomingTransactions
    var incomingTransactionNumbering = 0
    for(TxnHash in incomingTransactionList){
        incomingTransactionNumbering += 1
        console.log(`Incoming Transaction #${incomingTransactionNumbering}, ${TxnHash}`)
        console.log(JSON.stringify(incomingTransactionList[TxnHash]))
    }
    console.log('\n')
}

function MetaMetricsController(key, data){
    console.log(`###### ${key} ######`);
    var fragements = data[key].fragments;
    var transNumbering = 0;
    for(trans in fragements){
        transNumbering += 1;
        console.log(`Transaction Fragments ${transNumbering}`);
        console.log(JSON.stringify(fragements[trans]));
    }
    console.log('\n')
}

function NetworkController(key, data){
    console.log(`###### ${key} ######`);
    console.log('Now: ' + JSON.stringify(data[key].provider))
    console.log('Previous: ' + JSON.stringify(data[key].previousProviderStore))
    console.log('\n')
}

function PermissionController(key, data){
    console.log(`###### ${key} ######`);
    var subjects = data[key].subjects;
    var subjectNumbering = 0;
    for(url in subjects){
        subjectNumbering += 1;
        console.log(`Permission subjects #${subjectNumbering}`);
        console.log(JSON.stringify(subjects[url]));
    }
    console.log('\n')
}

function PreferencesController(key, data){
    console.log(`###### ${key} ######`);
    console.log('Selected Identity: ' + JSON.stringify(data[key].selectedAddress))
    var identities = data[key].identities
    var identityNumbering = 0
    for(identity in identities){
        identityNumbering += 1
        console.log(`Identity #${identityNumbering}`)
        console.log(JSON.stringify(identities[identity]))
    console.log('\n')
    }
}

function SubjectMetadataController(key, data){
    console.log(`###### ${key} ######`);
    var subjects = data[key].subjectMetadata;
    var subjectNumbering = 0;
    for(url in subjects){
        subjectNumbering += 1;
        console.log(`Recentely visited #${subjectNumbering}`);
        console.log(`name: ${subjects[url].name}, origin: ${subjects[url].origin}`);
    }
    console.log('\n');
}

function TokensController(key, data){
    console.log(`###### ${key} ######`);
    var allTokens = data[key].allTokens;
    for(network in allTokens){
        console.log(`Token List on Network ${network}`);
        console.log(JSON.stringify(allTokens[network]));
    }
    console.log('\n')
}

function TransactionController(key, data){
    console.log(`###### ${key} ######`);
    var outgoingTransactionList = data[key].transactions
    var outgoingTransactionNumbering = 0
    for(transID in outgoingTransactionList){
        outgoingTransactionNumbering += 1
        var outgoingTransaction = outgoingTransactionList[transID]
        console.log(`Outgoing Transaction #${outgoingTransactionNumbering}, ${outgoingTransaction.hash}`)
        console.log(`status: ${outgoingTransaction.status}, time: ${toDate(outgoingTransaction.time)}, submittedTime: ${toDate(outgoingTransaction.submittedTime)}`)
        console.log(JSON.stringify(outgoingTransaction.txParams))   
    }
    console.log('\n')
}

function firstTimeInfo(key, data){
    console.log(`###### ${key} ######`);
    console.log(`date: ${toDate(data[key].date)}`);
    console.log(`version: ${data[key].version}`);
    console.log('\n');
}

// Analysis Start!
var db = levelup(leveldown(PATH))
db.get('data', function(err, value){

    var data = JSON.parse(value);
    for(key in data){
        switch(key){
            case "AddressBookController":
                AddressBookController(key, data);
                break;
            case "AppStateController":
                AppStateController(key, data);
                break;
            case "CachedBalancesController":
                CachedBalancesController(key, data);
                break;
            case "CurrencyController":
                CurrencyController(key, data);
                break;
            case "IncomingTransactionsController":
                IncomingTransactionsController(key, data);
                break;
            case "MetaMetricsController":
                MetaMetricsController(key, data);
                break;
            case "NetworkController":
                NetworkController(key, data);
                break;
            case "PermissionController":
                PermissionController(key, data);
                break;
            case "PreferencesController":
                PreferencesController(key, data);
                break;
            case "SubjectMetadataController":
                SubjectMetadataController(key, data);
                break;
            case "TokensController":
                TokensController(key, data);
                break;
            case "TransactionController":
                TransactionController(key, data);
                break;
            case "firstTimeInfo":
                firstTimeInfo(key, data);
                break;
        }
    }
    console.log("Done!!");
})