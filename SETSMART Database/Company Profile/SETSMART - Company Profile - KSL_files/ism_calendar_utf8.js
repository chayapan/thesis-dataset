/*
 ****************************************************
 Author : Pailin L.
 Date : 1/2/2002
 DHTML Calendar
 Version 1.1
 support ie and ns6
 Date: 20/03/2011
 Version 1.1.1
 Correct ie4 bug
 ******************************************************
 */
var timeoutDelay = 3000; // milliseconds, change this if you like, set to 0 for the calendar to never auto disappear
var g_startDay = 1 // 0=sunday, 1=monday

// used by timeout auto hide functions
var timeoutId = false;

// the now standard browser sniffer class
function Browser() {
    this.dom = document.getElementById ? 1 : 0;
    this.ie4 = (document.all && !this.dom) ? 1 : 0;
    this.ie5 = (this.dom && document.all) ? 1 : 0;
    this.ns6 = (this.dom && !document.all) ? 1 : 0;
    this.ns4 = (document.layers && !this.dom) ? 1 : 0;
    this.platform = navigator.platform;
}
var browser = new Browser();

// dom browsers require this written to the HEAD section
if (browser.dom || browser.ie4) {
    document.writeln('<style> #container { position : absolute; clip:rect(0px 170px  150px 0px); visibility : hidden; z-index : 6} </style> <div id="container"');
    if (timeoutDelay) document.write(' onmouseout="calendarTimeout();" onmouseover="if (timeoutId) clearTimeout(timeoutId);"');
    document.write('></div>');
}

var g_Calendar;  // global to hold the calendar reference, set by constructor
var f_type ; // global variable that hold type of calendar to present 'D ' = Daily 'M' = monthly 'Q' = quarterly 'Y' = yearly
var f_begin ; // global Variable that hold date begin or date end 'true' = begin 'false' = end

function calendarTimeout() {
    if (browser.ie4 || browser.ie5) {
        if (window.event.srcElement && window.event.srcElement.name != 'month')
            timeoutId = setTimeout('g_Calendar.localeSensitiveHide();', timeoutDelay);
    }
    if (browser.ns6 || browser.ns4) {
        timeoutId = setTimeout('g_Calendar.localeSensitiveHide();', timeoutDelay);
    }
}

// Create event
function fireEvent(element,event){
    if (document.createEventObject){
        // dispatch for IE
        var evt = document.createEventObject();
        return element.fireEvent('on'+event,evt)
    }
    else{
        // dispatch for firefox + others
        var evt = document.createEvent("HTMLEvents");
        evt.initEvent(event, true, true ); // event type,bubbling,cancelable
        return !element.dispatchEvent(evt);
    }
}
// constructor for calendar class
function Calendar() {
    g_Calendar = this;
    // some constants needed throughout the program
    this.daysOfWeek_eng = new Array("Su", "Mo", "Tu", "We", "Th", "Fr", "Sa");
    this.months_eng = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
    this.daysOfWeek_th = new Array("อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส.");
    this.months_th = new Array("มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม");
    this.daysInMonth = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
    this.dateDelim = '/';
    var tmpLayer = browser.dom ? document.getElementById('container') : document.all.container;
    this.containerLayer = tmpLayer;
}

Calendar.prototype.getFirstDOM = function() {
    var thedate = new Date();
    thedate.setDate(1);
    thedate.setMonth(this.month);
    thedate.setFullYear(this.year);
    return thedate.getDay();
}

Calendar.prototype.getDaysInMonth = function (month, year) {
    if (month != 1) {
        return this.daysInMonth[month]
    } else {
        // is it a leap year
        if (year % 4 == 0 && ((year % 100 != 0) || (year % 400 == 0)))  return 29;
        else  return 28;
    }
}

