const  Airtable = require('airtable');

const BTCApiHelper = require('./btcApiHelper');

class BTCTableUpdater{
    //the class constructor gets the time interval (which is initialized at index.js)
    constructor(interval){
        this.interval = interval;
        this.base = new Airtable({ apiKey: 'mySecretKey' }).base('appWscWYOZKFABkg2');
        //init a queue to be used in case of an error
        this.queue = [];
        this.runningInterval;
        this.btcApiHelper = new BTCApiHelper();
    }


    //the main function that is responsible for inserting the data as entries to the airtable
    startInterval() {

        this.runningInterval = setTimeout(async () => {
            let dateAndTime = (new Date()).toISOString();
            let btcData = await this.btcApiHelper.getBTCValues();
            let entryToInsert = {
                fields:{
                    Time: dateAndTime,
                    Rates: btcData.data.USD.last
                }
            };

            //If the queue is empty, there is probably no problem
            //so try to insert the current entry to the airtable
            if(this.queue.length < 1){
                //try to insert the entry to the table
                this.base('BTC Table').create([entryToInsert],(err, records) => {
                    //there is an error with inserting the info -> keep it in a queue for now
                    if(err){
                        this.queue.push(entryToInsert);
                    }
                    
                });

            } 
            //the queue is not empty (holds prev entries)
            else {
                //insert the current entry to the end of the queue
                this.queue.push(entryToInsert);
                //now try to insert the entries from the queue into the table one after the other
                let isSuccess = true;

                while (isSuccess && (this.queue.length) > 0) {
                    //currentEntryToTry is the first entry on the queue
                    const currentEntryToTry = this.queue[0];
                    //try to insert the entry to the table 
                    this.base('BTC Table').create([currentEntryToTry],(err, records) => {
                        //there is an error with inserting the info
                        if(err){
                            isSuccess = false;
                        }
                        // no error -> delete the entry from the queue after inserting it to the airtable
                        else {
                            this.queue.shift();
                        }
                        
                    });

                }
            }

            this.startInterval();

        }, this.interval);

    }

}

module.exports = BTCTableUpdater;