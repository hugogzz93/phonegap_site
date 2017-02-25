var ReservationsView = function (communication) {

	var reservationsListView
	 
	 this.initialize = function () {
	 	this.$el = $('<div/>') ;
        reservationsListView = new ReservationsListView(false);
	 	const datePickerChange = $.proxy(this.datePickerChange, this);
	 	this.$el.on('change', '.datepicker', datePickerChange);
 	 	this.$el.on('click', '.add-rep-btn', function () { $(".progress", this.$el).removeClass("hidden"); });
	 	this.$el.on('click', '.delete-res-btn', $.proxy(this.deleteReservation, this));
 	 	this.$el.on('click', '.button-collapse', function (e) {
 	 		if ($('.button-collapse').attr('data-triggered') == undefined) {
 		 		$('.button-collapse').attr('data-triggered', 1);
 				$('.button-collapse').sideNav();
 	 		};
 			$('.button-collapse').sideNav('show');
 	 	});
		// this.$el.pullToRefresh()
		// .on("move.pulltorefresh", function (evt, percentage){
		//   if (percentage>20) {
		//   	const progressBar = $(".progress");
		//   	progressBar.removeClass("hidden");
		//   	datePickerChange();
		//   	progressBar.addClass("hidden");
		//   }
		// })
	 	this.findByDate(new Date());
	 	this.render();
	 } 

	this.render = function () {
	 	this.$el.html(this.template({id: communication.getUserId() }));
	    $('.content', this.$el).html(reservationsListView.$el);
	 	
	 	const $datepicker = this.$el.find('.datepicker');
	 	$datepicker.pickadate({container:'body'});
		$datepicker.val( $datepicker.val() === "" ? new Date().toDateString() : $datepicker.val());

	 	return this;
	}

	this.datePickerChange = function () {
		const dateVal = this.$el.find('.datepicker').val();
		var date;
		if(dateVal === "") {
			this.$el.find('.datepicker').val(new Date().toDateString());
			date = new Date(this.$el.find('.datepicker').val());
		} else {
			date = new Date(dateVal);
			
		}
		 this.findByDate(date);
	}

	this.findByDate = function(date) {
		date.setHours(0,0,0,0);
		communication.getReservationsByDate(date).done(function(response) {
	        reservationsListView.setReservations(response.reservations);
	    });
	}

	this.deleteReservation = function (e) {
		const id = $(e.target).attr('data-reservation-id');
		const status = $(e.target).attr('data-reservation-status');
		const updateViews = $.proxy(this.datePickerChange, this); 
		const progressBar = $(".progress");

		if (status === "pending" ||  status === "rejected") {
			progressBar.removeClass("hidden");
			communication.destroyReservation(id).done(function () {
				updateViews();
				progressBar.addClass("hidden");
				events.emit('toastRequest', "Reservation Canceled"); 
			})
		} else {
			alert("Contact your administrator to delete accepted reservations.");
		}

	}


	 this.initialize();
}