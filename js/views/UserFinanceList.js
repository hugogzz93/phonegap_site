var UserFinanceList = function () {
	 
	 var users = [];

 	 this.initialize = function () {
	 	 this.$el = $('<div/>');
	 	 this.render();
	 } 

	 this.setUsers = function (list) {
	 	 users = list;
	 	 this.render();
	 }

	 this.render = function () {
	 	var userDigest
	 	 this.$el.html(this.template(users));
		 	// $('.collapsible').collapsible({
		  //     accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
		  //   });
	 	 return this ;
	 }

	 this.initialize(); 
}