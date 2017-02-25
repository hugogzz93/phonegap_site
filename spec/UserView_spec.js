describe("UserView", function () {
	beforeEach(function () {
		 const user = {
		  "id": 8,
		  "email": "piper@quigleyfunk.ca",
		  "created_at": "2016-03-14T20:21:23.953Z",
		  "updated_at": "2016-03-14T20:21:23.953Z",
		  "auth_token": "7_d-6kGRn75snEYp_Z3U",
		  "supervisor_id": null,
		  "credentials": "administrator",
		  "name": "Aurelia Funk",
		  "last_sign_in_at": null,
		  "coordinated_services": [],
		  "administered_services": [],
		  "reservations": []
		} 

		const userView = new UserView(communication, user);

	});
	 it("should have userDigest defined", function () {
	 });
});