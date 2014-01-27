/*
 Author: Rick Boulanger
 App Name: OpExWatch
 Purpose: Run a script twice a day (9am & 9PM) checking the current day
 vs the OpEx calendar and alerting via PUSH over how many days until Expo


*/


require('date-utils');

var Pushover = require('node-pushover');
var fs = require('fs');
var config = require('./config.json');

var today = new Date();
var ExpoCal = [
	new Date(2014, 0, 17),
	new Date(2014, 1, 21),
	new Date(2014, 2, 21),
	new Date(2014, 3, 17),
	new Date(2014, 4, 16),
	new Date(2014, 5, 20),
	new Date(2014, 6, 18),
	new Date(2014, 7, 15),
	new Date(2014, 8, 19),
	new Date(2014, 9, 17),
	new Date(2014, 10, 21),
	new Date(2014, 11, 19),
	];

var d = new Date();
var dateDiff;


for (var i = 0; i < ExpoCal.length; i++){

	var monthAbbr = ExpoCal[i].getMonthName();
	//console.log(ExpoCal[i]);
	dateDiff = (d.getDaysBetween(ExpoCal[i]) + 1);
	if (dateDiff > 40 && dateDiff < 60){
		var str = "Get ready to SELL; its " + dateDiff + " DTE until " + monthAbbr + " expo"
		fncPushover(str);
		console.log(str);
	
	}
	//console.log("Their are " + dateDiff + " days until " + ExpoCal[i].getMonthAbbr() + " experation");

	//alert when less then X number of days to expo


	if (dateDiff < 22 && dateDiff > 14){
		var str = ("FYI: watch your " + + " options; " + dateDiff+ " DTE")
		console.log(str)
	fncPushover(str);

	}

	if (dateDiff < 13 && dateDiff > 0) {
		var str = (monthAbbr + " is comming in " + dateDiff +" days; close out your positions");
		console.log(str);
		fncPushover(str);
	}


	//alert where their are between 40 and 50 days to expo
}

fncWriteLog(d,str);
process.on('uncaughtException', function(err){
	console.log(err);
});

// FUNCTIONS

function fncPushover(msg){
	var push = new Pushover({
		token: config.token,
		user: config.user
	});

	// A callback function is defined:
	push.send("OpExWatch", msg, function (err, res){
		if(err){
			console.log("We have an error:");
			console.log(err);
			console.log(err.stack);
		}else{
			console.log("Message send successfully");
			console.log(res);
		}
	});
} //end fncPushover function

function fncWriteLog(date,dte){
	var strLog = date + ';' + dte + '\n';
	
	fs.appendFile('log.txt',strLog,function(err){
		if (err) throw err;
	console.log('It\'s saved');
	});
}