Calendar.prototype.buildString = function() {
    var tmpStr = '<form onSubmit="this.year.blur();return false;"><table  border="0" cellspacing="0" cellpadding="2" class="calBorderColor"><tr><td valign="top"><table width="100%" border="0" cellspacing="0" cellpadding="1" class="calBgColor">';
    if (this.language == 'Thai')
        this.months = this.months_th;
    else
        this.months = this.months_eng;
    tmpStr += '<tr>';
    if ((this.f_type == 'D') || (this.f_type == 'M')) {
        // draw month list  for month and quarter
        tmpStr += '<td width="40%" class="cal" align="left">';
        tmpStr += '<select class="month" name="month" ';
        if (this.f_type == 'D') tmpStr += 'onchange="g_Calendar.selectChange();" '
        tmpStr += ' >';
        for (var i = 0; i < this.months.length; i++) {
            tmpStr += '<option value="' + i + '"';
            if (i == this.month) tmpStr += ' selected';
            tmpStr += '>' + this.months[i] + '</option>';
        } // end for
        tmpStr += '</select></td>';
    }
    if (this.f_type == 'Q') {
        // draw quarter list
        tmpStr += '<td width="40%" class="cal" align="left" >';
        tmpStr += '<select class="month" name="quarter" >';
        var q ;
        if ((this.month >= 0) && (this.month <= 2)) q = 0;
        else if ((this.month >= 3) && (this.month <= 5)) q = 1;
        else if ((this.month >= 6) && (this.month <= 8)) q = 2;
            else if ((this.month >= 9) && (this.month <= 11)) q = 3;
        for (var i = 0; i < 4; i++) {
            tmpStr += '<option value="' + i + '"';
            if (i == q) tmpStr += 'selected ';
            tmpStr += '> Quarter ' + (i + 1) + '</option>';
        }
        tmpStr += '</select> </td>';
    }
    // draw year list every type
    tmpStr += '<td width="40%" align="right" class="cal">';
    tmpStr += '<select class="year" name="year" ';
    if (this.f_type == 'D') tmpStr += 'onChange="g_Calendar.inputChange();" ';
    else if (this.f_type == 'Y')
        tmpStr += 'onChange="g_Calendar.localeSensitiveClick(\'' + this.f_type + '\');" ';
    tmpStr += ' >';
    for (var y = this.dateToYear; y >= this.dateFromYear; y--) {
        tmpStr += '<option value="' + y + '" ';
        if (y == this.year) tmpStr += 'selected';
        if (this.language == 'Thai')
            tmpStr += '>' + eval((y * 1) + 543) + '</option>';
        else
            tmpStr += '>' + y + '</option>';
    }
    tmpStr += '</select> </td>';

    if (this.f_type != 'D' && this.f_type != 'Y') {
        tmpStr += ' <td  align="center"  class="cal" width="20%"> <a class="cal" href="javascript: g_Calendar.localeSensitiveClick(\'';
        tmpStr += this.f_type;
        tmpStr += '\');">  ok </a></td> ';
    }
    tmpStr += '</tr> </table>';

    if (this.f_type == 'D') {
        // begin draw table date
        var iCount = 1;
        if (this.language == 'Thai')
            this.daysOfWeek = this.daysOfWeek_th;
        else
            this.daysOfWeek = this.daysOfWeek_eng;
        var iFirstDOM = this.getFirstDOM() - g_startDay; // to prevent calling it in a loop
        if (iFirstDOM < 0) iFirstDOM = iFirstDOM + 7;
        tmpStr += '<table width="100%" border="0" cellspacing="0" cellpadding="1" class="calBgColor">';
        tmpStr += '<tr>';
        for (var i = 0; i < 7; i++) {
            tmpStr += '<td align="center" class="calDaysColor">' + this.daysOfWeek[(g_startDay + i) % 7] + '</td>';
        }
        tmpStr += '</tr>';
        var tmpFrom = parseInt('' + this.dateFromYear + this.dateFromMonth + this.dateFromDay, 10);
        var tmpTo = parseInt('' + this.dateToYear + this.dateToMonth + this.dateToDay, 10);
        var tmpCompare;
        for (var j = 1; j <= 6; j++) {
            tmpStr += '<tr>';
            for (var i = 1; i <= 7; i++) {
                tmpStr += '<td width="10" align="center" '
                if ((7 * (j - 1) + i) >= iFirstDOM + 1 && iCount <= this.getDaysInMonth(this.month, this.year)) {
                    if (iCount == this.day && this.year == this.oYear && this.month == this.oMonth)
                        tmpStr += 'class="calHighlightColor"';
                    else
                        tmpStr += 'class="cal"';
                    tmpStr += '>';
                    tmpCompare = parseInt('' + this.year + padZero(this.month) + padZero(iCount), 10);
                    if (tmpCompare >= tmpFrom && tmpCompare <= tmpTo) {
                        if (g_startDay + i == 1 || g_startDay + i >= 7)
                            tmpStr += '<a class="calWeekend" href="javascript: g_Calendar.localeSensitiveClickDay(' + iCount + ');">' + iCount + '</a>';
                        else
                            tmpStr += '<a class="cal" href="javascript: g_Calendar.localeSensitiveClickDay(' + iCount + ');">' + iCount + '</a>';
                    } else {
                        if (g_startDay + i == 1 || g_startDay + i >= 7)
                            tmpStr += '<span class="calWeekend">';
                        else
                            tmpStr += '<span class="disabled">';
                        tmpStr += iCount + '</span>';
                    }
                    iCount++;
                }
                else {
                    tmpStr += 'class="cal" >&nbsp; ';
                }
                tmpStr += '</td>'
            }
            tmpStr += '</tr>'
        }
        tmpStr += '</table>';
    }
    tmpStr += '</td></tr></table></form>'
    return tmpStr;
}

