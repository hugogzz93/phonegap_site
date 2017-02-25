var UpdateUserView = function (communication, user) {
	 
	 this.initialize = function () {
	 	 user.isAdmin = communication.currentCredentials() == "administrator" ? true : communication.currentCredentials() == "super" ? true : false;
	 	 user.selfUpdate = user.id == communication.getUserId();
	 	 this.$el = $('<div/>') ;
	 	 this.$el.on('click', '.update-info-btn', $.proxy(this.updateInformation, this));
	 	 this.$el.on('click', '.update-password-btn', $.proxy(this.updatePassword, this));
	 	 this.$el.on('click', '.update-cred-btn', $.proxy(this.updateCredentials, this));
	 	 this.render();
	 }

	 this.render = function () {
	 	 this.$el.html(this.template(user)) ;
	 	 return this;
	 }

	 this.updateInformation = function (e) {
	 	const userName = $('input#user-name', this.$el).val();
	 	const userEmail = $('input#email', this.$el).val();
	 	const id = user.id;
	 	const progressBar = $('.progress', this.$el);
	 	const userJson = { name: userName, email: userEmail }

	 	progressBar.removeClass("hidden");
	 	communication.updateUser(id, userJson).done(function() {
	  		events.emit('toastRequest', "Information Updated!");
	  	}).always(function () {
		 	progressBar.addClass("hidden");
	  	})
	 }

	 this.updatePassword = function (e) {
	 	 const password = $('#password', this.$el).val();
	 	 const passwordConfirmation = $('#password-confirmation', this.$el).val();
		 const id = user.id;
	 	 const progressBar = $('.progress', this.$el);

	 	 if (password === passwordConfirmation) {
		 	progressBar.removeClass("hidden");
	 	 	const userJson = { password: password, password_confirmation: passwordConfirmation };
	 	 	communication.updateUser(id, userJson).done(function () {
	 	 		 events.emit('toastRequest', 'Password Updated!') 
	 	 	}).always(function () {
			 	progressBar.addClass("hidden");
	 	 	})
	 	 } else {
	 	 	alert("Password and confirmation don't match.") ;
	 	 };
	 }

	 this.updateCredentials = function () {
 	  	const credentials = $('input[name=credentials]:checked', this.$el).val();
 	  	const userJson = { credentials: credentials }
		const id = user.id;
	 	const progressBar = $('.progress', this.$el);
	 	progressBar.removeClass("hidden");
	 	
 	  	if (credentials == undefined) {
 	  		alert("Credentials can't be blank");
 	  	} else {
	 	  	communication.updateUser(id, userJson).done(function () {
	 	  		events.emit('toastRequest', 'Credentials Updated!');
	 	  	}).always(function () {
		 		progressBar.addClass("hidden");
	 	  	})
 	  	}
	 }

	 this.initialize(); 
}