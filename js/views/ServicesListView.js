var ServicesListView = function (reservationList) {
	 
	 var tables;

	 this.initialize = function () {
	 	 this.$el = $('<div/>') 
	 	 this.render();
	 } 

	 this.setTables = function (list) {
	 	 tables = list;
	 	 this.render();
	 }

	 this.render = function () {
	 	 this.$el.html(this.template(tables));
		 	$('.collapsible').collapsible({
		      accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
		    });
	 	 return this ;
	 }

	 this.initialize();
}