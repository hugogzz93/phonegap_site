var CreateReservationView = function (communication, representatives) {
	 
	 this.initialize = function () {
	 	 this.$el = $('<div/>') ;
	 	 this.$el.on('click', '.btn', this.submitReservation.bind(this));
	 	 this.render();
	 } 

	this.render = function () {
	 	this.$el.html(this.template(representatives));
	 	const $datepicker = this.$el.find('.datepicker');
	 	
	 	const date = new Date();
	 	date.setHours(0,0,0);
	 	date.setDate(date.getDate() - 1);
	 	$datepicker.pickadate({
	 	  min: date
	 	})
	 	return this;
	}

	this.submitReservation = function () {
		this.$el.find('.progress').removeClass('.hidden')
		const clientName = this.$el.find('#client-name').val();
		const representativeId = this.$el.find('select').val();
		const quantity = this.$el.find('#quantity').val();
		const date = new Date(this.$el.find('.datepicker').val());
	 	const comment = this.$el.find('#comment').val();
	 	
	 	const reservationJson = {
	 		client: clientName,
	 		representative_id: representativeId,
	 		quantity: quantity,
	 		date: date.toISOString(),
	 		comment: comment
	 	};
	 	
	 	communication.submitReservation(reservationJson);
	}

	 this.initialize();
}