Calendar.prototype.selectChange = function() {
    this.month = browser.ns6 ? this.containerLayer.ownerDocument.forms[0].month.selectedIndex : this.containerLayer.document.forms[0].month.selectedIndex;
    this.writeString(this.buildString());
}

Calendar.prototype.inputChange = function() {
    var tmp = browser.ns6 ? this.containerLayer.ownerDocument.forms[0].year : this.containerLayer.document.forms[0].year;
    if (tmp.value >= 1900 || tmp.value <= 2100) {
        this.year = tmp.value;
        this.writeString(this.buildString());
    } else {
        tmp.value = this.year;
    }
}

Calendar.prototype.localeSensitiveHide = function() {
    var showing = ( this.containerLayer.style.visibility == 'visible' );
    this.hide();
    if (this.language.toLowerCase().charAt(0) == 't' && showing) {
        var dateBox = eval('document.' + this.target);
        var dateString = dateBox.value;
        var adjustedYear = ( parseInt(dateString.substring(dateString.length - 4, dateString.length)) + 543 );
        var newDateString = dateString.substring(0, dateString.length - 4) + adjustedYear;
        dateBox.value = newDateString;
    }
}

Calendar.prototype.localeSensitiveClickDay = function(day) {
    var showing = ( this.containerLayer.style.visibility == 'visible' );
    this.clickDay(day);
    if (this.language.toLowerCase().charAt(0) == 't' && showing) {
        var dateBox = eval('document.' + this.target);
        var dateString = dateBox.value;
        var adjustedYear = ( parseInt(dateString.substring(dateString.length - 4, dateString.length)) + 543 );
        var newDateString = dateString.substring(0, dateString.length - 4) + adjustedYear;
        dateBox.value = newDateString;
    }
}

Calendar.prototype.localeSensitiveClick = function(type) {
    var showing = ( this.containerLayer.style.visibility == 'visible' );
    this.click(type);
    if (this.language.toLowerCase().charAt(0) == 't' && showing) {
        var dateBox = eval('document.' + this.target);
        var dateString = dateBox.value;
        var adjustedYear = ( parseInt(dateString.substring(dateString.length - 4, dateString.length)) + 543 );
        var newDateString = dateString.substring(0, dateString.length - 4) + adjustedYear;
        dateBox.value = newDateString;
    }
}


