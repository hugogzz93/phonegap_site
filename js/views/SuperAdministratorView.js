var SuperAdministratorView = function (communication) {
	 
	 var users;
	 

	 this.initialize = function () {
	 	 this.$el = $('<div/>');
	 	 administratorsListView = new UserListView();
	 	 coordinatorsListView = new UserListView();

	 	 this.updateUsers();
	 	 this.render();
	 }

	 this.render = function () {
	 	 this.$el.html(this.template());
	 	 $('.administratorsList', this.$el).html(administratorsListView.$el);
	 	 $('.coordinatorsList', this.$el).html(coordinatorsListView.$el);

	 	 return this;
	 }

	this.updateUsers = function () {
	 	const progressBar = $("progress", this.$el);

	 	progressBar.removeClass('hidden');
	 	communication.getUsers().done(function (response) {
	 	 	var administrators = [];
			var coordinators = [];

	 	 	for (var i = response.users.length - 1; i >= 0; i--) {
 	 		 	if(response.users[i].credentials === "administrator") {
 	 		 		administrators.push(response.users[i]);
 	 		 	} else {
 	 		 		coordinators.push(response.users[i]);
 	 		 	}
 	 		};	 
 	 		 
 	 		administratorsListView.setUsers(administrators);
		 	coordinatorsListView.setUsers(coordinators);	
		 	progressBar.addClass('hidden');
	 	})
	}

	 this.initialize();
}