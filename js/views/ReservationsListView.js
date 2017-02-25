var ReservationsListView = function (adminBool) {
	 
	 var reservations;

	 this.initialize = function () {
	 	 this.$el = $('<div/>') 
	 	 this.render();
	 } 

	 this.setReservations = function (list) {
	 	 reservations = list;
	 	 this.render();
	 }

	this.render = function () {
		// var isAccepted = reservations.length > 0 ? 
 		templateData = { isAdmin: adminBool, reservations: reservations }
 	 	this.$el.html(this.template(templateData));
	 	$('.collapsible').collapsible({
	      accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
	    });
 	 	return this ;
	}

	 this.initialize();
}