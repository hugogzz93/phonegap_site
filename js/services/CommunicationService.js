const Communication = function () {
	 
	 var url;
	 var auth_token;
	 var credentials;
	 var user_id;
	 var organization;

	 /**
	 * Sets the session variables
	 * @constructor
	 * @param {string} nightech_url - Server Url
	 */

	 this.initialize = function (nightech_url) {
	 	url = nightech_url ? nightech_url : "http://boiling-mountain-93593.herokuapp.com"
	 	this.clearSessionTokens();


	 	var deferred = $.Deferred();
        deferred.resolve();
        return deferred.promise();
	 }
 	// event registration
 	events.on("logInAttempt", function (parameters) {
 		this.logIn(parameters);
 	}.bind(this));

 	events.on("reservationSubmitted", function (parameters) {
 		this.submitReservation(parameters);
 	}.bind(this));

 	this.getUserId = function () {
 		 return user_id; 
 	}

 	this.currentCredentials = function () {
		return credentials;
	}

	this.getOrganization = function () {
		 return organization; 
	}

/* ---------------------------------- Session Handling ---------------------------------- */

	this.startSession = function (user) {
	 	auth_token = user.auth_token;
	 	credentials = user.credentials;
	 	organization = user.organization 
	 	user_id = user.id;
	}

	this.clearSessionTokens = function () {
		auth_token = null;
		credentials = null;
		user_id = null; 
	}

	this.terminateSession = function () {
		$.ajax({
	 	 	url: url + '/sessions/' + auth_token,
	 	 	type: 'DELETE',
	 	 	dataType: 'json',
	 	 	data: {id: auth_token},
	 	 }).done(function (response) {
			events.emit("logOutSuccess");
	 	 }).fail(function (response) {
	 		$.each(JSON.parse(response.responseText).errors, function(key, message) {alert(key + " " + message)} );
	 	 });
	}

	this.logIn = function (parameters) {
	 	const startSession = $.proxy(this.startSession, this);

	 	$.ajax({
	 	 	url: url + '/sessions',
	 	 	type: 'POST',
	 	 	dataType: 'json',
	 	 	data: {session: parameters},
	 	 }).done(function (response) {
	 	 	 events.emit("logInSuccess", response.user);
	 	 	 startSession(response.user);
	 	 }).fail(function (response) {
	 		alert(JSON.parse(response.responseText).errors);
	 		$(".progress").addClass('hidden');
	 	 });
	}

/* ---------------------------------- Reservations Handling ---------------------------------- */

	 this.getReservationsByDate = function (date) {
	 	 const dateString = date.toISOString();
	 	 return $.ajax({
	 	  	url: url + '/reservations',
	 	  	type: 'GET',
	 	  	dataType: 'json',
	 	  	data: {date : dateString},
	 	  	beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", auth_token);
            }
	 	  })
	 	  .fail(function() {
	 		alert("Connection Error 001");
	 		events.emit("LogOut");
	 	  });
	 	   
	 }

 	this.submitReservation = function (reservationJson) {
	 	$.ajax({
	 	 	url: url + '/reservations',
	 	 	type: 'POST',
	 	 	dataType: 'json',
	 	 	data: {reservation: reservationJson},
	 	 	beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", auth_token);
            }
	 	 }).done(function (response) {
	 		 events.emit('reservationCreated', response);
	 	 }).fail(function (response) {
	 		$.each(JSON.parse(response.responseText).errors, function(key, message) {alert(key + " " + message)} );
	 	 });
	}

	this.acceptReservation = function (reservationId, table_number) {
		return $.ajax({
	 	 	url: url + '/reservations/' + reservationId,
	 	 	type: 'PATCH',
	 	 	dataType: 'json',
	 	 	data: {id: reservationId, table_number: table_number, reservation: { status: "accepted" }},
	 	 	beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", auth_token);
            }
	 	}).fail(function (response) {
	 		$.each(JSON.parse(response.responseText).errors, function(key, message) {alert(key + " " + message)} );
	 	});
	}

	this.cancelReservation = function (reservationId, table_number) {
		return $.ajax({
	 	 	url: url + '/reservations/' + reservationId,
	 	 	type: 'PATCH',
	 	 	dataType: 'json',
	 	 	data: {id: reservationId, table_number: table_number, reservation: { status: "pending" }},
	 	 	beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", auth_token);
            }
	 	}).fail(function (response) {
	 		$.each(JSON.parse(response.responseText).errors, function(key, message) {alert(key + " " + message)} );
	 	});
	}

	this.rejectReservation = function (reservationId) {
		const reservationJson = { status: "rejected" };
		return this.updateReservation(reservationId, reservationJson);
	}

	this.updateReservation = function (reservationId, reservationJson) {
		return $.ajax({
	 	 	url: url + '/reservations/' + reservationId,
	 	 	type: 'PATCH',
	 	 	dataType: 'json',
	 	 	data: {reservation: reservationJson},
	 	 	beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", auth_token);
            }
	 	}).fail(function (response) {
	 		$.each(JSON.parse(response.responseText).errors, function(key, message) {alert(key + " " + message)} );
	 	});
	}

	this.destroyReservation = function (reservationId) {
  		return $.ajax({
  	 	 	url: url + '/reservations/' + reservationId,
  	 	 	type: 'DELETE',
  	 	 	dataType: 'json',
  	 	 	data: {id: reservationId},
  	 	 	beforeSend: function (request)
	        {
	            request.setRequestHeader("Authorization", auth_token);
	        }
  	 	}).fail(function (response) {
  	 		$.each(JSON.parse(response.responseText).errors, function(key, message) {alert(key + " " + message)} );
  	 	});
	}