Calendar.prototype.click = function(type) {
    var tmp = eval('document.' + this.target);
    var tmp_show = eval('document.' + this.target_show);
    var year = browser.ns6 ? this.containerLayer.ownerDocument.forms[0].year : this.containerLayer.document.forms[0].year;
    var tmp_y = year.options[year.selectedIndex].value;
    var tmp_day = '' ;
    var tmp_month = '';
    if (type == 'M') {
        var tmp_m = browser.ns6 ? this.containerLayer.ownerDocument.forms[0].month.selectedIndex : this.containerLayer.document.forms[0].month.selectedIndex;
        if (this.f_begin) {
            tmp_day = '1';
            tmp_month = tmp_m + 1;
        }
        else {
            tmp_day = this.getDaysInMonth(tmp_m, tmp_y);
            tmp_month = tmp_m + 1;
        }
    }
    else if (type == 'Q') {
        var tmp_q = browser.ns6 ? this.containerLayer.ownerDocument.forms[0].quarter.selectedIndex : this.containerLayer.document.forms[0].quarter.selectedIndex;
        if (this.f_begin) {
            tmp_day = '1';
            tmp_month = ((tmp_q * 3) + 1);
        }
        else {
            tmp_day = this.daysInMonth[(((tmp_q + 1) * 3) - 1)];
            tmp_month = ((tmp_q + 1) * 3);
        }
    }
    else if (type == 'Y') {
            if (this.f_begin) {
                tmp_day = '1';
                tmp_month = '1';
            }
            else {
                tmp_day = '31';
                tmp_month = '12';
            }
        }
    tmp.value = tmp_day + this.dateDelim + padZero(tmp_month) + this.dateDelim + tmp_y;
    if (this.language == 'Thai') {
        if (type == 'M') {
            tmp_show.value = padZero(tmp_month) + this.dateDelim + eval((tmp_y * 1) + 543);
        }
        if (type == 'Q') {
            tmp_show.value = 'Q' + (tmp_q + 1) + this.dateDelim + eval((tmp_y * 1) + 543);
        } else if (type == 'Y') {
            tmp_show.value = eval((tmp_y * 1) + 543);
        }
    } else {
        if (type == 'M') {
            tmp_show.value = padZero(tmp_month) + this.dateDelim + tmp_y;
        }
        if (type == 'Q') {
            tmp_show.value = 'Q' + (tmp_q + 1) + this.dateDelim + tmp_y;
        } else if (type == 'Y') {
            tmp_show.value = tmp_y;
        }
    }
    if (document.getElementById('DivShim')) {
        var IfrRef = document.getElementById('DivShim');
        IfrRef.style.display = "none";
    }
    this.containerLayer.style.visibility = 'hidden';
}

Calendar.prototype.clickDay = function(day) {
    var tmp = eval('document.' + this.target);
    var tmp_show = eval('document.' + this.target_show);
    tmp.value = day + this.dateDelim + padZero((this.month + 1)) + this.dateDelim + this.year;
    if (this.language == 'Thai')
        tmp_show.value = day + this.dateDelim + padZero((this.month + 1)) + this.dateDelim + eval((this.year * 1) + 543);
    else
        tmp_show.value = tmp.value;
    if (document.getElementById('DivShim')) {
        var IfrRef = document.getElementById('DivShim');
        IfrRef.style.display = "none";
    }
    fireEvent(tmp, 'change');
    this.containerLayer.style.visibility = 'hidden';
}

Calendar.prototype.writeString = function(str) {
    this.containerLayer.innerHTML = str;
}

Calendar.prototype.show = function(language, event, target, target_show, argType, backYear, bIsBegin, dateTo) {
    // this calendar will be  inactive for the day later than dateTo
    this.dateFrom = new Date(backYear, 0, 1);
    this.dateFromDay = padZero(this.dateFrom.getDate());
    this.dateFromMonth = padZero(this.dateFrom.getMonth());
    this.dateFromYear = this.dateFrom.getFullYear();
    if (dateTo) this.dateTo = dateTo;
    else this.dateTo = new Date();
    this.dateToDay = padZero(this.dateTo.getDate());
    this.dateToMonth = padZero(this.dateTo.getMonth());
    this.dateToYear = this.dateTo.getFullYear();
    this.f_type = argType;
    this.f_begin = bIsBegin;
    if (browser.dom || browser.ie4) {
        if (this.containerLayer.style.visibility == 'visible') {
            if (document.getElementById('DivShim')) {
                var IfrRef = document.getElementById('DivShim');
                IfrRef.style.display = "none";
            }
            this.containerLayer.style.visibility = 'hidden';
            return;
        }
    }
    if (browser.ie5 || browser.ie4) {
        var event = window.event;
        var obj = event.srcElement;
        var obj = event.srcElement;
        x = 0;
        while (obj.offsetParent != null) {
            x += obj.offsetLeft;
            obj = obj.offsetParent;
        }
        x += obj.offsetLeft;
        y = 0;
        var obj = event.srcElement;
        while (obj.offsetParent != null) {
            y += obj.offsetTop;
            obj = obj.offsetParent;
        }
        y += obj.offsetTop;

        this.containerLayer.style.left = (x + 35)+"px";
        if (event.y > 0)
            this.containerLayer.style.top = y+"px";
    }
    if (browser.ns6) {
        this.containerLayer.style.left = event.pageX + 35 + "px";
        this.containerLayer.style.top = event.pageY + "px";
    }


    this.target = target;
    //add new variable by Pin
    this.target_show = target_show;
    this.language = language;

    var tmp = eval('document.' + this.target);
    if (tmp && tmp.value && tmp.value.split(this.dateDelim).length == 3) {
        var atmp = tmp.value.split(this.dateDelim)
        this.month = this.oMonth = parseInt(atmp[1] - 1, 10);
        this.day = this.oDay = parseInt(atmp[0], 10);
        this.year = this.oYear = parseInt(atmp[2], 10);
    } else { // no date set, default to today
        var theDate = new Date();
        this.year = this.oYear = theDate.getFullYear();
        this.month = this.oMonth = theDate.getMonth();
        this.day = this.oDay = theDate.getDate();
    }
    this.writeString(this.buildString());
    // and then show it!
    if (document.getElementById('DivShim')) {
        var IfrRef = document.getElementById('DivShim');
        IfrRef.style.width = this.containerLayer.offsetWidth;
        IfrRef.style.height = this.containerLayer.offsetHeight;
        IfrRef.style.top = this.containerLayer.style.top;
        IfrRef.style.left = this.containerLayer.style.left;
        IfrRef.style.zIndex = 90;
        IfrRef.style.display = "block";
        this.containerLayer.style.zIndex = 99;
    }
    this.containerLayer.style.visibility = 'visible';
}

