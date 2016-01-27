/**
 * Return a formatted version of the date instance using PHP-style date syntax.
 *
 * @param {String} format - Format of the generated date string.
 * @param {Boolean} UTC - Whether to convert the date to UTC before formatting.
 * @return {String}
 */
Date.prototype.format = function(format, UTC){

	/** Formatted string. */
	var output = "",


	/** Mapped strings */
	days       = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
	months     = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],

	/** Pre-cached values */
	day        = UTC ? this.getUTCDay()            : this.getDay(),
	date       = UTC ? this.getUTCDate()           : this.getDate(),
	month      = UTC ? this.getUTCMonth()          : this.getMonth(),
	year       = UTC ? this.getUTCFullYear()       : this.getFullYear(),
	time       =                                     this.getTime(),
	hour       = UTC ? this.getUTCHours()          : this.getHours(),
	minute     = UTC ? this.getUTCMinutes()        : this.getMinutes(),
	second     = UTC ? this.getUTCSeconds()        : this.getSeconds(),
	ms         = UTC ? this.getUTCMilliseconds()   : this.getMilliseconds(),
	tz         = UTC ? 0                           : this.getTimezoneOffset(),
	tzStr      = UTC ? "+0000"  : ((tz <= 0 ? "+" : "-") + ("0000" + ((Math.floor((v = Math.abs(tz)) / 60) * 100) + v % 60)).substr(-4)),
	tzStrC     = UTC ? "+00:00" : tzStr.substr(0, 3) + ":" + tzStr.substr(-2),
	leap       = !(year % 4) && !(!(year % 100) && year % 400),
	dayInYear,


	/** Iterator variables */
	char, v,
	escaped = false,
	index   = 0;


	for(;;){
		char = format[index];
		++index;

		/** End of string */
		if(undefined === char){
			if(escaped) output += "\\";
			break;
		}
		
		if(escaped){
			output += char;
			escaped = false;
		}

		else switch(char){

			default:{
				output += char;
				break;
			}

			/** Backslash. Be sure to ignore any recognised characters on the next iteration. */
			case "\\":{
				escaped = !escaped;
				break;
			}

			/** Day of the month, 2 digits with leading zeros: 01 to 31 */
			case "d":{
				output += (date < 10 ? "0" : "") + date;
				break;
			}


			/** A textual representation of a day, three letters: Mon through Sun */
			case "D":{
				output += (days[day] || "").substr(0, 3);
				break;
			}


			/** Day of the month without leading zeros: 1 to 31 */
			case "j":{
				output += date;
				break;
			}


			/** A full textual representation of the day of the week: Sunday through Saturday */
			case "l":{
				output += days[day] || "";
				break;
			}


			/** ISO-8601 numeric representation of the day of the week: 1 (for Monday) through 7 (for Sunday) */
			case "N":{
				output += day || 7;
				break;
			}


			/** English ordinal suffix for the day of the month, 2 characters: st, nd, rd or th. Works well with j */
			case "S":{
				output += [,"st", "nd", "rd"][(date > 10 && date < 20) ? 0 : (date % 10)] || "th";
				break;
			}

			/** Numeric representation of the day of the week: 0 (for Sunday) through 6 (for Saturday) */
			case "w":{
				output += day;
				break;
			}

			/** The day of the year (starting from 0): 0 through 365 */
			case "z":{
				dayInYear = dayInYear || Math.floor((time - new Date(year, 0)) / 86400000);
				output   += dayInYear;
				break;
			}


			/** ISO-8601 week number of year, weeks starting on Monday: e.g., 42 (the 42nd week in the year) */
			case "W":{
				v        = new Date(year, month, date - (day || 7) + 3);
				output  += Math.round((v - new Date(v.getFullYear(), 0, 4)) / 86400000 / 7) + 1;
				break;
			}


			/** A full textual representation of a month, such as January or March */
			case "F":{
				output += months[month] || "";
				break;
			}

			/** Numeric representation of a month, with leading zeros: 01 through 12 */
			case "m":{
				output += (month < 9 ? "0" : "") + (month + 1);
				break;
			}

			/** A short textual representation of a month, three letters: Jan through Dec */
			case "M":{
				output += (months[month] || "").substr(0, 3);
				break;
			}

			/** Numeric representation of a month, without leading zeros: 1 through 12 */
			case "n":{
				output += month+1;
				break;
			}

			/** Number of days in the given month: 28 through 31 */
			case "t":{
				output += [31, leap? 29:28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
				break;
			}
			
			/** Whether it's a leap year: 1 if it is a leap year, 0 otherwise. */
			case "L":{
				output += leap? "1" : "0";
				break;
			}

			/**
			 * TODO: ISO-8601 year number. This has the same value as Y, except that if the ISO week number (W)
			 * belongs to the previous or next year, that year is used instead. Examples: 1999 or 2003
			 */
			case "o":{
				return "Y";
				break;
			}

			/** A full numeric representation of a year, 4 digits. Examples: 1999 or 2003 */
			case "Y":{
				output += year;
				break;
			}
			
			/** A two digit representation of a year: Examples: 99 or 03 */
			case "y":{
				output += (year + "").substr(-2);
				break;
			}

			/** Lowercase Ante meridiem and Post meridiem: am or pm */
			case "a":{
				// JavaScript will never return a hour greater than 23, so we needn't concern ourselves with checking "hour === 24" to determine AM.
				output += hour < 12 ? "am" : "pm";
				break;
			}
			
			/** Uppercase Ante meridiem and Post meridiem: AM or PM */
			case "A":{
				output += hour < 12 ? "AM" : "PM";
				break;
			}


			/**
			 * Swatch Internet time: 000 through 999
			 * @url http://www.swatch.com/templates/assets/js/rwd/main.js
			 */
			case "B":{
				output += ("000" + Math.floor((hour * 3600 + (minute + 60 + tz) * 60 + second) / 86.4) % 1000).slice(-3);
				break;
			}


			/** 12-hour format of an hour without leading zeros: 1 through 12 */
			case "g":{
				output += (hour - (hour >= 12 ? 12 : 0)) || 12;
				break;
			}
			
			/** 24-hour format of an hour without leading zeros: 0 through 23 */
			case "G":{
				output += hour;
				break;
			}


			/** 12-hour format of an hour with leading zeros: 01 through 12 */
			case "h":{
				output += ("0" + ((hour - (hour >= 12 ? 12 : 0)) || 12)).substr(-2);
				break;
			}

			/** 24-hour format of an hour with leading zeros: 00 through 23 */
			case "H":{
				output += (hour < 10 ? "0" : "") + hour;
				break;
			}

			/** Minutes with leading zeros: 00 to 59 */
			case "i":{
				output += (minute < 10 ? "0" : "") + minute;
				break;
			}

			/** Seconds, with leading zeros: 00 through 59 */
			case "s":{
				output += (second < 10 ? "0" : "") + second;
				break;
			}
			
			/** Microseconds. Since JavaScript Date objects don't store time data at any level finer than milliseconds, we'll default to 000000. */
			case "u":{
				output += "000000";
				break;
			}


			/**
			 * Timezone identifier: UTC, GMT, Atlantic/Azores, etc
			 *
			 * We can't accurately replicate PHP's behaviour here, as it bases timezones based on region/location, something not accessible JavaScript
			 * (at least without having to bring in something heavy-duty like HTML5's Geolocation API). We'll settle for something a bit more minimalist instead.
			 */
			case "e":
			case "T":{
				output +=
				
					/** Check the stringified form of the date object to pull a timezone abbreviation from the trailing component e.g., "(EST)". */
					(this.toTimeString().match(/\(([^)]+)\)\s*$/) || [])[1] ||

					/* If we can't match the timezone's abbreviation from the Date's string function, fall back on showing the offset in hours instead. */
					("UTC" + tzStr);
				break;
			}


			/** TODO: Whether or not the date is in daylight saving time. 1 if Daylight Saving Time, 0 otherwise. */
			case "I":{
				return "0";
				break;
			}
			
			/** Difference to Greenwich time (GMT) in hours: e.g., +0200 */
			case "O":{
				output += tzStr;
				break;
			}

			/** Difference to Greenwich time (GMT) with colon between hours and minutes. Example: +02:00 */
			case "P":{
				output += tzStrC;
				break;
			}


			/** Seconds since the Unix Epoch (January 1 1970 00:00:00 GMT) */
			case "U":{
				output += time;
				break;
			}

			/** Timezone offset in seconds. The offset for timezones west of UTC is always negative, and for those east of UTC is always positive. -43200 through 50400 */
			case "Z":{
				output += (tz <= 0 ? Math.abs(tz) : -tz) * 60;
				break;
			}
			
			/** ISO 8601 date: 2004-02-12T15:19:21+00:00 */
			case "c":{
				output += year + "-"
					+       (month  < 11 ? "0" : "") + (month+1)
					+ "-" + (date   < 10 ? "0" : "") + date
					+ "T" + (hour   < 10 ? "0" : "") + hour
					+ ":" + (minute < 10 ? "0" : "") + minute
					+ ":" + (second < 10 ? "0" : "") + second
					+ tzStrC;
				break;
			}


			/** RFC 2822 formatted date. Example: Thu, 21 Dec 2000 16:01:07 +0200 */
			case "r":{
				output += days[day].substr(0, 3)
					+ ", "  + (date < 10 ? "0" : "") + date
					+ " "   + months[month].substr(0, 3)
					+ " "   + year
					+ " "   + (hour   < 10 ? "0" : "") + hour
					+ ":"   + (minute < 10 ? "0" : "") + minute
					+ ":"   + (second < 10 ? "0" : "") + second
					+ " "   + tzStr;
				break;
			}
		}
	}

	return output;
};
