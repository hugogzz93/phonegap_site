var CreateUserView = function (communication) {
	 
	 this.initialize = function () {
	 	 this.$el = $('<div/>') ;
	 	 this.$el.on('click', '.submit-btn', $.proxy(this.submitUser, this));
	 	 this.render();
	 }

	 this.render = function () {
	 	 this.$el.html(this.template()) ;
	 	 return this;
	 }

	 this.submitUser = function () {
	 	 const userName = $('#user-name', this.$el).val();
	 	 const email = $('#email', this.$el).val();
	 	 const password = $('#password', this.$el).val();
	 	 const passwordConfirmation = $('#password-confirmation', this.$el).val();
	 	 const credentials = $('input[name=credentials]:checked',  this.$el).val();

	 	 if (password === passwordConfirmation) {
	 	 	const userJson = { name: userName, email: email, password: password, password_confirmation: passwordConfirmation, credentials: credentials };
	 	 	communication.createUser(userJson);
	 	 } else {
	 	 	alert("Password and confirmation don't match.") ;
	 	 };
	 }

	 this.initialize(); 
}