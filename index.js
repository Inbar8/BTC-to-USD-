const BTCTableUpdater = require('./BTCTableUpdater');

//creating a new table updater and setting the time interval to 1 minute
let btcTableUpdater = new BTCTableUpdater(60000);

//starting the interval
btcTableUpdater.startInterval();
