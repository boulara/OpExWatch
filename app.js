/*
 Author: Rick Boulanger
 App Name: OpExWatch
 Purpose: Run a script twice a day (9am & 9PM) checking the current day
 vs the OpEx calendar and alerting via PUSH over how many days until Expo


*/


require('date-utils');

var Pushover = require('node-pushover');
var fs = require('fs');
var config = require('../pushover/config.json');

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
var frontMonth = {};
var backMonth = {};
var once = true;

var BradleyModelDates = [
	new Date(2014, 0, 1),
	new Date(2014, 0, 9),
	new Date(2014, 2, 22),
	new Date(2014, 3, 6),
	new Date(2014, 3, 27),
	new Date(2014, 4, 6),
	new Date(2014, 6, 16),
	new Date(2014, 9, 9),
	new Date(2014, 9, 16),
	new Date(2014, 10, 20),
	new Date(2014, 11, 10),
	new Date(2014, 11, 26)
];
//Code to check for Bradley Date Countdown
for (var i = 0; i < BradleyModelDates.length; i++){
		dateDiff = (d.getDaysBetween(BradleyModelDates[i]) + 1);
		if (dateDiff > 0 && dateDiff < 7){
			var str = "FYI: A Bradley Turn date is coming in " + dateDiff + " days";
			fncPushover(str);
		}
		
}

for (var i = 0; i < ExpoCal.length; i++){

	var monthAbbr = ExpoCal[i].getMonthName();
	//console.log(ExpoCal[i]);
	dateDiff = (d.getDaysBetween(ExpoCal[i]) + 1);
	//console.log(dateDiff + "days until " + monthAbbr + " Expo");
	if (dateDiff > 40 && dateDiff < 60){
		var str = "Get ready to SELL; it's " + dateDiff + " DTE until " + monthAbbr + " expo"
		fncPushover(str);
		console.log(str);
	
	}

	if (dateDiff < 22 && dateDiff > 14){
		var str = ("FYI: watch your " + monthAbbr + " options; " + dateDiff+ " DTE")
		console.log(str)
		fncPushover(str);
	}

	if (dateDiff < 13 && dateDiff > 5) {
		var str = (monthAbbr + " is comming in " + dateDiff +" days; close out your positions");
		console.log(str);
		fncPushover(str);
	}

	if (dateDiff <= 5 && dateDiff > 0) {
		var str = ("Okay Dummy, " + dateDiff + " DTE " + monthAbbr + " Expo - CLOSE OR ROLE NOW!");
		console.log(str);
		fncPushover(str);
	}

	

	//Find Front Month
	if (dateDiff > 15 && dateDiff <= 50){
		frontMonth = {
			"DTE": dateDiff,
			"Name": monthAbbr,
			"MagicNumber": Math.abs(dateDiff - 50.5)
		};

		console.log("Front Month: " + frontMonth.MagicNumber);
	}
	//Find Back Month
	if(dateDiff >= 50 && dateDiff <= 70){
		backMonth = {
			"DTE": dateDiff,
			"Name": monthAbbr,
			"MagicNumber": Math.abs(dateDiff - 50.5)
		};
		console.log("Back Month: " + backMonth.MagicNumber);
	}

	//console.log(backMonth.MagicNumber);
	//Find Pefered Month
	if ((typeof(frontMonth.MagicNumber) != "undefined" && typeof(backMonth.MagicNumber) != "undefined") && once){
		//console.log("###" + typeof frontMonth.MagicNumber);
		//console.log("FM: " + frontMonth.MagicNumber + " /// " + backMonth.MagicNumber);
		if (frontMonth.MagicNumber < backMonth.MagicNumber){
			var str = "FYI: " + frontMonth.Name + " FM options are in play now (" + frontMonth.DTE + ")"; 
			console.log(str);
			once = false;
			fncPushover(str);
		} else if (frontMonth.MagicNumber >= backMonth.MagicNumber && frontMonth && backMonth && once){
			var str = "FYI: " + backMonth.Name + " BM options are in play now (" + backMonth.DTE + ")"; 
			console.log(str);
			once = false;
			fncPushover(str);
		}
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