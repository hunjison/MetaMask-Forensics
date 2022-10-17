// PATH OF LevelDB
const PATH = '[PATH OF LEVELDB]'

// hunjison added
let crypto;
try {
  crypto = require('node:crypto');
} catch (err) {
  console.log('crypto support is disabled!');
}

var levelup = require('levelup');
var leveldown = require('leveldown');

var db = levelup(leveldown(PATH))

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
});

function atob(s) {
    var e={},i,b=0,c,x,l=0,a,r='',w=String.fromCharCode,L=s.length;
    var A="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    for(i=0;i<64;i++){e[A.charAt(i)]=i;}
    for(x=0;x<L;x++){
        c=e[s.charAt(x)];b=(b<<6)+c;l+=6;
        while(l>=8){((a=(b>>>(l-=8))&0xff)||(x<(L-2)))&&(r+=w(a));}
    }
    return r;
};

// https://github.com/nujabes403/metamaskVaultDecrypt/blob/master/decrypt.js
function utf8ToBinaryString(str) {
  var escstr = encodeURIComponent(str);
  // replaces any uri escape sequence, such as %0A,
  // with binary escape, such as 0x0A
  var binstr = escstr.replace(/%([0-9A-F]{2})/g, function(match, p1) {
    return String.fromCharCode(parseInt(p1, 16));
  });

  return binstr;
}

function utf8ToBuffer(str) {
  var binstr = utf8ToBinaryString(str);
  var buf = binaryStringToBuffer(binstr);
  return buf;
}

function utf8ToBase64(str) {
  var binstr = utf8ToBinaryString(str);
  return btoa(binstr);
}

function binaryStringToUtf8(binstr) {
  var escstr = binstr.replace(/(.)/g, function (m, p) {
    var code = p.charCodeAt(0).toString(16).toUpperCase();
    if (code.length < 2) {
      code = '0' + code;
    }
    return '%' + code;
  });

  return decodeURIComponent(escstr);
}

function bufferToUtf8(buf) {
  var binstr = bufferToBinaryString(buf);

  return binaryStringToUtf8(binstr);
}

function base64ToUtf8(b64) {
  var binstr = atob(b64);

  return binaryStringToUtf8(binstr);
}

function bufferToBinaryString(buf) {
  var binstr = Array.prototype.map.call(buf, function (ch) {
    return String.fromCharCode(ch);
  }).join('');

  return binstr;
}

function bufferToBase64(arr) {
  var binstr = bufferToBinaryString(arr);
  return btoa(binstr);
}

function binaryStringToBuffer(binstr) {
  var buf;

  if ('undefined' !== typeof Uint8Array) {
    buf = new Uint8Array(binstr.length);
  } else {
    buf = [];
  }

  Array.prototype.forEach.call(binstr, function (ch, i) {
    buf[i] = ch.charCodeAt(0);
  });

  return buf;
}

function base64ToBuffer(base64) {
  var binstr = atob(base64);
  var buf = binaryStringToBuffer(binstr);
  return buf;
}

const Unibabel = {
    utf8ToBinaryString: utf8ToBinaryString
  , utf8ToBuffer: utf8ToBuffer
  , utf8ToBase64: utf8ToBase64
  , binaryStringToUtf8: binaryStringToUtf8
  , bufferToUtf8: bufferToUtf8
  , base64ToUtf8: base64ToUtf8
  , bufferToBinaryString: bufferToBinaryString
  , bufferToBase64: bufferToBase64
  , binaryStringToBuffer: binaryStringToBuffer
  , base64ToBuffer: base64ToBuffer
  
  // compat
  , strToUtf8Arr: utf8ToBuffer
  , utf8ArrToStr: bufferToUtf8
  , arrToBase64: bufferToBase64
  , base64ToArr: base64ToBuffer
  };

// Takes a Pojo, returns cypher text.
function encrypt (password, dataObj) {
  var salt = generateSalt()

  return keyFromPassword(password, salt)
  .then(function (passwordDerivedKey) {
    return encryptWithKey(passwordDerivedKey, dataObj)
  })
  .then(function (payload) {
    payload.salt = salt
    return JSON.stringify(payload)
  })
}

function encryptWithKey (key, dataObj) {
  var data = JSON.stringify(dataObj)
  var dataBuffer = Unibabel.utf8ToBuffer(data)
  var vector = crypto.getRandomValues(new Uint8Array(16))
  return crypto.subtle.encrypt({
    name: 'AES-GCM',
    iv: vector,
  }, key, dataBuffer).then(function (buf) {
    var buffer = new Uint8Array(buf)
    var vectorStr = Unibabel.bufferToBase64(vector)
    var vaultStr = Unibabel.bufferToBase64(buffer)
    return {
      data: vaultStr,
      iv: vectorStr,
    }
  })
}

// Takes encrypted text, returns the restored Pojo.
function decrypt (password, text) {
  const payload = JSON.parse(text)
  const salt = payload.salt
  return keyFromPassword(password, salt)
  .then(function (key) {
    return decryptWithKey(key, payload)
  })
}

function decryptWithKey (key, payload) {
  const encryptedData = Unibabel.base64ToBuffer(payload.data)
  const vector = Unibabel.base64ToBuffer(payload.iv)
  return crypto.subtle.decrypt({name: 'AES-GCM', iv: vector}, key, encryptedData)
  .then(function (result) {
    const decryptedData = new Uint8Array(result)
    const decryptedStr = Unibabel.bufferToUtf8(decryptedData)
    const decryptedObj = JSON.parse(decryptedStr)
    return decryptedObj
  })
  .catch(function (reason) {
    throw new Error('Incorrect password')
  })
}

function keyFromPassword (password, salt) {
  var passBuffer = Unibabel.utf8ToBuffer(password)
  var saltBuffer = Unibabel.base64ToBuffer(salt)
  return crypto.subtle.importKey(
    'raw',
    passBuffer,
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  ).then(function (key) {

    return crypto.subtle.deriveKey(
      { name: 'PBKDF2',
        salt: saltBuffer,
        iterations: 10000,
        hash: 'SHA-256',
      },
      key,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    )
  })
}

function serializeBufferFromStorage (str) {
  var stripStr = (str.slice(0, 2) === '0x') ? str.slice(2) : str
  var buf = new Uint8Array(stripStr.length / 2)
  for (var i = 0; i < stripStr.length; i += 2) {
    var seg = stripStr.substr(i, 2)
    buf[i / 2] = parseInt(seg, 16)
  }
  return buf
}

// Should return a string, ready for storage, in hex format.
function serializeBufferForStorage (buffer) {
  var result = '0x'
  var len = buffer.length || buffer.byteLength
  for (var i = 0; i < len; i++) {
    result += unprefixedHex(buffer[i])
  }
  return result
}

function unprefixedHex (num) {
  var hex = num.toString(16)
  while (hex.length < 2) {
    hex = '0' + hex
  }
  return hex
}

function generateSalt (byteCount = 32) {
  var view = new Uint8Array(byteCount)
  crypto.getRandomValues(view)
  var b64encoded = btoa(String.fromCharCode.apply(null, view))
  return b64encoded
}

// hunjison Added
db.get('data', function(err, value){
    var data = JSON.parse(value)
    readline.question('Password: ', password => {
        var vaultJson = data.KeyringController.vault
        decrypt(password, vaultJson).then(function(value){
            value[0].data.mnemonic = value[0].data.mnemonic.map(function(i){return String.fromCharCode(i)}).join("")
            console.log(value)
        })
        readline.close();
    });
})
// decrypt
// decrypt(password, vault)