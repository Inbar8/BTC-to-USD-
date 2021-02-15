const axios = require('axios');

class BTCApiHelper {
	// a constructor that gets the api's url 
	constructor() {
		this.apiUrl = 'https://blockchain.info/ticker';
	}

	//data gets the btc exchange data from the given url
	async getBTCValues() {
		
		let data = await axios.get(this.apiUrl);
		return data;
	}
}

module.exports = BTCApiHelper;