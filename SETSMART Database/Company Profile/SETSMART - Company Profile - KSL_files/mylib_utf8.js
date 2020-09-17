var newWindow;

function autoFormat1(language, period,begin,show,isBegin){
			var patternB = eval(begin).value ;
			var dateB = eval(begin).value ;

			var show = eval(show) ;
			var begin = eval(begin) ;
			var idLast = patternB.lastIndexOf('/');
			var idFirst = patternB.indexOf('/');
			var iYear = 0;
			var iQuar = 0;
			var endYear = (patternB.substring((patternB.lastIndexOf('/'))+1,patternB.length)*1);
			if ( language == 'Thai'){
					endYear = endYear - 543;
			}
	//for Begin Date box
			if(period.value =='D'){
		 		show.value = patternB;
		 		begin.value = dateB;

		 	}else if(period.value =='M'){
		 		show.value = patternB.substring(idFirst+1,patternB.length);
		 		if ( isBegin ){
		 		    begin.value = '1'+dateB.substring(idFirst,dateB.length);
                } else {
                    imonth = (patternB.substring(idFirst+1,idLast)*1);
				    if(imonth==1 ||imonth==3 ||imonth==5 ||imonth==7 ||imonth==8 ||imonth==10 ||imonth==12)
					    begin.value = "31"+dateB.substring(idFirst,dateB.length);
				    else if(imonth==4 ||imonth==6 ||imonth==9 ||imonth==11 )
					    begin.value = "30"+dateB.substring(idFirst,dateB.length);
				    else if(imonth==2){
					    if ( endYear % 4 == 0 )
						    begin.value = "29"+dateB.substring(idFirst,dateB.length);
					    else
						    begin.value = "28"+dateB.substring(idFirst,dateB.length);
				    }

                }

		 	}else if(period.value =='Y'){
		 		show.value = patternB.substring(idLast+1,patternB.length);
		 		if (isBegin ){
		 			begin.value = '1/1/'+dateB.substring(idLast+1,dateB.length);
	 			} else {
		 				 		begin.value = '31/12/'+dateB.substring(idLast+1,dateB.length);
	 			}
		 	}else if(period.value =='Q'){
		 		iQuar = (patternB.substring(idFirst+1,idLast)*1);
		 		if(iQuar < 4){
		 			iQuar = 1;
		 			if ( isBegin ){
		 				begin.value = '1/1/'+dateB.substring(idLast+1,dateB.length);
	 				} else {
		 				begin.value = '31/3/'+dateB.substring(idLast+1,dateB.length);
	 				}
	 			}else if(iQuar >3 && iQuar <7){
		 			iQuar = 2;
		 			if ( isBegin ){
		 				begin.value = '1/4/'+dateB.substring(idLast+1,dateB.length);
	 				} else {
		 				begin.value = '30/6/'+dateB.substring(idLast+1,dateB.length);
	 				}
	 			}else if(iQuar >6 && iQuar <10){
		 			iQuar = 3;
		 			if ( isBegin ){
		 				begin.value = '1/7/'+dateB.substring(idLast+1,dateB.length);
	 				} else {
		 				begin.value = '30/9/'+dateB.substring(idLast+1,dateB.length);
	 				}
	 			}else if(iQuar >9){
		 			iQuar = 4;
		 			if ( isBegin ){
		 				begin.value = '1/10/'+dateB.substring(idLast+1,dateB.length);
	 				} else {
		 				begin.value = '31/12/'+dateB.substring(idLast+1,dateB.length);
	 				}
	 			}
		 		show.value = 'Q'+iQuar+patternB.substring(idLast,patternB.length);
		 	}
}
function autoFormat2(language, period,begin,end,shB,shE){
	        // variable to set value of showB,showE
			var patternB = eval(begin).value ;
			var patternE = eval(end).value ;
	        // variable to set value of begin,end
			var dateB = eval(begin).value ;
			var dateE = eval(end).value ;

			var begin = eval(begin) ;
			var end = eval(end) ;
			var showB = eval(shB) ;
			var showE = eval(shE) ;

			var idLast = patternB.lastIndexOf('/');
			var idFirst = patternB.indexOf('/');
			var iYear = 0;
			var iQuar = 0;
			var endYear = (patternE.substring((patternE.lastIndexOf('/'))+1,patternE.length)*1);

			if ( language == 'Thai'){
			    endYear = endYear -543 ; 			
			}
	//for Begin Date box
			if(period.value =='D'){
		 		showB.value = patternB;
		 		begin.value = dateB;
		 	}else if(period.value =='M'){
		 		showB.value = patternB.substring(idFirst+1,patternB.length);
		 		begin.value = '1'+dateB.substring(idFirst,dateB.length);
		 	}else if(period.value =='Y'){
		 		showB.value = patternB.substring(idLast+1,patternB.length);
		 		begin.value = '1/1/'+dateB.substring(idLast+1,dateB.length);
		 	}else if(period.value =='Q'){
		 		iQuar = (patternB.substring(idFirst+1,idLast)*1);
		 		if(iQuar < 4){
		 			iQuar = 1;
		 			begin.value = '1/1/'+dateB.substring(idLast+1,dateB.length);
	 			}else if(iQuar >3 && iQuar <7){
		 			iQuar = 2;
		 			begin.value = '1/4/'+dateB.substring(idLast+1,dateB.length);
	 			}else if(iQuar >6 && iQuar <10){
		 			iQuar = 3;
		 			begin.value = '1/7/'+dateB.substring(idLast+1,dateB.length);
	 			}else if(iQuar >9){
		 			iQuar = 4;
		 			begin.value = '1/10/'+dateB.substring(idLast+1,dateB.length);
	 			}
		 		showB.value = 'Q'+iQuar+patternB.substring(idLast,patternB.length);
		 	}
	//for End Date box
			idLast = patternE.lastIndexOf('/');
			idFirst = patternE.indexOf('/');
			if(period.value =='D'){
		 		showE.value = patternE;
		 		end.value = dateE;
		 	}else if(period.value =='M'){
		 		showE.value = patternE.substring(idFirst+1,patternE.length);
				imonth = (patternE.substring(idFirst+1,idLast)*1);
				if(imonth==1 ||imonth==3 ||imonth==5 ||imonth==7 ||imonth==8 ||imonth==10 ||imonth==12)
					end.value = "31"+dateE.substring(idFirst,dateE.length);
				else if(imonth==4 ||imonth==6 ||imonth==9 ||imonth==11 )
					end.value = "30"+dateE.substring(idFirst,dateE.length);
				else if(imonth==2){
					if ( endYear % 4 == 0 )
						end.value = "29"+dateE.substring(idFirst,dateE.length);
					else
						end.value = "28"+dateE.substring(idFirst,dateE.length);
				}
		 	}else if(period.value =='Y'){
		 		showE.value = patternE.substring(idLast+1,patternE.length);
		 		end.value = '31/12/'+dateE.substring(idLast+1,dateE.length);
		 	}else if(period.value =='Q'){
		 		iQuar = (patternE.substring(idFirst+1,idLast)*1);
		 		if(iQuar < 4){
		 			iQuar = 1;
		 			end.value = '31/3/'+dateE.substring(idLast+1,dateE.length);
	 			}else if(iQuar >3 && iQuar <7){
		 			iQuar = 2;
		 			end.value = '30/6/'+dateE.substring(idLast+1,dateE.length);
	 			}else if(iQuar >6 && iQuar <10){
		 			iQuar = 3;
		 			end.value = '30/9/'+dateE.substring(idLast+1,dateE.length);
	 			}else if(iQuar >9){
		 			iQuar = 4;
		 			end.value = '31/12/'+dateE.substring(idLast+1,dateE.length);
	 			}
		 		showE.value = 'Q'+iQuar+patternE.substring(idLast,patternE.length);
		 	}
		 }

