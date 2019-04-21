var database;

exports.open = function(callback) {
  var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

  var DBOpenRequest = indexedDB.open("DonutClicker", 1);

  DBOpenRequest.onupgradeneeded = function(e) {
    console.log('[IndexedDB] Database upgrade.');
    database = e.target.result;
    if (!database.objectStoreNames.contains("clickerStore")) {
      var objectStore = database.createObjectStore("clickerStore", {
        keyPath: "key"
      });
      objectStore.createIndex("key", "key", {
        unique: true
      });
    }

  };

  DBOpenRequest.onsuccess = function(e) {
    console.log('[IndexedDB] Database initialised.');
    database = e.target.result;
    database.onerror = function(e) {
      console.error("[IndexedDB] error: " + e.target.errorCode);
    };
    if (callback)
      callback();
  };

  DBOpenRequest.onerror = function(e) {
    console.error('[IndexedDB] Opening error.');
  };
};

exports.save = function(key, value) {
  if (database) {
    var tx = database.transaction(["clickerStore"], "readwrite");
    var store = tx.objectStore('clickerStore');
    var request = store.put({
      key,
      value
    });
    request.onerror = function(e) {
      console.error('[IndexedDB] Error: ' + e);
    };
  } else {
    console.error('Open database at first');
    return false;
  }
};

exports.load = function(callback) {
  if (database) {
    var tx = database.transaction(["clickerStore"], "readonly");
    var store = tx.objectStore("clickerStore");
    var request = store.getAll();
    request.onsuccess = function(e) {
      callback(request.result);
    };
  } else {
    console.error('Open database at first');
    return false;
  }
};

// var closeDatabase = function() {
//   database.close();
//   database = null;
// };
