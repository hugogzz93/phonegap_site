var MapView = function (organization_map) {

	var tables = []
	
	this.initialize = function () {
		  this.$el = $('<div/>');
		  this.render();
	}

	this.setTables = function (list) {
		  tables = list;
		  this.render();
	}

	this.render = function () {
		this.$el.html(this.template());
		const map = $('.mapCanvas', this.$el)
		var canvas = new Map(map[0], organization_map);
		canvas.createFromList(tables);
		return this;
	}
	

	this.initialize(); 
}