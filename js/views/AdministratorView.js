 var AdministratorView = function (communication) {

	var pendingReservationsListView
	var acceptedReservationsListView
	var servicesListView
	var tableChooseModalView
	var tables
	var currentUser
	var progressBar
	 
	this.initialize = function () {
	 	this.$el = $('<div/>') ;
        this.setEventHandlers()
        pendingReservationsListView = new ReservationsListView(true);
        acceptedReservationsListView = new ReservationsListView(true);
        servicesListView = new ServicesListView();
        tableChooseModalView = new TableChooseModalView();

	 	this.findByDate(new Date());
	 	this.render();
	} 

	this.render = function () {
		const credentials = {isSuper: communication.currentCredentials() === "super", id: communication.getUserId()};

	 	this.$el.html(this.template(credentials));
	 	this.$el.append(tableChooseModalView.$el);
		progressBar = $(".progress", this.$el);

	    $('#pendingTab', this.$el).html(pendingReservationsListView.$el);
	    $('#acceptedTab', this.$el).html(acceptedReservationsListView.$el);
	    $('#servicesTab', this.$el).html(servicesListView.$el);

	 	const $datepicker = this.$el.find('.datepicker');
	 	const $tabs = this.$el.find('ul.tabs');

	 	$datepicker.pickadate({container: 'body'});
		$datepicker.val( $datepicker.val() === "" ? new Date().toDateString() : $datepicker.val());
	 	$tabs.tabs();

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
	 	const $tabs = this.$el.find('ul.tabs');
		this.findByDate(date);
		$tabs.tabs();
	}

	this.findByDate = function(date) {
		date.setHours(0,0,0,0);
		if (progressBar) {
			progressBar.removeClass('hidden');
		};

		communication.getReservationsByDate(date).done(function(response) {
			const pendingReservations = response.reservations.filter(function (e) {
				 return e.status === "pending";
			});
			const acceptedReservations = response.reservations.filter(function (e) {
				 return e.status === "accepted" || e.status === "seated";
			});
	        pendingReservationsListView.setReservations(pendingReservations);
	        acceptedReservationsListView.setReservations(acceptedReservations);
	    });

	    communication.getTablesByDate(date).done(function(response) {
	        servicesListView.setTables(response.tables);
	        tableChooseModalView.setTables(response.tables);
	        if (progressBar) {
				progressBar.addClass('hidden');
	        };
	    });
	}

	// ---------------------------Service functionality------------------------------

	this.submitService = function (e) {
		const form = this.$el.find('.active form');
	 	const clientName = form.find('#client-name').val();
	 	const quantity = form.find('#quantity').val();
	 	const comment = form.find('#comment').val();
	 	const table_id = form.find('#table-id').val();
	 	const date = new Date(this.$el.find('.datepicker').val());
	 	const serviceJson = {client: clientName, comment: comment, quantity: quantity, date: date, table_id: table_id} 
	 	const updateView = $.proxy(this.datePickerChange, this); 

	 	return communication.submitService(serviceJson).done(function () {
	 	 	updateView();
	 	 	events.emit("toastRequest", "Service Created!");
		 	
	 	}); 
	}

	this.destroyService = function (event) {
		const serviceId = $(event.target).attr('data-service-id');
	 	const updateView = $.proxy(this.datePickerChange, this); 
	 	
		return communication.destroyService(serviceId).done(function () {
			 updateView();
			 events.emit('toastRequest', "Service Canceled"); 
		});
	}

	this.handleServiceAction = function (event) {
		event.stopPropagation();
		service = $(event.target);
		const status = service.attr('data-service-status');
		const serviceId = service.attr('data-service-id');

		 if (status === "complete") {
		 	this.displayAmmountModal(serviceId);
		 } else if(status === "seated") {
		 	this.completeService(serviceId);
		 } else if(status === "incomplete") {
		 	this.seatService(serviceId);
		 }
	}

	this.displayAmmountModal = function (serviceId) {
		window.scrollTo(0,0) //else the modal will not be always viewable
		const modal = $('#service-ammount-modal', this.$el);
		$('#service-ammount', modal).attr('data-service-id', serviceId);
		modal.openModal();
	}

	this.completeService = function (serviceId) {
	 	const updateView = $.proxy(this.datePickerChange, this); 
	 	const serviceJson = { status: "complete" };

		return communication.updateService(serviceId, serviceJson).done(function () {
		 	updateView(); 
			events.emit('toastRequest', "Reservation Completed!"); 

		});
	}

	this.seatService = function (serviceId) {
		const updateView = $.proxy(this.datePickerChange, this); 
	 	const serviceJson = { status: "seated" };

		return communication.updateService(serviceId, serviceJson).done(function () {
		 	updateView(); 
			events.emit('toastRequest', "Seated!"); 
		});
	}

	this.submitAmmount = function (event) {
		const field = $('#service-ammount', this.$el);
		const ammount = field.val().replace(',', '');
		if (field.val().match(/[^0-9,.]/g)) {
			// if it is not a number
			alert('Must be a number').
			return
		};
		const serviceId = field.attr('data-service-id');
	 	const updateView = $.proxy(this.datePickerChange, this); 

	 	const serviceJson = {ammount: ammount}

		return communication.updateService(serviceId, serviceJson).done(function () {
			 updateView(); 
			 events.emit('toastRequest', "Ammount Updated!"); 
		});

		field.val('');
	}

	// ---------------------------Reservation functionality------------------------------

	this.acceptReservation = function (event) {
		const reservationId = $(event.target).attr('data-reservation-id');
		const tableId = $('.tableNumber[data-reservation-id=' + $(event.target).attr('data-reservation-id') + ']').val();
	 	const updateView = $.proxy(this.datePickerChange, this); 

		return communication.acceptReservation(reservationId, tableId).done(function () {
			 updateView();
			 events.emit('toastRequest', "Reservation Accepted!"); 
		});
	}

	this.cancelReservation = function (event) {
		const reservationId = $(event.target).attr('data-reservation-id');
		const tableId = $('#tableNumber[data-reservation-id=' + $(event.target).attr('data-reservation-id') + ']').val();
	 	const updateView = $.proxy(this.datePickerChange, this); 
		return communication.cancelReservation(reservationId, tableId).done(function () {
			 updateView();
			 events.emit('toastRequest', "Reservation Canceled!"); 
		})
	}

	this.rejectReservation = function (e) {
		const id = $(e.target).attr('data-reservation-id');
		const progressBar = $(".progress", this.$el);
	 	const updateView = $.proxy(this.datePickerChange, this); 

		return communication.rejectReservation(id).done(function (response) {
			updateView();
			events.emit('toastRequest', "Reservation Rejected"); 
		})
	}

	this.saveTableNumber = function (event) {
		const tableId = $(event.target).attr('data-table-number');
		const reservationId = $(event.target).attr('data-reservation-id');
		$('.tableNumber[data-reservation-id=' + reservationId + ']').val(tableId);
		$('#chooseTableModal').closeModal();
		$('label[for="tableNumber"][data-reservation-id="' + reservationId + '"]').addClass('active')
	}

	this.displayTablesModal = function (event) {
		window.scrollTo(0,0) //else the modal will not be always viewable
   		const reservationId = $(event.target).attr('data-reservation-id');
		$('#chooseTableModal .table-option', this.$el).attr('data-reservation-id', reservationId);

		this.$el.find('#chooseTableModal').openModal();
	}

	this.toggleReservationVisibility = function (event) {
		const $target = $(event.target);
		const id = $target.attr('data-reservation-id');
		const json = {visible: $target.attr('data-visibility') === "true" ? "false" : "true"};
	 	const updateView = $.proxy(this.datePickerChange, this); 

		communication.updateReservation(id, json).done(updateView);
	}

	// ---------------------------Other functionality------------------------------

	this.setEventHandlers = function () {
		this.$el.on('change', '.datepicker', $.proxy(this.datePickerChange, this));
	 	this.$el.on('click', '.tab', function () {
	 	 	$('.tab-data').addClass('hidden')
	 	 	$("#" + $(this).attr("data-tab-id")).removeClass('hidden');
	 	})

	 	const submitService =  $.proxy(this.submitService, this)
		const destroyService =  $.proxy(this.destroyService, this)
		const displayTablesModal =  $.proxy(this.displayTablesModal, this)
		const acceptReservation =  $.proxy(this.acceptReservation, this)
		const cancelReservation =  $.proxy(this.cancelReservation, this)
		const handleServiceAction =  $.proxy(this.handleServiceAction, this)
		const submitAmmount =  $.proxy(this.submitAmmount, this)
		const toggleReservationVisibility =  $.proxy(this.toggleReservationVisibility, this)
		const saveTableNumber = $.proxy(this.saveTableNumber, this);
		const rejectReservation = $.proxy(this.rejectReservation, this);
	 	const datePickerChange = $.proxy(this.datePickerChange, this);

	 	buttonClick = function (e) {
	 		if(!$(e.target).hasClass('disabled')) {
	 			progressBar.removeClass('hidden');
	 			$(e.target).addClass('disabled')
		 		e.data.fn(e).always(function() {
		 			progressBar.addClass('hidden');
					$(e.target).removeClass('disabled')
		 		})
	 		}
	 	}

	 	



	 	this.$el.on('click', '.service-submit', {fn: submitService }, buttonClick);
	 	this.$el.on('click', '.delete-btn', {fn: destroyService}, buttonClick);
	 	this.$el.on('click', '.reject-res-btn', {fn:rejectReservation}, buttonClick);
	 	this.$el.on('click', '.delete-res-btn', {fn: cancelReservation}, buttonClick);
	 	this.$el.on('click', '.accept-btn', {fn: acceptReservation}, buttonClick);
	 	this.$el.on('click', '#ammount-submit-btn',{fn:submitAmmount}, buttonClick);
	 	this.$el.on('click', '.visibility-btn', {fn: toggleReservationVisibility}, buttonClick);

	 	this.$el.on('click', '#tableNumber.validate', function (e) {
	 		$(e.target).blur();
	 		displayTablesModal(e);
	 		
	 	});
	 	this.$el.on('click', '.modal-content .table-option.blue', saveTableNumber);
	 	this.$el.on('click', '.service-btn', {fn:handleServiceAction}, function (e) {
	 		e.stopPropagation();
	 		buttonClick(e)
	 	});

	 	this.$el.on('click', '.button-collapse', function (e) {
	 		if ($('.button-collapse').attr('data-triggered') == undefined) {
		 		$('.button-collapse').attr('data-triggered', 1);
				$('.button-collapse').sideNav();
	 		};
			$('.button-collapse').sideNav('show');
	 	});

	 	this.$el.on('click', '.add-service-icon', function (e) {
	 		$(e.target).parent().click()
	 	})

	}

	this.initialize();
}