function symbolWindow(url){
	screenWidth = screen.availWidth;
	screenHeight = screen.availHeight;

	winTop = 450 / 2;
	winLeft = 150 / 2;

        var nProperty = "scrollbars=no,menubar=no,status=yes,toolbar=no,resizable=no,titlebar=no,alwaysRaised=yes,width=450,height=150,top="+(winTop)+",left="+(winLeft);

	OLTdgWindow = window.open(url, "SymbolLookup", nProperty)
	OLTdgWindow.focus();
}

/*
function symbolWindow(url){
        aWindow = window.open(url,'symbolWindow', 'scrollbars=1,menubar=no,width=380,height=140,titlebar=no,alwaysRaised=yes, left=0,top=0,screenX=0,screenY=0');
        aWindow.focus();
}

*/

function isNumber(inputVal, allownegative, allowdecimal) {

    oneDecimal = false

    inputStr = "" + inputVal

    for (var i = 0; i < inputStr.length; i++) {
        var oneChar = inputStr.charAt(i)
        if (i == 0 && oneChar == "-") {
            if (allownegative==true)
                continue
            else
                return false
        }
        if (oneChar == "." && !oneDecimal) {
            if (allowdecimal==true) {
                oneDecimal = true
                continue
            }
            else
                return false
        }

        if (oneChar < "0" || oneChar > "9") {
            return false
        }
   }
   return true
}

