var painless = require('painless');
var fecha = require('./fecha');
var test = painless.createGroup();
var assert = painless.assert;
var today = new Date();
var year = today.getFullYear();

function testParse(name, str, format, date) {
  test(name, function() {
    assert.equal(+fecha.parse(str, format), +date);
  });
}

function testFormat(name, dateObj, format, expected) {
  test(name, function () {
    assert.equal(fecha.format(dateObj, format), expected);
  });
}

testParse('basic date parse', '2012/05/03', 'YYYY/MM/DD', new Date(2012, 4, 3));
testParse('compact basic date parse', '20120503', 'YYYYMMDD', new Date(2012, 4, 3));
testParse('basic date parse with time', '2012/05/03 05:01:40', 'YYYY/MM/DD HH:mm:ss', new Date(2012, 4, 3, 5, 1, 40));
testParse('date with different slashes', '2012-05-03 05:01:40', 'YYYY-MM-DD HH:mm:ss', new Date(2012, 4, 3, 5, 1, 40));
testParse('date with different order', '11-7-97', 'D-M-YY', new Date(1997, 6, 11));
testParse('date very short', '2-8-04', 'D-M-YY', new Date(2004, 7, 2));
testParse('ordinal day 3rd', '3rd May', 'Do MMM', new Date(year, 4, 3));
testParse('ordinal day 23rd, 2013', '23rd May, 2013', 'Do MMM, YYYY', new Date(2013, 4, 23));
testParse('ordinal day 12th, 2002', 'nd12 Nov, 2002', 'Do MMM, YYYY', false);
testParse('ordinal day 13th, 1995', '13thDec, 1995', 'DoMMM, YYYY', new Date(1995, 11, 13));
testParse('ordinal day 13th, 1995', '1stFebruary, 1982', 'DoMMMM, YYYY', new Date(1982, 1, 1));
testParse('compact', '11081997', 'MMDDYYYY', new Date(1997, 10, 8));
testParse('month names', 'March 3rd, 1999', 'MMMM Do, YYYY', new Date(1999, 2, 3));
testParse('month names short', 'Jun 12, 2003', 'MMM D, YYYY', new Date(2003, 5, 12));
testParse('day name', 'Wednesday Feb 03, 2100', 'dddd MMM DD, YYYY', new Date(2100, 1, 3));
testParse('ampm 10PM', '2015-11-07 10PM', 'YYYY-MM-DD hhA', new Date(2015, 10, 7, 22));
testParse('ampm 9AM', '2015-11-07 9AM', 'YYYY-MM-DD hhA', new Date(2015, 10, 7, 9));
testParse('ampm 12am', '2000-01-01 12AM', 'YYYY-MM-DD hhA', new Date(2000, 0, 1, 0));
testParse('ampm 3am', '2000-01-01 12AM', 'YYYY-MM-DD hhA', new Date(2000, 0, 1, 0));
testParse('ampm am lowercase', '2000-01-01 11am', 'YYYY-MM-DD hha', new Date(2000, 0, 1, 11));
testParse('noon pm lowercase', '2000-01-01 12pm', 'YYYY-MM-DD hha', new Date(2000, 0, 1, 12));
testParse('24 hour time long', '2000-01-01 20', 'YYYY-MM-DD HH', new Date(2000, 0, 1, 20));
testParse('24 hour time long 02', '2000-01-01 02', 'YYYY-MM-DD HH', new Date(2000, 0, 1, 2));
testParse('24 hour time short', '2000-01-01 3', 'YYYY-MM-DD H', new Date(2000, 0, 1, 3));
testParse('milliseconds time', '10:20:30.123', 'HH:mm:ss.SSS', new Date(year, 0, 1, 10, 20, 30, 123));
testParse('milliseconds medium', '10:20:30.12', 'HH:mm:ss.SS', new Date(year, 0, 1, 10, 20, 30, 120));
testParse('milliseconds short', '10:20:30.1', 'HH:mm:ss.S', new Date(year, 0, 1, 10, 20, 30, 100));
testParse('timezone offset', '09:20:31 GMT-0500 (EST)', 'HH:mm:ss ZZ', new Date(Date.UTC(year, 0, 1, 14, 20, 31)));
testParse('UTC timezone offset', '09:20:31 GMT-0000 (UTC)', 'HH:mm:ss ZZ', new Date(Date.UTC(year, 0, 1, 9, 20, 31)));
testParse('UTC timezone offset without explicit offset', '09:20:31 Z', 'HH:mm:ss ZZ', new Date(Date.UTC(year, 0, 1, 9, 20, 31)));
testParse('UTC timezone offset without GMT', '09:20:31 -0000 (UTC)', 'HH:mm:ss ZZ', new Date(Date.UTC(year, 0, 1, 9, 20, 31)));
testParse('invalid date', 'hello', 'HH:mm:ss ZZ', false);
test('i18n month short parse', function() {
  assert.equal(+fecha.parse('def 3rd, 2021', 'MMM Do, YYYY', {
    monthNamesShort: ['Adk', 'Def', 'Sdfs', 'Sdf', 'Sdh', 'Tre', 'Iis', 'Swd', 'Ews', 'Sdf', 'Qaas', 'Ier']
  }), +new Date(2021, 1, 3));
});
test('i18n month long parse', function() {
  assert.equal(+fecha.parse('defg 3rd, 2021', 'MMMM Do, YYYY', {
    monthNames: ['Adk', 'Defg', 'Sdfs', 'Sdf', 'Sdh', 'Tre', 'Iis', 'Swd', 'Ews', 'Sdf', 'Qaas', 'Ier']
  }), +new Date(2021, 1, 3));
});
test('i18n pm parse', function() {
  assert.equal(+fecha.parse('2018-05-02 10GD', 'YYYY-MM-DD HHA', {
    amPm: ['sd', 'gd']
  }), +new Date(2018,4,2,22));
});
test('i18n am parse', function() {
  assert.equal(+fecha.parse('2018-05-02 10SD', 'YYYY-MM-DD HHA', {
    amPm: ['sd', 'gd']
  }), +new Date(2018,4,2,10));
});
test('invalid date no format', function () {
  assert.throws(function () {
    fecha.parse('hello');
  });
});
test('no format specified', function () {
  assert.throws(function () {
    fecha.parse('2014-11-05', false);
  });
});
test('long input false', function () {
  var input = '';
  for (var i = 0; i < 1002; i++) {
    input += '1';
  }
  assert.isFalse(fecha.parse(input, 'HH'));
});

