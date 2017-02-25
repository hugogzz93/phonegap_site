var LogInView = function () {
	 
	 this.initialize = function () {
	 	events.emit('LogOut');
	 	this.$el = $('<div/>');
	 	this.$email = this.$el.find('#email-field');
	 	this.$password = this.$el.find('#password-field');
	 	this.$el.on('click', '.btn', this.logIn.bind(this));
        this.render();
	 };

	 this.render = function () {
	 	 this.$el.html(this.template());
	 	 return this;
	 }

	 this.logIn = function () {
	 	const logInBar = $(".progress", this.$el);
	 	const email = this.$el.find('#email-field').val();
	 	const password = this.$el.find('#password-field').val();

	 	events.emit("logInAttempt", { email: email, password: password });
	 	logInBar.removeClass("hidden");
	 }


	 this.initialize();
}