Calendar.prototype.localeSensitiveShow = function(language, event, target, target_show, argType, backYear, bIsBegin, dateTo) {
    if (dateTo == null) {
        dateTo = new Date();
        if (language.toLowerCase().charAt(0) == 't') {
            dateTo.setFullYear(dateTo.getFullYear() + 543);
        }
    }
    if (language.toLowerCase().charAt(0) == 't' && this.containerLayer.style.visibility != 'visible') {
        dateTo.setFullYear(dateTo.getFullYear() - 543);
        var dateBox = eval('document.' + target);
        var dateString = dateBox.value;
        var adjustedYear = ( parseInt(dateString.substring(dateString.length - 4, dateString.length)) - 543 );
        var newDateString = dateString.substring(0, dateString.length - 4) + adjustedYear;
        dateBox.value = newDateString;
    }
    if (this.containerLayer.style.visibility == 'visible') {
        this.localeSensitiveHide();
    } else {
        this.show(language, event, target, target_show, argType, backYear, bIsBegin, dateTo);

        if (language.toLowerCase().charAt(0) == 't' && this.containerLayer.style.visibility == 'visible') {
            var dateBox = eval('document.' + target);
            var dateString = dateBox.value;
            var adjustedYear = ( parseInt(dateString.substring(dateString.length - 4, dateString.length)) + 543 );
            var newDateString = dateString.substring(0, dateString.length - 4) + adjustedYear;
            dateBox.value = newDateString;
        }
    }
}