/* -------------------\--------------- Service Handling ---------------------------------- */

	 this.getServicesByDate = function (date) {
	 	 const dateString = date.toISOString();
	 	 return $.ajax({
	 	  	url: url + '/services',
	 	  	type: 'GET',
	 	  	dataType: 'json',
	 	  	data: {date : dateString},
	 	  	beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", auth_token);
            }
	 	  })
	 	  .fail(function() {
	 		alert("Connection Error 003");
	 		events.emit("LogOut");
	 	  });
	 }

	this.getTablesByDate = function (date, scope) {
		scope = scope || "day"
		const dateString = date.toISOString();
		 return $.ajax({
	 	 	url: url + '/tables',
	 	 	type: 'GET',
	 	 	dataType: 'json',
	 	 	data: {date : dateString, scope: scope},
	 	 	beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", auth_token);
            }
	 	 }).fail(function (response) {
	 		$.each(JSON.parse(response.responseText).errors, function(key, message) {alert(key + " " + message)} );
	 	 });
	}

	this.getServices = function (date, scope) {
		scope = scope || "day"
		const dateString = date.toISOString();
		 return $.ajax({
	 	 	url: url + '/services',
	 	 	type: 'GET',
	 	 	dataType: 'json',
	 	 	data: {date : dateString, scope: scope},
	 	 	beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", auth_token);
            }
	 	 }).fail(function (response) {
	 		$.each(JSON.parse(response.responseText).errors, function(key, message) {alert(key + " " + message)} );
	 	 });
	}

	this.submitService = function (serviceJson) {
		return $.ajax({
	 	 	url: url + '/services',
	 	 	type: 'POST',
	 	 	dataType: 'json',
	 	 	data: {service: serviceJson},
	 	 	beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", auth_token);
            }
	 	}).fail(function (response) {
	 		$.each(JSON.parse(response.responseText).errors, function(key, message) {alert(key + " " + message)} );
	 	});
	}

	this.destroyService = function (serviceId) {
		return $.ajax({
	 	 	url: url + '/services/' + serviceId,
	 	 	type: 'DELETE',
	 	 	dataType: 'json',
	 	 	data: {service: { id: serviceId }},
	 	 	beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", auth_token);
            }
	 	}).fail(function (response) {
	 		$.each(JSON.parse(response.responseText).errors, function(key, message) {alert(key + " " + message)} );
	 	});
	}

	this.completeService = function (serviceId) {
		return $.ajax({
	 	 	url: url + '/services/' + serviceId,
	 	 	type: 'PATCH',
	 	 	dataType: 'json',
	 	 	data: {id: serviceId, service: { status: "complete" }},
	 	 	beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", auth_token);
            }
	 	}).fail(function (response) {
	 		$.each(JSON.parse(response.responseText).errors, function(key, message) {alert(key + " " + message)} );
	 	});
	}

	this.updateService = function (serviceId, serviceJson) {
		return $.ajax({
	 	 	url: url + '/services/' + serviceId,
	 	 	type: 'PATCH',
	 	 	dataType: 'json',
	 	 	data: {id: serviceId, service: serviceJson},
	 	 	beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", auth_token);
            }
	 	 }).fail(function (response) {
	 		$.each(JSON.parse(response.responseText).errors, function(key, message) {alert(key + " " + message)} );
	 	 });	  
	}