function isDate(datestr,field1,fname) {
         var MinYear = 0, MaxYear = 99;
         var MinCent = 0, MaxCent = 99;
         var dateOk = false;
         var leap=false;
         var parts = datestr.split('/');
         var months = new Array(31,28,31,30,31,30,31,31,30,31,30,31);
         var cc = 0;
         var yy = parseInt(parts[2]);
	 	var mm = parseInt(parts[1]);
         var dd = parseInt(parts[0]);
         var ccyy = yy;

	 if(parts[1] == "08") { mm = 8 }
	 if(parts[1] == "09") { mm = 9 }
	 if(parts[0] == "08") { dd = 8 }
	 if(parts[0] == "09") { dd = 9 }

	    if (parts[2].length == 4) {
            cc = parts[2].substring(0,2);
            yy = parts[2].substring(2,4);

         }
         else {
            if (ccyy >= 20 ) ccyy +=1900;
            else ccyy += 2000;
         }

         if ((cc >= MinCent && cc <= MaxCent) && (yy >= MinYear && yy <= MaxYear) &&  (mm >= 1 && mm
      <= 12)) {
            if (mm == 2)  {
               if ( (ccyy % 4 != 0) || (ccyy % 100 == 0 && ccyy % 400 != 0) ) leap = false;
               else leap = true;
               months[1] += leap;
            }
          if (dd >= 1 && dd <= months[mm-1]) dateOk = true;
         }
         if (dateOk) CurrentDateObject = new Date(ccyy,parseInt(mm)-1,dd,0,0,0);
	 if (!dateOk)
	 {
             alert("Invalid date format for " + fname + ".")
             field1.focus()
	 }
	 return dateOk;
}

function checkfield(field1, type1, nlen, chknull, fname) {
    var   isvalid =true
    if (chknull) {
         if (field1.value == null || field1.value == "") {
             alert(fname + " requires a value.")
             isvalid=false
         }
    }

    strVal=field1.value;
    if (nlen != 0 && isvalid==true) {
         if (strVal.length < nlen) {
             alert(fname + " minimum " + nlen + " of character.")
             isvalid=false
         }
    }

    if (type1 == "n-" && isvalid==true) {
         if (!isNumber(field1.value, true, true)) {
             alert("Invalid number for " + fname)
             isvalid=false
         }
    }
    if (type1 == "n" && isvalid==true) {
         if (!isNumber(field1.value, false, true)) {
             alert("Invalid positive number for " + fname)
             isvalid=false
         }
    }

    if (type1 == "i-" && isvalid==true) {
         if (!isNumber(field1.value, true, false)) {
             alert("Invalid integer for " + fname)
             isvalid=false
         }
    }

    if (type1 == "i" && isvalid==true) {
         if (!isNumber(field1.value, false, false)) {
             alert("Invalid positive integer for " + fname)
             isvalid=false
         }
    }

//------------------tested------------------------------------------//

   if (isvalid==true)
   {
      if (field1.type == "text")
      {
            field1.focus()
        }
        return true
    }
    else
        return false
    }

//-----------------------------------------------------------------//

function checkpassword(field1, type1, chknull, fname) {
    var   isvalid = true
    if (chknull) {
         if (field1.value == null || field1.value == "") {
             alert(fname + " requires a value.")
             isvalid=false
         }
    }

    strVal = field1.value

    if (isvalid==true)   {
    	var offset = 0
			offset = strVal.indexOf(' ')
			if (offset != -1)   {
				alert(fname + " cannot be space.")
		    	isvalid = false
			}
	}

    strVal = field1.value

    if (isvalid==true) {
         if( (strVal.length < 6) || (strVal.length > 10))
         {
             alert(fname + " must in 6-10 character.")
             isvalid=false
         }
    }

    if (isvalid==false) {
        if (field1.type == "text") {
            field1.focus()
        }
        return false
    }
    else
        return true
}

function setDateQuickPeriod(dateBeginValue, dateEndValue, quickPeriodValue, form, beginField, endField, showBeginField, showEndField, periodField, quickPeriodField) {

    var beginParam = eval( 'document.'+form+'.'+beginField );
    var endParam = eval( 'document.'+form+'.'+endField );
    beginParam.value = dateBeginValue;
    endParam.value = dateEndValue;

    var showBeginParam = eval( 'document.'+form+'.'+showBeginField );
    var showEndParam = eval( 'document.'+form+'.'+showEndField );
    showBeginParam.value = dateBeginValue;
    showEndParam.value = dateEndValue;

    var quickPeriodParam = eval( 'document.' + form + '.' + quickPeriodField );
    quickPeriodParam.value = quickPeriodValue;
    
    if(periodField != null && periodField != '') {
      var periodParam = eval( 'document.'+form+'.'+periodField );
      periodParam.value = 'D';
    }
    eval( 'document.'+form).submit();
}

function setDateNoQuickPeriod(dateBegin, dateEnd, form, begin, end, showBegin, showEnd, period) {

    var beginParam = eval( 'document.'+form+'.'+begin );
    var endParam = eval( 'document.'+form+'.'+end );
    beginParam.value = dateBegin;
    endParam.value = dateEnd;

    var showBeginParam = eval( 'document.'+form+'.'+showBegin );
    var showEndParam = eval( 'document.'+form+'.'+showEnd );
    showBeginParam.value = dateBegin;
    showEndParam.value = dateEnd;

    if(period != null && period != '') {
      var periodParam = eval( 'document.'+form+'.'+period );
      periodParam.value = 'D';
    }
    eval( 'document.'+form).submit();
}



