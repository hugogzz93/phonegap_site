var BigMapView = function (communication) {

	var mapView

	this.initialize = function () {
	  	this.$el = $('<div/>');
	  	mapView = new MapView(communication.getOrganization().map);
	 	const datePickerChange = $.proxy(this.datePickerChange, this);

		this.$el.on('change', '.datepicker', $.proxy(this.datePickerChange, this));
 	 	this.$el.on('click', '.tab', function () {
 	 		$('.tab-data').addClass('hidden')
 	 		$("#" + $(this).attr("data-tab-id")).removeClass('hidden');
 	 	})
 	 	
		this.findByDate(new Date());
	  	this.render();
	}

	this.render = function () {
		this.$el.html(this.template());
	    $('.content', this.$el).html(mapView.$el);
	 	const $datepicker = this.$el.find('.datepicker');
	    $datepicker.pickadate({});
		$datepicker.val( $datepicker.val() === "" ? new Date().toDateString() : $datepicker.val());

	    return this;
	}
	
	this.datePickerChange = function () {
		const date = new Date(this.$el.find('.datepicker').val());
		this.findByDate(date);
	}

	this.findByDate = function(date) {
		date.setHours(0,0,0,0);

	    communication.getTablesByDate(date).done(function(response) {
	        mapView.setTables(response.tables);
	    });
	}

	this.initialize(); 
}