/* ---------------------------------- Representatives Handling ---------------------------------- */

	this.getRepresentatives = function () {
		return $.ajax({
		 	url: url + '/representatives',
		 	type: 'GET',
		 	dataType: 'json',
		 	beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", auth_token);
            }
		})
		 .fail(function() {
	 		alert("Connection Error 002");
	 		events.emit("LogOut");
		});	  
	}

	this.createRepresentative = function (repJson) {
		return $.ajax({
		 	url: url + '/representatives',
		 	type: 'POST',
		 	dataType: 'json',
		 	data: {representative: repJson},
		 	beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", auth_token);
            }
		})
		 .fail(function() {
		 	console.log("error");
		});
	}

	this.destroyRepresentative = function (id) {
		return $.ajax({
		 	url: url + '/representatives/' + id,
		 	type: 'DELETE',
		 	dataType: 'json',
		 	data: {id: id},
		 	beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", auth_token);
            }
		})
		 .fail(function() {
		 	console.log("error");
		}); 
	}

/* ---------------------------------- Users Handling ---------------------------------- */
	
	this.getUsers = function () {
		 return $.ajax({
		 	url: url + '/users',
		 	type: 'GET',
		 	dataType: 'json',
		 	beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", auth_token);
            }
		 })
		 .fail(function() {
	 		alert("Connection Error 005");
	 		events.emit("LogOut");
		 });
	}

	this.getUserById = function (id) {

		 return $.ajax({
		 	url: url + '/users/' + id,
		 	type: 'GET',
		 	dataType: 'json',
	 	 	data: {id: id},
		 	beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", auth_token);
            }
		 })
		 .fail(function() {
	 		alert("Connection Error 006");
	 		events.emit("LogOut");
		 });
	}

	this.createUser = function (userJson) {
		 $.ajax({
		 	url: url + '/users',
		 	type: 'POST',
		 	dataType: 'json',
	 	 	data: {user: userJson },
		 	beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", auth_token);
            }
		 }).done(function (response) {
	 	 	 events.emit('userCreated', response);
	 	 }).fail(function(response) {
	 		$.each(JSON.parse(response.responseText).errors, function(key, message) {alert(key + " " + message)} );
		 });	 
	}

	this.updateUser = function (userId, userJson) {
		  return $.ajax({
		  	url: url + '/users/' + userId,
		  	type: 'PATCH',
		  	dataType: 'json',
		  	data: {user: userJson},
		 	beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", auth_token);
            }
		  })
		  .fail(function(response) {
		  	$.each(JSON.parse(response.responseText).errors, function(key, message) {alert(key + " " + message)} );
		  })
		  
	}

	this.deleteUser = function (userId) {
		 return $.ajax({
		 	url: url + '/users/' + userId,
		 	type: 'DELETE',
	 	 	dataType: 'json',
	 	 	data: {id: userId},
		 	beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", auth_token);
            }
		 })
		 .done(function (response) {
		 	 events.emit('userDeleted', null);
		 })
		 .fail(function(response) {
	 		$.each(JSON.parse(response.responseText).errors, function(key, message) {alert(key + " " + message)} );
		 });
	}



}