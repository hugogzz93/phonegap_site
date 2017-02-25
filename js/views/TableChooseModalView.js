var TableChooseModalView = function () {
	
	const COMPLETED_STATUS = "complete";	 
	 var tables;

	 this.initialize = function () {
	 	 this.$el = $('<div/>') 
	 	 this.render();
	 } 

	 this.setTables = function (list) {
	 	 for (var i = 0; i < list.length; i++)
	 	 	list[i].services = list[i].services.filter(function(e) {return e.status != COMPLETED_STATUS});
	 	 tables = list
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