// Day of the month
testFormat('Day of the month', new Date(2014, 2, 5), 'D', '5');
testFormat('Day of the month padded', new Date(2014, 2, 5), 'DD', '05');

// Day of the week
testFormat('Day of the week short', new Date(2015, 0, 8), 'd', '4');
testFormat('Day of the week long', new Date(2015, 0, 10), 'dd', '06');
testFormat('Day of the week short name', new Date(2014, 2, 5), 'ddd', 'Wed');
testFormat('Day of the week long name', new Date(2014, 2, 5), 'dddd', 'Wednesday');

// Month
testFormat('Month', new Date(2014, 2, 5), 'M', '3');
testFormat('Month padded', new Date(2014, 2, 5), 'MM', '03');
testFormat('Month short name', new Date(2014, 2, 5), 'MMM', 'Mar');
testFormat('Month full name mmmm', new Date(2014, 2, 5), 'MMMM', 'March');

// Year
testFormat('Year short', new Date(2001, 2, 5), 'YY', '01');
testFormat('Year long', new Date(2001, 2, 5), 'YYYY', '2001');

// Hour
testFormat('Hour 12 hour short', new Date(2001, 2, 5, 6), 'h', '6');
testFormat('Hour 12 hour padded', new Date(2001, 2, 5, 6), 'hh', '06');
testFormat('Hour 12 hour short 2', new Date(2001, 2, 5, 14), 'h', '2');
testFormat('Hour 12 hour short noon', new Date(2001, 2, 5, 12), 'h', '12');
testFormat('Hour 12 hour short midnight', new Date(2001, 2, 5, 0), 'h', '12');
testFormat('Hour 12 hour padded 2', new Date(2001, 2, 5, 14), 'hh', '02');
testFormat('Hour 12 hour padded noon', new Date(2001, 2, 5, 12), 'hh', '12');
testFormat('Hour 12 hour padded midnight', new Date(2001, 2, 5, 0), 'hh', '12');
testFormat('Hour 24 hour short', new Date(2001, 2, 5, 13), 'H', '13');
testFormat('Hour 24 hour padded', new Date(2001, 2, 5, 13), 'HH', '13');
testFormat('Hour 24 hour short', new Date(2001, 2, 5, 3), 'H', '3');
testFormat('Hour 24 hour padded', new Date(2001, 2, 5, 3), 'HH', '03');

// Minute
testFormat('Minutes short', new Date(2001, 2, 5, 6, 7), 'm', '7');
testFormat('Minutes padded', new Date(2001, 2, 5, 6, 7), 'mm', '07');

// Seconds
testFormat('Seconds short', new Date(2001, 2, 5, 6, 7, 2), 's', '2');
testFormat('Seconds padded', new Date(2001, 2, 5, 6, 7, 2), 'ss', '02');

