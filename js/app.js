// We use an "Immediate Function" to initialize the application to avoid leaving anything behind in the global scope
(function () {

    /* ---------------------------------- Local Variables ---------------------------------- */

    LogInView.prototype.template = Handlebars.compile($('#log-in-tpl').html());
    ReservationsView.prototype.template = Handlebars.compile($('#coordinator-menu-tpl').html());
    AdministratorView.prototype.template = Handlebars.compile($('#administrator-menu-tpl').html());
    CreateReservationView.prototype.template = Handlebars.compile($('#create-reservation-tpl').html());
    ReservationsListView.prototype.template = Handlebars.compile($('#reservations-list-tpl').html());
    ServicesListView.prototype.template = Handlebars.compile($('#services-list-tpl').html());
    TableChooseModalView.prototype.template = Handlebars.compile($('#table-choose-modal-tpl').html());
    SuperAdministratorView.prototype.template = Handlebars.compile($('#superAdministrator-menu-tpl').html());
    UserListView.prototype.template = Handlebars.compile($('#user-list-tpl').html());
    UserView.prototype.template = Handlebars.compile($('#show-user-tpl').html());
    CreateUserView.prototype.template = Handlebars.compile($('#create-user-tpl').html());
    UpdateUserView.prototype.template = Handlebars.compile($('#update-user-tpl').html());
    RepresentativesListView.prototype.template = Handlebars.compile($('#representatives-list-view').html());
    RepresentativesView.prototype.template = Handlebars.compile($('#representatives-view').html());
    MapView.prototype.template = Handlebars.compile($('#map-view').html());
    BigMapView.prototype.template = Handlebars.compile($('#big-map-view').html());
    ChartView.prototype.template = Handlebars.compile($('#chart-tpl').html());
    FinanceView.prototype.template = Handlebars.compile($('#finance-tpl').html());
    UserFinanceView.prototype.template = Handlebars.compile($('#user-finance-tpl').html());
    UserFinanceList.prototype.template = Handlebars.compile($('#user-finance-list-tpl').html());
    
    const communication = new Communication();
    const slider = new PageSlider($('body'));
    // const mainUrl = "http://localhost:3000";
    const mainUrl = "http://boiling-mountain-93593.herokuapp.com"
    // const mainUrl = "http://baboon5.com"
    var auxData = {};




    communication.initialize(mainUrl).done( function () {
         
         // Front Page
        router.addRoute('', function() {
            if (!communication.auth_token) {
                slider.slidePage(new LogInView().render().$el);
            }
        });

        // Coordinator reservations menu
        router.addRoute('reservations', function() {
             slider.slidePage(new ReservationsView(communication).render().$el);
        });

        // create reservation
        router.addRoute('reservations/create', function () {
            communication.getRepresentatives().done(function (response) {
                const filteredRepresentatives = response.representatives.filter(function (e) {
                     return e.user_id == communication.getUserId(); 
                })
                slider.slidePage(new CreateReservationView(communication, filteredRepresentatives).render().$el) ;
            })
        })

        // administrator view
        router.addRoute('administrator', function () {
            slider.slidePage(new AdministratorView(communication).render().$el);
        })

        router.addRoute('administrator/super', function () {
             slider.slidePage(new SuperAdministratorView(communication).render().$el) ;
        })

        router.addRoute('administrator/super/users/new', function () {
            slider.slidePage(new CreateUserView(communication).render().$el);
        })

        router.addRoute('users/:id/edit', function (id) {
            communication.getUserById(id).done(function (response) {
                slider.slidePage(new UpdateUserView(communication, response.user).render().$el);
            })
        })

        // user index
        router.addRoute('administrator/super/users/:id', function (id) {
            communication.getUserById(id).done(function (response) {
                 slider.slidePage(new UserView(communication, response.user).render().$el) ;
            })
        })

        // representatives list
        router.addRoute('representatives', function () {
            slider.slidePage(new RepresentativesView(communication).render().$el) ;
        })

        router.addRoute('administrator/map', function () {
            slider.slidePage(new BigMapView(communication).render().$el) ;
        })

        router.addRoute('administrator/super/finance', function () {
             slider.slidePage(new FinanceView(communication).render().$el) ;
        })

        router.addRoute('administrator/super/finance/users/:id', function () {
             slider.slidePage(new UserFinanceView(auxData).render().$el) ;
        })


        router.start();
    });


    /* --------------------------------- Event Registration -------------------------------- */
    document.addEventListener('deviceready', function () {
        FastClick.attach(document.body);
        if (navigator.notification) { // Override default HTML alert with native dialog
            window.alert = function (message) {
                navigator.notification.alert(
                    message,    // message
                    null,       // callback
                    "Error",    // title
                    'OK'        // buttonName
                );
            };
        }
    }, false);

    events.on('navigationRequest', function (url) {
        router.load(url);
    })

    events.on('logInSuccess', function (user) {
        router.load(user.credentials === "coordinator" ? 'reservations' : 'administrator' );
    })

    events.on('logOutSuccess', function () {
        router.load('');
        events.emit('toastRequest', 'Signed Out');
        communication.clearSessionTokens();
    })

    events.on('reservationCreated', function () {
        router.load("reservations"); 
        events.emit('toastRequest', "Reservation Created!");
    })

    events.on('userDeleted', function () {
        router.load('administrator/super');
        events.emit('toastRequest', "User Deleted");
    })

    events.on('userCreated', function () {
        router.load('administrator/super');
        events.emit('toastRequest', "User Created!");
    })

    events.on('toastRequest', function (message) {
        var $toastContent = $('<span>' + message + '</span>');
        Materialize.toast($toastContent, 2500);
    })

    events.on('LogOut', function () {
         communication.terminateSession(); 
    })

    events.on('setData', function(data) {
        auxData = data;
    })

    events.on('getData', function () {
         return data; 
    })

    /* ---------------------------------- Local Functions ---------------------------------- */
    /* ---------------------------------- Handlebars Helpers ------------------------------- */

    Handlebars.registerPartial('serviceCollapsible', $('#service-collapsible-li-tpl').html());
    Handlebars.registerPartial('createTable', $('#create-service-li-tpl').html());

    Handlebars.registerHelper('reservationIcon', function (status) {
         // const text = Handlebars.escapeExpression(text);
        var returnText = "";
        if (status === "pending") {
            returnText = new Handlebars.SafeString(
            '<i class="material-icons">query_builder</i>'
            );
        } else if(status === "accepted"){
            returnText = new Handlebars.SafeString(
            '<i class="material-icons">done</i>'
            );
        } else if(status === "rejected"){
            returnText = new Handlebars.SafeString(
            '<i class="material-icons">not_interested</i>'
            );
        } else if(status === "seated") {
            returnText = new Handlebars.SafeString(
            '<i class="material-icons">done_all</i>'
            );
        }
        return returnText;
    })

    Handlebars.registerHelper('dateParser', function (date) {
        var returnText = new Date(date).toDateString();
        return returnText;
    })

    Handlebars.registerHelper('tableNumberHelper', function (tableNumber) {
        var returnText = "";
        if (tableNumber) {
            returnText = new Handlebars.SafeString(
                '<div class="table_number"> #' + tableNumber + '</div>'
            );
        };
        return returnText;
    })

    Handlebars.registerHelper('rejectButtonHelper', function (reservation) {
        var returnText = "";
        if (reservation.status === "pending") {
            returnText = new Handlebars.SafeString(
                '<div class="reject-res-btn btn waves-effect waves-light red" type="submit" name="action" data-reservation-id="' + reservation.id + '">Reject <i class="material-icons right">no_sim</i> </div> '
            );
        };
        return returnText;
    })

    Handlebars.registerHelper('ammountDisplayHelper', function (service) {
        var returnText = "";
        if (service.status === "complete") {
            returnText = new Handlebars.SafeString(
                '<div class="row">'
                +' <div class="input-field col s10">' 
                +'   <i class="material-icons prefix">shopping_basket</i>'
                +'   <input disabled type="number" id="ammount"class="validate" value="'+ service.ammount + '">' 
                +'   <label class="active" for="ammount">$</label>' 
                +' </div>'
                +'</div>'
            );
        };
        return returnText;
    })

    /**
     * Shows an icon indicating whether the coordinator 
     * can see the table number or not.
     * @param {Reservation} reservation
     * @return {Number} div containing an appropriate icon
    */
    Handlebars.registerHelper('visibilityIcon', function (reservation) {
        var returnText = "";
        const validStatus = reservation.status === "accepted" || reservation.status === "seated"
        if (reservation.visible && validStatus) {
            returnText = new Handlebars.SafeString(
                '<i class="visibility-btn material-icons prefix" data-reservation-id="' + reservation.id + '" data-visibility="' + reservation.visible + '">visibility</i>'
            );
        } else if(validStatus){
            returnText = new Handlebars.SafeString(
                '<i class="visibility-btn material-icons prefix" data-reservation-id="' + reservation.id + '" data-visibility="' + reservation.visible + '">visibility_off</i>'
            );
        }
        return returnText;
    })

    Handlebars.registerHelper('serviceIcon', function (service) {
        status = service.status
        var returnText = "";
        if (status === "incomplete") {
            returnText = new Handlebars.SafeString(
            '<i class="material-icons service-btn" data-service-status="' + service.status + '" data-service-id="' + service.id + '">done</i>'
            );
        } else if(status === "seated") {
            returnText = new Handlebars.SafeString(
            '<i class="material-icons service-btn" data-service-status="' + service.status + '" data-service-id="' + service.id + '">done_all</i>'
            );
        } else if(status === "complete"){
            returnText = new Handlebars.SafeString(
            '<i class="material-icons service-btn" data-service-status="' + service.status + '" data-service-id="' + service.id + '">receipt</i>'
            );
        }
        return returnText;
    })

    Handlebars.registerHelper('visibilityStatusIcon', function (service) {
        const visibility = service.visible
    })

    Handlebars.registerHelper('showPending', function (status) {
        var returnText = "";
        if(status === "accepted" || status === "rejected") {
            returnText = new Handlebars.SafeString(
            // 'class="hidden"' Removed temporarily
            );
        } 
        return returnText;
    })

    Handlebars.registerHelper('serviceStatusColor', function (status) {
        var returnText = "";
        if(status === "complete") {
            returnText = Handlebars.SafeString("orange accent-1");
        }
        return returnText;
    })

    Handlebars.registerHelper('ifnot', function(conditional, options) {
      if(!conditional) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    });

    Handlebars.registerHelper('partial', function(name, ctx, hash) {
        var ps = Handlebars.partials;
        if(typeof ps[name] !== 'function')
            ps[name] = Handlebars.compile(ps[name]);
        return ps[name](ctx, hash);
    });

    // if the table has at least one service in status incomplete or accepted, it will show that service, else 
    // it will show the option to create a new service
    Handlebars.registerHelper('tableHelper', function (table) {
         const services = table.services;
         var ps = Handlebars.partials;

         ps["serviceCollapsible"] = typeof ps["serviceCollapsible"] === 'function' ? ps["serviceCollapsible"] : Handlebars.compile(ps["serviceCollapsible"]);
         ps["createTable"] = typeof ps["createTable"] === 'function' ? ps["createTable"] : Handlebars.compile(ps["createTable"]);

         for(var i = 0; i < services.length; i++) {
                if(services[i].status === "incomplete" || services[i].status === "seated") {
                    return ps["serviceCollapsible"](services[i]);
                }
         }
        return ps["createTable"](table);
    })

    Handlebars.registerHelper('serviceHelper', function (service) {
         var ps = Handlebars.partials;

         ps["serviceCollapsible"] = typeof ps["serviceCollapsible"] === 'function' ? ps["serviceCollapsible"] : Handlebars.compile(ps["serviceCollapsible"]);
         
         if (service.status === "complete") {
            return ps["serviceCollapsible"](service);
        };
    })

    Handlebars.registerHelper('reservationStatusHelper', function (status) {
        var returnText = "";
        if(status === "pending") {
            returnText = new Handlebars.SafeString("accept-btn");
        } else {
            returnText = new Handlebars.SafeString("red delete-res-btn");
        }
        return returnText;
    })

    Handlebars.registerHelper('reservationStatusTextHelper', function (status) {
        var returnText = "";
        if(status === "pending") {
            returnText = new Handlebars.SafeString("Accept");
        } else {
            returnText = new Handlebars.SafeString("Cancel");
        }
        return returnText;
    })

    Handlebars.registerHelper('disableIfAccepted', function (status) {
        var returnText = "";
        if(status === "accepted") {
            returnText = new Handlebars.SafeString("disabled");
        }
        return returnText;
    })

    Handlebars.registerHelper('servicesCounter', function (services) {
        var currentDate = new Date();
        var month = new Array();
        var serviceCount = 0;
        month[0] = "January";
        month[1] = "February";
        month[2] = "March";
        month[3] = "April";
        month[4] = "May";
        month[5] = "June";
        month[6] = "July";
        month[7] = "August";
        month[8] = "September";
        month[9] = "October";
        month[10] = "November";
        month[11] = "December";

        for (var i = services.length - 1; i >= 0; i--) {
            date = new Date(services[i].date);
            if (currentDate.getMonth() == date.getMonth()) {
                serviceCount++;
            };
        };

        return serviceCount;
    })

    Handlebars.registerHelper('dateHelper', function (date) {
        return moment(new Date(date)).format('MMMM Do YYYY, h:mm:ss a');
    })

    Handlebars.registerHelper('numberWithCommas', function (x) {
         return x ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0 ;
    })



}());