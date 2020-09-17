function MM_swapImgRestore() { //v3.0
  var i,x,a=document.MM_sr; for(i=0;a&&i<a.length&&(x=a[i])&&x.oSrc;i++) x.src=x.oSrc;
}

function MM_preloadImages() { //v3.0
  var d=document; if(d.images){ if(!d.MM_p) d.MM_p=new Array();
    var i,j=d.MM_p.length,a=MM_preloadImages.arguments; for(i=0; i<a.length; i++)
    if (a[i].indexOf("#")!=0){ d.MM_p[j]=new Image; d.MM_p[j++].src=a[i];}}
}

function MM_findObj(n, d) { //v4.01
  var p,i,x;  if(!d) d=document; if((p=n.indexOf("?"))>0&&parent.frames.length) {
    d=parent.frames[n.substring(p+1)].document; n=n.substring(0,p);}
  if(!(x=d[n])&&d.all) x=d.all[n]; for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
  for(i=0;!x&&d.layers&&i<d.layers.length;i++) x=MM_findObj(n,d.layers[i].document);
  if(!x && d.getElementById) x=d.getElementById(n); return x;
}

function MM_swapImage() { //v3.0
  var i,j=0,x,a=MM_swapImage.arguments; document.MM_sr=new Array; for(i=0;i<(a.length-2);i+=3)
   if ((x=MM_findObj(a[i]))!=null){document.MM_sr[j++]=x; if(!x.oSrc) x.oSrc=x.src; x.src=a[i+2];}
}

function openWindow(url, windName, nWidth, nHeight){
	screenWidth = screen.availWidth;
	screenHeight = screen.availHeight;
	winTop = (screen.availHeight - nHeight) / 2;
	winLeft = (screen.availWidth - nWidth) / 2;
    var nProperty = "scrollbars=no,menubar=no,status=yes,toolbar=no,resizable=no,titlebar=no,alwaysRaised=yes,width="+(nWidth)+",height="+(nHeight)+",top="+(winTop)+",left="+(winLeft);
	OLTdgWindow = window.open(url, windName, nProperty)
	OLTdgWindow.focus();
}

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

function isDate(datestr,field1,fname,strMsg) {
         var MinYear = 0, MaxYear = 99;
         var MinCent = 0, MaxCent = 99;
         var dateOk = false;
         var leap=false;
         var parts = datestr.split('/');
         var months = new Array(31,28,31,30,31,30,31,31,30,31,30,31);
		if (parts.length != 3) {
			alert(strMsg);
			return false;
		 }
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
     if ((cc >= MinCent && cc <= MaxCent) && (yy >= MinYear && yy <= MaxYear) &&  (mm >= 1 && mm <= 12)) {
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
             // alert("Invalid date format for " + fname + ".")
             alert(strMsg)
        //     field1.focus()
	 }
	 return dateOk;
}

function compareDate(beginDate, endDate, strMsg) {
	var tmpB = beginDate.split('/');
	var tmpE = endDate.split('/');
	var begin = parseInt(''+tmpB[2] + padZero(parseInt(tmpB[1],10)) +padZero(parseInt(tmpB[0],10)), 10);
	var end = parseInt(''+tmpE[2] + padZero(parseInt(tmpE[1],10)) +padZero(parseInt(tmpE[0],10)), 10);
	if (begin > end){
		alert(strMsg);
		return false;
	}
	return true;
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

   if (isvalid==true) {
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
function validpswd(password1, password2){
    if (password1.value != password2.value) {
        alert ("Password validation failed please re-enter password.")
        password1.focus()
        return false
    }
    return true
}

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

function doReload(){
	if ((strRefresh == 'Y') || (strRefresh == 'y'))
		setTimeout("refresh()", strTimeRefresh*60*1000);
	else
		strFrmName.lstTimeRefresh.disabled = true;
}

function setReload(modeRefresh,language){
	if (modeRefresh != ''){
		if (modeRefresh != strRefresh)
		{	strRefresh = modeRefresh;
			if (modeRefresh == 'Y'){
					if (strFrmName.lstTimeRefresh.value == '0')
							strFrmName.lstTimeRefresh.value = '1';
			}else{
				strFrmName.lstTimeRefresh.value = '0';
			}
			refresh();
		}
	}else{
		if (strRefresh == 'Y'){
			if (strFrmName.lstTimeRefresh.value != '0')
	 			refresh();
	 		else{
		 		if (language == 'T' || language=='t')
	 				alert('à¸?à¸£à¸¸à¸“à¸²à¹€à¸¥à¸·à¸­à¸?à¹€à¸§à¸¥à¸²à¸—à¸µà¹?à¹?à¸?à¹?à¹?à¸?à¸?à¸²à¸£à¹€à¸?à¸¥à¸µà¹?à¸¢à¸?à¹?à¸?à¸¥à¸?à¸­à¸±à¸•à¹?à¸?à¸¡à¸±à¸•à¸´');
	 			else
	 				alert('Please choose time to refresh');
	 			strFrmName.lstTimeRefresh.value = strTimeRefresh;}
		}
	}
}
function makeRemote(url, name, prop){
	remote = window.open(url, name,prop);
	remote.location.href = url;
    if (remote.opener == null)
    	remote.opener = window;
	remote.opener.name = "opener";

}
function trim(inputString) {
   // Removes leading and trailing spaces from the passed string. Also removes
   // consecutive spaces and replaces it with one space. If something besides
   // a string is passed in (null, custom object, etc.) then return the input.
   if (typeof inputString != "string") { return inputString; }
   var retValue = inputString;
   var ch = retValue.substring(0, 1);
   while (ch == " ") { // Check for spaces at the beginning of the string
      retValue = retValue.substring(1, retValue.length);
      ch = retValue.substring(0, 1);
   }
   ch = retValue.substring(retValue.length-1, retValue.length);
   while (ch == " ") { // Check for spaces at the end of the string
      retValue = retValue.substring(0, retValue.length-1);
      ch = retValue.substring(retValue.length-1, retValue.length);
   }
   while (retValue.indexOf("  ") != -1) { // Note that there are two spaces in the string - look for multiple spaces within the string
      retValue = retValue.substring(0, retValue.indexOf("  ")) + retValue.substring(retValue.indexOf("  ")+1, retValue.length); // Again, there are two spaces in each of the strings
   }
   return retValue; // Return the trimmed string back to the user
} // Ends the "trim" function