// Milliseconds
testFormat('milliseconds short', new Date(2001, 2, 5, 6, 7, 2, 500), 'S', '5');
testFormat('milliseconds short 2', new Date(2001, 2, 5, 6, 7, 2, 2), 'S', '0');
testFormat('milliseconds medium', new Date(2001, 2, 5, 6, 7, 2, 300), 'SS', '30');
testFormat('milliseconds medium 2', new Date(2001, 2, 5, 6, 7, 2, 10), 'SS', '01');
testFormat('milliseconds long', new Date(2001, 2, 5, 6, 7, 2, 5), 'SSS', '005');

// AM PM
testFormat('ampm am', new Date(2001, 2, 5, 3, 7, 2, 5), 'a', 'am');
testFormat('ampm pm', new Date(2001, 2, 5, 15, 7, 2, 5), 'a', 'pm');
testFormat('ampm AM', new Date(2001, 2, 5, 3, 7, 2, 5), 'A', 'AM');
testFormat('ampm PM', new Date(2001, 2, 5, 16, 7, 2, 5), 'A', 'PM');

// th, st, nd, rd
testFormat('th 11', new Date(2001, 2, 11), 'Do', '11th');
testFormat('th 6', new Date(2001, 2, 6), 'Do', '6th');
testFormat('st', new Date(2001, 2, 21), 'Do', '21st');
testFormat('nd', new Date(2001, 2, 2), 'Do', '2nd');
testFormat('rd', new Date(2001, 2, 23), 'Do', '23rd');

// Timezone offset
test('timezone offset', function () {
  assert(fecha.format(new Date(2001, 2, 11), 'ZZ').match(/^[\+\-]\d{4}$/));
});

// Random groupings
testFormat('MM-DD-YYYY HH:mm:ss', new Date(2001, 2, 5, 6, 7, 2, 5), 'MM-DD-YYYY HH:mm:ss',
  '03-05-2001 06:07:02');
testFormat('MMMM D, YY', new Date(1987, 0, 8, 6, 7, 2, 5), 'MMMM D, YY', 'January 8, 87');
testFormat('M MMMM MM YYYY, YY', new Date(1987, 0, 8, 6, 7, 2, 5), 'M MMMM MM YYYY, YY',
  '1 January 01 1987, 87');
testFormat('YYYY/MM/DD HH:mm:ss', new Date(2031, 10, 29, 2, 1, 9, 5), 'YYYY/MM/DD HH:mm:ss',
  '2031/11/29 02:01:09');
testFormat('D-M-YYYY', new Date(2043, 8, 18, 2, 1, 9, 5), 'D-M-YYYY', '18-9-2043');
testFormat('current date', new Date(), 'YYYY', '' + (new Date()).getFullYear());
testFormat('mask', new Date(1999, 0, 2), 'mediumDate', 'Jan 2, 1999');
testFormat('number date', 1325376000000, 'YYY-MM-DD HH:mm:ss', fecha.format(new Date(Date.UTC(2012,0,1)), 'YYY-MM-DD HH:mm:ss'));
testFormat('compact date format', new Date(2012, 4, 3), 'YYYYMMDD', '20120503');
test('i18n am format', function() {
  assert.equal(fecha.format(new Date(2018,4,2,10), 'YYYY-MM-DD HHA', {
    amPm: ['sd', 'gd'],
    DoFn: function() {}
  }), '2018-05-02 10SD');
});
test('no format', function() {
  assert.equal(fecha.format(new Date(2017,4,2,10)), 'Tue May 02 2017 10:00:00');
});

// Literals
var date = new Date(2009, 1, 14, 15, 25, 50, 125);

testFormat('literal in format', date, '[on] MM-DD-YYYY [at] HH:mm', 'on 02-14-2009 at 15:25');
testFormat('one literal', date, '[day]', 'day');
testFormat('two literals', date, '[day] YY [YY]', 'day 09 YY');
testFormat('incomplete literal', date, '[YY', '[09');
testFormat('literal inside literal', date, '[[YY]]', '[YY]');
testFormat('bracket inside literal', date, '[[]', '[');
testFormat('new lines', date, 'YYYY[\n]DD[\n]', '2009\n14\n');

test('Invalid date', function () {
  assert.throws(function () {
    fecha.format('hello', 'YYYY');
  });
});
test('Invalid date number', function () {
  assert.throws(function () {
    fecha.format(89237983724982374, 'YYYY');
  });
});
test('string date', function () {
  assert.throws(function () {
    fecha.format('2011-10-01', 'MM-DD-YYYY')
  })
});

