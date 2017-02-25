var ChartView = function (communication) {

	var data, type, labels, sets = 0;
	var active = false
	borderColors = ["#10d09f", "#FEDB60"]
	gradients = [ "rgba(208,251,241,", "rgba(254,219,96,"]
	const options = { 
 		         	responsive: true,
 		        	maintainAspectRatio: false
 		    	}



	var randomScalingFactor = function() {
	    return (Math.random() > 0.5 ? 1.0 : -1.0) * Math.round(Math.random() * 100);
	};
	var randomColorFactor = function() {
	    return Math.round(Math.random() * 255);
	};

	this.initialize = function () {
		this.$el = $('<div/>');
		this.render();
	}

	this.render = function () {
		 this.$el.html(this.template());
		 if (active) {
		 	this.showChart();
		 };
		 return this;
	}

	this.setData = function (data, labels, type, labelString) {
		active = true;
		sets = 0;
	 	chartData = {
	 		labels: labels,
	 		datasets: [{
	 			type: type,
	 			label: labelString,
		        data: data,
		        borderWidth: 1,
		        borderColor: borderColors[sets],
		        pointBackgroundColor: borderColors[sets++]
	 		}]
	 	}
		this.render();
	}

	this.addData = function (data, type, labelString) {
		 chartData.datasets.push({
 			type: type,
 			label: labelString,
	        data: data,
	        borderWidth: 1,
	        borderColor: borderColors[sets], 
	        pointBackgroundColor: borderColors[sets++]
		})
		this.update();
	}

	this.update = function () {
		  var ctx = this.$el.find('canvas')[0].getContext('2d');
		  var height = $('canvas', this.$el).height();
		  var max = Math.max.apply(null, chartData.datasets[0].data)
		  for (var i = 0; i < sets; i++) {
		  	var gradient = ctx.createLinearGradient(0, 0, 0, height + height*.05);
		  	gradient.addColorStop(0,   	gradients[i] + "1)");
		  	gradient.addColorStop(1, 	gradients[i] + "0)");
		  	chartData.datasets[i].backgroundColor = gradient;
		  };
		  window.myBar.update();
	}

	this.showChart = function () {
		var ctx = this.$el.find('canvas')[0].getContext('2d')
		var height = $('canvas', this.$el).height()
		var max = Math.max.apply(null, chartData.datasets[0].data)
		for (var i = 0; i < sets; i++) {
			var gradient = ctx.createLinearGradient(0, 0, 0, height + height*.05);
			gradient.addColorStop(0,   	gradients[i] + "1)");
			gradient.addColorStop(1, 	gradients[i] + "0)");
			chartData.datasets[i].backgroundColor = gradient;
		};
 		window.myBar = new Chart(ctx, {
 		 	type: 'line',
 		 	data: chartData,
 		 	options: { 
 		         	responsive: true,
 		        	maintainAspectRatio: false,
 		        	tooltips:{
 		        		mode: 'label'
 		        	},
 		        	scales: {
        	            xAxes: [{
                            display: false
                        }],
    	                yAxes: [{
    	                	display: false,
                            gridLines: {
                                display:false
                            },
                            ticks: {
                            	display: false,
                            	max: max + max*.25
                            }   
                        }]
	                },
        	        legend: {
	                    display: false
	                }
		    	}
 		}); 
	}

	this.initialize();
}