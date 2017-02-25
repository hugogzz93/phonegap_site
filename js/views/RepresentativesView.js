var RepresentativesView = function (communication) {
	var listView

	this.initialize = function () {
	 	this.$el = $('<div/>') ;
		listView = new RepresentativesListView();
		$('body').on('click', '.add-rep-btn', function () {
			window.scrollTo(0,0) //else the modal will not be always viewable
	 	 	$('#add-rep-modal').openModal(); 
	 	});

	 	this.$el.on('click', '.confirm-btn', $.proxy(this.createRepresentative, this));
	 	this.$el.on('swipeleft', 'li', $.proxy(this.deleteRepresentative, this));
	 	this.render();
	}

	this.render = function () {
	 	this.$el.html(this.template());
		this.updateRepresentatives();
	 	$('.content', this.$el).html(listView.$el);
	 	return this;
	}

	this.updateRepresentatives = function() {		
		communication.getRepresentatives().done(function (response) {
			const representatives = response.representatives.filter(function(e) { 
				return e.user_id == communication.getUserId();
			})
			listView.setRepresentatives(representatives);
		})
	}

	this.createRepresentative = function () {
		const progressBar = $(".progress", this.$el);
		const representativeName = $('#representative-name').val();
		const repJson = { name: representativeName };
		const updateRepresentatives = $.proxy(this.updateRepresentatives, this);

		progressBar.removeClass('hidden');
		communication.createRepresentative(repJson).done(function () {
			 updateRepresentatives()
			 progressBar.addClass('hidden');
		});
	}

	this.deleteRepresentative = function (e) {
		const id = $(e.target).attr('data-representative-id');
		const updateRepresentatives = $.proxy(this.updateRepresentatives, this);
		communication.destroyRepresentative(id).done(updateRepresentatives);

	}

	this.initialize()
}