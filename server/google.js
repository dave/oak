// first, remove configuration entry in case service is already configured
Accounts.loginServiceConfiguration.remove({
	service: "google"
});
if (Meteor.settings.dev) {
	Accounts.loginServiceConfiguration.insert({
		service: "google",
		clientId: "603012491079-0335obucn9aap0gdi1ngv9iimbha6s17.apps.googleusercontent.com",
		secret: "kIpOIFxUoooXcmej7uZprHZx"
	});
}
else {
	Accounts.loginServiceConfiguration.insert({
		service: "google",
		clientId: "603012491079-lia5c31frg74mpqng6lrs6l10t2t1bj0.apps.googleusercontent.com",
		secret: "UJDkPCzfXeTKuigHWdI2qh_O"
	});
}

