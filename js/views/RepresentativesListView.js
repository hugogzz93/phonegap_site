var RepresentativesListView = function (representatives) {
	var representatives;

	this.initialize = function () {
	 	this.$el = $('<div/>');
	 	this.render();
	}

	this.setRepresentatives = function(list) {
		representatives = list;
		this.render();
	}

	this.render = function () {
	 	this.$el.html(this.template(representatives));
	 	return this;
	}

	this.initialize()
}