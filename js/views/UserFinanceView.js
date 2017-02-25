var UserFinanceView = function (data) {

	this.initialize = function () {
		this.$el = $('<div/>');
		this.digestData(data);		
		this.render();
		setTimeout(function () {
			$(document).ready(function(){
	 		    $('.collapsible').collapsible({
	 		      accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
	 		    });
	 	  	}); 
		}, 1000);

	}

	this.render = function () {
		this.$el.html(this.template(data));
		return this;
	}

	this.toArray = function(keys, hash) {
		array = []
		for (var i = 0; i < keys.length; i++) {
			for (var j = 0; j < hash[keys[i]].services.length; j++) {
				serv = hash[keys[i]].services[j]
				serv.date = new Date(serv.date).toDateString();
				serv.elapsedTime = timeInMinutes(serv.completed_time, serv.seated_time)
			};
			array.push(hash[keys[i]]);
		};
		return array;
	}

	this.digestData = function (data) {
		const reps = data.reps;
		const keys = Object.keys(reps);
		data.services = keys
					.reduce(function(sum, rep){return sum + reps[rep].services
					.reduce(function(s,ser){return s+parseInt(ser.ammount);},0)},0);
		data.selfAmmount = reps["-1"].services.reduce(function(sum,serv){return sum + parseInt(serv.ammount)},0);
		data.rpAmmount = data.services - data.selfAmmount;
		data.selfPercent = data.selfAmmount / data.services * 100;
		data.rpPercent = data.rpAmmount / data.services * 100; 
		data.repArray = this.toArray(keys, reps);
	}
	 
	this.initialize(); 
}