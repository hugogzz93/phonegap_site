var UserView = function (communication, user) {
	 var userDigest;

	 this.initialize = function () {
	 	 userDigest = this.digestUser(user);
	 	 this.$el = $('<div/>') ;
	 	 this.$el.on('click', '.delete-btn', function (event) {
	 	 	var confirmationMessage;
	 	 	if (user.credentials === "administrator") { 
	 	 		confirmationMessage = "This will permamently delete the user, aswell as all the services he created. "
	 	 	} else {
	 	 		confirmationMessage = "This will permamently delete the user, aswell as all the reservations he created. "
	 	 	}
	 	 	 var confirmation = confirm(confirmationMessage);
	 	 	 if (confirmation) {
	 	 	 	 const userId = $(event.target).attr('data-user-id');
		 	 	 communication.deleteUser(userId);
	 	 	 };
	 	 })
	 	 this.render();
	 }

	 this.render = function () {
	 	 this.$el.html(this.template(userDigest)) ;
	 	 return this;
	 }

	 this.digestUser = function (user) {
	 	 var administeredServices = [];

	 	 for (var i = user.administered_services.length - 1; i >= 0; i--) {
	 	 	service = user.administered_services[i];
	 	 	if (service.administrator_id != service.coordinator_id) {
	 	 		administeredServices.push(service);
	 	 	};
	 	 };

	 	 user.administered_services = administeredServices ;
	 	 return user;
	 }

	 this.initialize(); 
}