function timeInMinutes (starting_time, ending_time) {
	Math.round((((starting_time - ending_time) % 86400000) % 3600000) / 60000); 
}