///////////////////// Edit By Pak ////////////////////////////////////
Calendar.prototype.newShow = function(language, event, target, target_show, argType, backYear, bIsBegin, dateStart, dateTo) {
    // this calendar will be  inactive for the day later than dateTo
    if (dateStart) this.dateFrom = dateStart;
    else this.dateFrom = new Date(backYear, 0, 1);
    this.dateFromDay = padZero(this.dateFrom.getDate());
    this.dateFromMonth = padZero(this.dateFrom.getMonth());
    this.dateFromYear = this.dateFrom.getFullYear();
    if (dateTo) this.dateTo = dateTo;
    else this.dateTo = new Date();
    this.dateToDay = padZero(this.dateTo.getDate());
    this.dateToMonth = padZero(this.dateTo.getMonth());
    this.dateToYear = this.dateTo.getFullYear();
    this.f_type = argType;
    this.f_begin = bIsBegin;
    if (browser.dom || browser.ie4) {
        if (this.containerLayer.style.visibility == 'visible') {
            if (document.getElementById('DivShim')) {
                var IfrRef = document.getElementById('DivShim');
                IfrRef.style.display = "none";
            }
            this.containerLayer.style.visibility = 'hidden';
            return;
        }
    }
    if (browser.ie5 || browser.ie4) {
        var event = window.event;
        var obj = event.srcElement;
        var obj = event.srcElement;
        x = 0;
        while (obj.offsetParent != null) {
            x += obj.offsetLeft;
            obj = obj.offsetParent;
        }
        x += obj.offsetLeft;
        y = 0;
        var obj = event.srcElement;
        while (obj.offsetParent != null) {
            y += obj.offsetTop;
            obj = obj.offsetParent;
        }
        y += obj.offsetTop;

        this.containerLayer.style.left = x + 35;
        if (event.y > 0)
            this.containerLayer.style.top = y;
    }
    if (browser.ns6) {
        this.containerLayer.style.left = event.pageX + 10 + "px";
        this.containerLayer.style.top = event.pageY + "px";
    }

    this.target = target;
    //add new variable by Pin
    this.target_show = target_show;
    this.language = language;

    var tmp = eval('document.' + this.target);
    if (tmp && tmp.value && tmp.value.split(this.dateDelim).length == 3) {
        var atmp = tmp.value.split(this.dateDelim)
        this.month = this.oMonth = parseInt(atmp[1] - 1, 10);
        this.day = this.oDay = parseInt(atmp[0], 10);
        this.year = this.oYear = parseInt(atmp[2], 10);
    } else { // no date set, default to today
        var theDate = new Date();
        this.year = this.oYear = theDate.getFullYear();
        this.month = this.oMonth = theDate.getMonth();
        this.day = this.oDay = theDate.getDate();
    }
    this.writeString(this.buildString());
    // and then show it!
    if (document.getElementById('DivShim')) {
        var IfrRef = document.getElementById('DivShim');
        IfrRef.style.width = this.containerLayer.offsetWidth;
        IfrRef.style.height = this.containerLayer.offsetHeight;
        IfrRef.style.top = this.containerLayer.style.top;
        IfrRef.style.left = this.containerLayer.style.left;
        IfrRef.style.zIndex = 90;
        IfrRef.style.display = "block";
        this.containerLayer.style.zIndex = 99;
    }
    this.containerLayer.style.visibility = 'visible';
}

Calendar.prototype.newLocaleSensitiveShow = function(language, event, target, target_show, argType, backYear, bIsBegin, dateStart, dateTo) {
    if (dateStart == null) {
        dateStart = new Date();
        if (language.toLowerCase().charAt(0) == 't') {
            dateStart.setFullYear(dateStart.getFullYear() + 543);
        }
    }
    if (dateTo == null) {
        dateTo = new Date();
        if (language.toLowerCase().charAt(0) == 't') {
            dateTo.setFullYear(dateTo.getFullYear() + 543);
        }
    }
    if (language.toLowerCase().charAt(0) == 't' && this.containerLayer.style.visibility != 'visible') {
        dateStart.setFullYear(dateStart.getFullYear() - 543);
        dateTo.setFullYear(dateTo.getFullYear() - 543);
        var dateBox = eval('document.' + target);
        var dateString = dateBox.value;
        var adjustedYear = ( parseInt(dateString.substring(dateString.length - 4, dateString.length)) - 543 );
        var newDateString = dateString.substring(0, dateString.length - 4) + adjustedYear;
        dateBox.value = newDateString;
    }
    if (this.containerLayer.style.visibility == 'visible') {
        this.localeSensitiveHide();
    } else {
        this.newShow(language, event, target, target_show, argType, backYear, bIsBegin, dateStart, dateTo);

        if (language.toLowerCase().charAt(0) == 't' && this.containerLayer.style.visibility == 'visible') {
            var dateBox = eval('document.' + target);
            var dateString = dateBox.value;
            var adjustedYear = ( parseInt(dateString.substring(dateString.length - 4, dateString.length)) + 543 );
            var newDateString = dateString.substring(0, dateString.length - 4) + adjustedYear;
            dateBox.value = newDateString;
        }
    }
}
////////////////////////////// End Edit By Pak //////////////////////////////////////

Calendar.prototype.hide = function() {
    if (document.getElementById('DivShim')) {
        var IfrRef = document.getElementById('DivShim');
        IfrRef.style.display = "none";
    }
    this.containerLayer.style.visibility = 'hidden';
    this.language = 'aaa'; // just to initialize the variable
}
// utility function
function padZero(num) {
    return ((num <= 9) ? ("0" + num) : num);
}

// events capturing, careful you don't override this by setting something in the onload event of
window.onload = function() {
    new Calendar(new Date());
}
