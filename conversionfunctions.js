module.exports = { convertAllEscapes }
// test string abcáßçकखी國際𐎄𐎔𐎘
	 /*
	Copyright (C) 2007  Richard Ishida ishida@w3.org
	This program is free software; you can redistribute it and/or modify it under the terms 
	of the GNU General Public License as published by the Free Software Foundation; either 
	version 2 of the License, or (at your option) any later version as long as you point to 
	http://rishida.net/ in your code.

	This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; 
	without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  
	See the GNU General Public License for more details. http://www.gnu.org/licenses/gpl.html
	
	*/


function displayResults(str, src) {
	// convert the string of characters into various formats and send to UI
	// str: string, the string of characters
	// src: string, the id of the UI location that originated the request
	var preserve = 'none'
	var pad = true
	var showinvisibles
	var bidimarkup
	var cstyle = false
	if (src !== 'chars') { chars.value = str }
	if (src !== 'XML') { 
		XML.value = convertCharStr2XML(str, getParameters(document.getElementById('xmlOptions')))
		}
	if (src != 'hexNCRs') { 
		hexNCRs.value = convertCharStr2SelectiveCPs( str, getParameters(document.getElementById('hexNCROptions')), true, '&#x', ';', 'hex' );
		}
	if (src != 'decNCRs') { 
		decNCRs.value = convertCharStr2SelectiveCPs( str, getParameters(document.getElementById('decNCROptions')), false, '&#', ';', 'dec' )
		}
	if (src != 'jEsc') { 
		jEsc.value = convertCharStr2jEsc( str, getParameters(document.getElementById('jEscOptions')) )
		}
	if (src != 'rust') { 
		rust.value = convertCharStr2Rust( str, getParameters(document.getElementById('rustOptions')) )
		}
	if (src !== 'perl') { 
		perl.value = convertCharStr2Perl( str, getParameters(document.getElementById('perlOptions')) )
		}
	if (src !== 'CSS') { 
		CSS.value = convertCharStr2CSS( str )
		}
	if (src !== 'pEsc') { 
		pEsc.value = convertCharStr2pEsc( str )
		}
	if (src !== 'Unicode') { 
		preserve = 'none';
		if (document.getElementById('unicodeascii').checked) { preserve = 'ascii' } 
		Unicode.value = convertCharStr2CP(str, preserve, 4, 'unicode');
		}
	if (src !== 'zeroX') { 
		preserve = 'none'
		if (document.getElementById('zeroXascii').checked) { preserve = 'ascii'; } 
		zeroX.value = convertCharStr2CP(str, preserve, 0, 'zerox');
		}


    if (src !== 'codePoints') { 
		preserve = 'none'
		if (document.getElementById('hexcpascii').checked) { preserve = 'ascii' } 
		codePoints.value = convertCharStr2CP(str, preserve, document.getElementById('hexcppad').value, 'hex', document.getElementById('hexcpascii').checked)
		}
	if (src != 'decCodePoints') { 
		preserve = 'none';
		if (document.getElementById('deccpascii').checked) { preserve = 'ascii'; } 
		decCodePoints.value = convertCharStr2CP(str, preserve, 0, 'dec', document.getElementById('deccpascii').checked)
		}
	if (src != 'UTF8') { 
		UTF8.value = convertCharStr2UTF8( str );
		}
	if (src != 'UTF16') { 
		UTF16.value = convertCharStr2UTF16( str );
		}
	}


function getParameters (node) {
	var par = ''
	var checkboxes = node.querySelectorAll('input[type=checkbox]')
	for (var c=0;c<checkboxes.length;c++) {
		if (c>0) par += ';'
		if (checkboxes[c].checked) par += checkboxes[c].dataset.fn
		else par += ''
		}
		
	return par
	}


function extractEscapes (strIn) {
    // strips away everything except the escapes from the string in the green box
    
    strIn = ' '+strIn
    strIn += '             '
    var str = ''
    var hexSet = new Set(['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'])
    var decSet = new Set(['0','1','2','3','4','5','6','7','8','9'])
    var separatorSet = new Set([' ',',','<','>','(',')','{','}','-','+','[',']','/','|','"','\'',':',';','\u00AB','\u00BB','\u2018','\u2019','\u201C','\u201D','\u3008','\u3009','\u300A','\u300B','\u300C','\u300D','\u300E','\u300F','\u00B7','\u3001','\u3002'])

    
    var chars = [...strIn]
	for (let i=0; i<chars.length; i++) {
        if (chars[i] === '&' && chars[i+1]==='#' && chars[i+2]==='x') {
            let p = i+3
            str += '&#x'
            while (p < chars.length && chars[p] !== ';') str += chars[p++]
            str += ';'
            i = p
            }
        else if (chars[i] === '&' && chars[i+1]==='#') {
            let p = i+2
            str += '&#'
            while (p < chars.length && chars[p] !== ';') str += chars[p++]
            str += ';'
            i = p
            }
        else if (chars[i]==='\\' && chars[i+1]==='u' && chars[i+2]==='{') {
            let p = i+3
            str += '\\u{'
            while (p < chars.length && chars[p] !== '}') str += chars[p++]
            str += '}'
            i = p
            }
        else if (chars[i]==='\\' && chars[i+1]==='x' && chars[i+2]==='{') {
            let p = i+3
            str += '\\x{'
            while (p < chars.length && chars[p] !== '}') str += chars[p++]
            str += '}'
            i = p
            }
         else if (chars[i]==='\\' && chars[i+1]==='u') {
            let p = i+2
            str += '\\u'
            while (p < chars.length && hexSet.has(chars[p].toLowerCase())) str += chars[p++]
            str += ''
            i = p-1
            }
         else if (chars[i]==='\\' && chars[i+1]==='x') {
            let p = i+2
            str += '\\x'
            while (p < chars.length && p<i+4) str += chars[p++]
            str += ''
            i = p-1
            }
         else if (chars[i]==='\\' && chars[i+1]==='U') {
            let p = i+2
            str += '\\U'
            while (p < chars.length && p<i+10 && hexSet.has(chars[p].toLowerCase())) str += chars[p++]
            str += ''
            i = p-1
            }
         else if (chars[i]==='U' && chars[i+1]==='+') {
            let p = i+2
            str += 'U+'
            while (p < chars.length && hexSet.has(chars[p].toLowerCase()) && p<i+8) str += chars[p++]
            str += ''
            i = p-1
            }
         else if (chars[i]==='0' && chars[i+1]==='x') {
            let p = i+2
            str += ' 0x'
            while (p < chars.length && hexSet.has(chars[p].toLowerCase()) && p<i+8) str += chars[p++]
            str += ''
            i = p-1
            }
         else if (chars[i]==='%' && hexSet.has(chars[i+1].toLowerCase()) && hexSet.has(chars[i+2].toLowerCase())) {
            let p = i+1
            str += '%'
            while (p < chars.length && p<i+3) str += chars[p++]
            str += ''
            i = p-1
            }
         else if (chars[i]==='\\' && hexSet.has(chars[i+1].toLowerCase()) && hexSet.has(chars[i+2].toLowerCase())) {
            let p = i+1
            str += '\\'
            while (p < chars.length && p<i+7 && hexSet.has(chars[p].toLowerCase())) str += chars[p++]
            str += ''
            i = p-1
            }
         else if (document.getElementById('numbers').value==='hex' && hexSet.has(chars[i].toLowerCase()) && i<chars.length-3 && separatorSet.has(chars[i-1].toLowerCase()) && hexSet.has(chars[i+1].toLowerCase())) {
            let p = i+1
            let temp = ' '+chars[i]
            while (p < chars.length-3 && p<i+6 && hexSet.has(chars[p].toLowerCase())) temp += chars[p++]
            if (separatorSet.has(chars[p].toLowerCase())) str += temp
            i = p-1
            }
         else if (document.getElementById('numbers').value==='dec' && decSet.has(chars[i].toLowerCase()) && i<chars.length-3 && separatorSet.has(chars[i-1].toLowerCase()) && decSet.has(chars[i+1].toLowerCase())) {
            let p = i+1
            let temp = ' '+chars[i]
            while (p < chars.length-3 && p<i+6 && decSet.has(chars[p].toLowerCase())) temp += chars[p++]
            if (separatorSet.has(chars[p].toLowerCase())) str += temp
            i = p-1
            }
       else {str += ' ' } // do nothing
        }
    
    str = str.replace(/\s+/g,' ')
    return str.trim()
    }



function hex2char ( hex ) {
	// converts a single hex number to a character
	// note that no checking is performed to ensure that this is just a hex number, eg. no spaces etc
	// hex: string, the hex codepoint to be converted
	var result = ''
	var n = parseInt(hex, 16)
    if (n <= 0x10FFFF) result += String.fromCodePoint(n)
	else result += 'hex2Char error: Code point out of range: '+dec2hex(n)
	return result
	}


function dec2char ( n ) {
	// converts a single string representing a decimal number to a character
	// note that no checking is performed to ensure that this is just a hex number, eg. no spaces etc
	// dec: string, the dec codepoint to be converted
	var result = '';
    if (n <= 0xFFFF) { result += String.fromCharCode(n); } 
	else if (n <= 0x10FFFF) {
		n -= 0x10000
		result += String.fromCharCode(0xD800 | (n >> 10)) + String.fromCharCode(0xDC00 | (n & 0x3FF));
    	} 
	else { result += 'dec2char error: Code point out of range: '+dec2hex(n); }
	return result;
	}

function dec2hex ( textString ) {
	return (textString+0).toString(16).toUpperCase();
	}

function  dec2hex2 ( textString ) {
	var hexequiv = new Array ("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F");
	return hexequiv[(textString >> 4) & 0xF] + hexequiv[textString & 0xF];
	}

function  dec2hex4 ( textString ) {
	var hexequiv = new Array ("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F");
	return hexequiv[(textString >> 12) & 0xF] + hexequiv[(textString >> 8) & 0xF] 
		+ hexequiv[(textString >> 4) & 0xF] + hexequiv[textString & 0xF];
	}


function convertChar2CP ( textString ) { 
	var haut = 0;
	var n = 0;
	var CPstring = '';
	for (var i = 0; i < textString.length; i++) {
		var b = textString.charCodeAt(i); 
		if (b < 0 || b > 0xFFFF) {
			CPstring += 'Error in convertChar2CP: byte out of range ' + dec2hex(b) + '!';
			}
		if (haut != 0) {
			if (0xDC00 <= b && b <= 0xDFFF) {
				CPstring += dec2hex(0x10000 + ((haut - 0xD800) << 10) + (b - 0xDC00)) + ' ';
				haut = 0;
				continue;
				}
			else {
				CPstring += 'Error in convertChar2CP: surrogate out of range ' + dec2hex(haut) + '!';
				haut = 0;
				}
			}
		if (0xD800 <= b && b <= 0xDBFF) {
			haut = b;
			}
		else {
			CPstring += dec2hex(b) + ' ';
			}
		}
	return CPstring.substring(0, CPstring.length-1);
	}




// ========================== Converting to characters ==============================================


function convertAllEscapes (str, numbers) {
	// converts all escapes in the text str to characters, and can interpret numbers as escapes too
	// str: string, the text to be converted
	// numbers: string enum [none, hex, dec, utf8, utf16], what to treat numbers as
	
	//sle = document.getElementById('singleletterescapes').checked
	str = convertUnicode2Char(str)
	str = convert0x2Char(str)
	str = convertuBracket2Char(str)
	str = convertuBrSequence2Char(str)
	str = convertxBracket2Char(str)
	str = convertx002Char(str)
	str = convertHexNCR2Char(str)
	str = convertDecNCR2Char(str)
	str = convertU0000002Char(str)
	str = convertU00002Char(str)
	str = convertCSS2Char(str, false)
	str = convertpEnc2Char(str)
	str = convertEntities2Char(str)
	str = convertGreenNumbers2Char(str, numbers)
	
	//if (sle) str = convertSlashChar2Char(str)
	str = convertSlashChar2Char(str)
	return str
	}




function convertUnicode2Char ( str ) { 
	// converts a string containing U+... escapes to a string of characters
	// str: string, the input
	
	// first convert the 6 digit escapes to characters
	str = str.replace(/[Uu]\+10([A-Fa-f0-9]{4})/g, 
					function(matchstr, parens) {
						return hex2char('10'+parens)
						}
						)
	// next convert up to 5 digit escapes to characters
	str = str.replace(/[Uu]\+([A-Fa-f0-9]{1,5})/g, 
					function(matchstr, parens) {
						return hex2char(parens)
						}
						)
	return str
	}

	
function convertHexNCR2Char ( str ) { 
	// converts a string containing &#x...; escapes to a string of characters
	// str: string, the input
	
	// convert up to 6 digit escapes to characters
	str = str.replace(/&#x([A-Fa-f0-9]{1,6});/g, 
					function(matchstr, parens) {
						return hex2char(parens)
						}
						)
	return str
	}

function convertDecNCR2Char ( str ) { 
	// converts a string containing &#...; escapes to a string of characters
	// str: string, the input
	
	// convert up to 6 digit escapes to characters
	str = str.replace(/&#([0-9]{1,7});/g, 
					function(matchstr, parens) {
						return dec2char(parens)
						}
						)
	return str
	}

function convert0x2Char ( str ) { 
	// converts a string containing 0x... escapes to a string of characters
	// str: string, the input
    
    // change 0x to �� to avoid things like 0x1F4680x200D as being interpreted as too big a number
    str = str.replace(/0x/g,'��')
	
	// convert up to 6 digit escapes to characters
	str = str.replace(/��([A-Fa-f0-9]{1,6})/g, 
					function(matchstr, parens) {
						return hex2char(parens)
						}
						)
	return str
	}

function convertCSS2Char ( str, convertbackslash ) { 
	// converts a string containing CSS escapes to a string of characters
	// str: string, the input
	// convertbackslash: boolean, true if you want \x etc to become x or \a to be treated as 0xA
	
	// convert up to 6 digit escapes to characters & throw away any following whitespace
	if (convertbackslash) {	
		str = str.replace(/\\([A-Fa-f0-9]{1,6})(\s)?/g, 
					function(matchstr, parens) {
						return hex2char(parens)
						}
						)
	 	str = str.replace(/\\/g, '')
	 	}
	else {
		str = str.replace(/\\([A-Fa-f0-9]{2,6})(\s)?/g, 
					function(matchstr, parens) {
						return hex2char(parens)
						}
						)
		}
	return str
	}


function convertuBracket2Char ( str ) { 
	// converts a string containing \u{...} escapes to a string of characters
	// str: string, the input
	
	// convert escapes to characters
	str = str.replace(/\\u\{([A-Fa-f0-9]{1,})\}/g, 
					function(matchstr, parens) {
						return hex2char(parens)
						}
						)
	return str
	}


function convertuBrSequence2Char ( str ) { 
	// converts a string containing \u{... ... ...} escapes to a string of characters
	// str: string, the input
	
	// convert escapes to characters
	str = str.replace(/\\u\{([A-Fa-f0-9 ]{1,})\}/g, 
					function(matchstr, parens) {
                        if (parens.match(' ')) {
                            var out = ''
                            var chars = parens.split(' ')
                            for (let i=0;i<chars.length;i++) out += hex2char(chars[i])
                            return out
                            }
                        else return hex2char(parens)
						}
						)
	return str
	}


function convertxBracket2Char ( str ) { 
	// converts a string containing \x{...} escapes to a string of characters
	// str: string, the input
	
	// convert escapes to characters
	str = str.replace(/\\x\{([A-Fa-f0-9]{1,})\}/g, 
					function(matchstr, parens) {
						return hex2char(parens)
						}
						)
	return str
	}


function convertU0000002Char ( str ) { 
	// converts a string containing \U + 6 digit escapes to a string of characters
	// str: string, the input
	
	// convert escapes to characters
	str = str.replace(/\\U([A-Fa-f0-9]{8})/g, 
					function(matchstr, parens) {
						return hex2char(parens)
						}
						)
	return str
	}


function convertU00002Char ( str ) { 
	// converts a string containing \u + 6 digit escapes to a string of characters
	// str: string, the input
	
	// convert escapes to characters
	str = str.replace(/\\u([A-Fa-f0-9]{4})/g, 
					function(matchstr, parens) {
						return hex2char(parens)
						}
						)
	return str
	}


function convertx002Char ( str ) { 
	// converts a string containing \x + 2 digit escapes to a string of characters
	// str: string, the input
	
	// convert escapes to characters
	str = str.replace(/\\x([A-Fa-f0-9]{2})/g, 
					function(matchstr, parens) {
						return hex2char(parens)
						}
						)
	return str
	}


function convertSlashChar2Char ( str ) { 
	// convert \b etc to characters, if flag set
	// str: string, the input
	
	// convert escapes to characters
    //str = str.replace(/\\0/g, '\0'); 
    str = str.replace(/\\b/g, '\b'); 
    str = str.replace(/\\t/g, '\t'); 
    str = str.replace(/\\n/g, '\n'); 
    str = str.replace(/\\v/g, '\v'); 
    str = str.replace(/\\f/g, '\f'); 
    str = str.replace(/\\r/g, '\r'); 
    str = str.replace(/\\\'/g, '\''); 
    str = str.replace(/\\\"/g, '\"'); 
    str = str.replace(/\\\\/g, '\\'); 
	return str
	}








function convertEntities2Char ( str ) { 
	// converts a string containing HTML/XML character entities to a string of characters
	// str: string, the input
	
	str = str.replace(/&([A-Za-z0-9]+);/g, 
					function(matchstr, parens) { //alert(parens);
						if (parens in entities) { //alert(entities[parens]);
							return entities[parens]
							} 
						else { return matchstr }						}
						)
	return str
	}


function convertGreenNumbers2Char ( str, type ) { 
	// converts a string containing number sequences IN THE GREEN BOX to a string of characters
	// str: string, the input
	// type: string enum [none, hex, dec, utf8, utf16], what to treat numbers as
	
	if (type === 'hex') {
		str = str.replace(/(\b[A-Fa-f0-9]{2,8}\b)/g, 
					function(matchstr, parens) {
						return hex2char(parens)
						}
						)
		}
	else if (type === 'dec') {
		str = str.replace(/(\b[0-9]+\b)/g, 
					function(matchstr, parens) {
						return dec2char(parens)
						}
						)
		}
	else if (type === 'utf8') {
		str = str.replace(/(( [A-Fa-f0-9]{2})+)/g, 
		//str = str.replace(/((\b[A-Fa-f0-9]{2}\b)+)/g, 
					function(matchstr, parens) {
						return convertUTF82Char(parens) 
						}
						)
		}
	else if (type === 'utf16') {
		str = str.replace(/(( [A-Fa-f0-9]{1,6})+)/g, 
					function(matchstr, parens) {
						return convertUTF162Char(parens)
						}
						)
		}
	return str
	}



function convertNumbers2Char ( str, type ) { 
	// converts a string containing number sequences to a string of characters
	// str: string, the input
	// type: string enum [none, hex, dec, utf8, utf16], what to treat numbers as
	
	if (type === 'hex') {
		str = str.replace(/([A-Fa-f0-9]{2,8}\b)/g, 
					function(matchstr, parens) {
						return hex2char(parens)
						}
						)
		}
	else if (type === 'dec') {
		str = str.replace(/([0-9]+\b)/g, 
					function(matchstr, parens) {
						return dec2char(parens)
						}
						)
		}
	else if (type === 'utf8') {
		str = str.replace(/(( [A-Fa-f0-9]{2})+)/g, 
		//str = str.replace(/((\b[A-Fa-f0-9]{2}\b)+)/g, 
					function(matchstr, parens) {
						return convertUTF82Char(parens) 
						}
						)
		}
	else if (type === 'utf16') {
		str = str.replace(/(( [A-Fa-f0-9]{1,6})+)/g, 
					function(matchstr, parens) {
						return convertUTF162Char(parens)
						}
						)
		}
	return str
	}



function convertSpaceSeparatedNumbers2Char ( str, type ) { 
	// converts a string containing number sequences to a string of characters
	// str: string, the input
	// type: string enum [none, hex, dec, utf8, utf16], what to treat numbers as
	
    // use a replacement for spaces, so they can be removed before the end
    str = str.replace(/ /g, '���')
    
	if (type === 'hex') {
		str = str.replace(/([A-Fa-f0-9]{2,8}\b)/g, 
					function(matchstr, parens) {
						return hex2char(parens)
						}
						)
		}
	else if (type === 'dec') {
		str = str.replace(/([0-9]+\b)/g, 
					function(matchstr, parens) {
						return dec2char(parens)
						}
						)
		}
	else if (type === 'utf8') {
		str = str.replace(/(( [A-Fa-f0-9]{2})+)/g, 
		//str = str.replace(/((\b[A-Fa-f0-9]{2}\b)+)/g, 
					function(matchstr, parens) {
						return convertUTF82Char(parens) 
						}
						)
		}
	else if (type === 'utf16') {
		str = str.replace(/(([A-Fa-f0-9]{1,6})+)/g, 
					function(matchstr, parens) {
						return convertUTF162Char(parens)
						}
						)
		}
	return str.replace(/���/g,'')
	}





function convertUTF82Char ( str ) {
	// converts to characters a sequence of space-separated hex numbers representing bytes in utf8
	// str: string, the sequence to be converted
	var outputString = ""
	var counter = 0
	var n = 0
	
	// remove leading and trailing spaces
	str = str.replace(/^\s+/, '')
	str = str.replace(/\s+$/,'')
	if (str.length === 0) return ""
	str = str.replace(/\s+/g, ' ')
  
	var listArray = str.split(' ')
	for ( let i=0; i < listArray.length; i++ ) {
		var b = parseInt(listArray[i], 16)  // alert('b:'+dec2hex(b));
		switch (counter) {
		case 0:
			if (0 <= b && b <= 0x7F) {  // 0xxxxxxx
				outputString += dec2char(b); } 
			else if (0xC0 <= b && b <= 0xDF) {  // 110xxxxx
				counter = 1;
				n = b & 0x1F; }
			else if (0xE0 <= b && b <= 0xEF) {  // 1110xxxx
				counter = 2;
				n = b & 0xF; }
			else if (0xF0 <= b && b <= 0xF7) {  // 11110xxx
				counter = 3;
				n = b & 0x7; }
			else {
				outputString += 'convertUTF82Char: error1 ' + dec2hex(b) + '! '
				}
			break;
		case 1:
			if (b < 0x80 || b > 0xBF) {
				outputString += 'convertUTF82Char: error2 ' + dec2hex(b) + '! '
				}
			counter--;
			outputString += dec2char((n << 6) | (b-0x80));
			n = 0;
			break;
		case 2: case 3:
			if (b < 0x80 || b > 0xBF) {
				outputString += 'convertUTF82Char: error3 ' + dec2hex(b) + '! '
				}
			n = (n << 6) | (b-0x80)
			counter--
			break
		}
		}
		return outputString.replace(/ $/, '')
	}



function convertUTF162Char ( str ) { 
	// Converts a string of UTF-16 code units to characters
	// str: sequence of UTF16 code units, separated by spaces
	var highsurrogate = 0
	var suppCP
	var n = 0
	var outputString = ''
	
	// remove leading and multiple spaces
	str = str.replace(/^\s+/,'');
	str = str.replace(/\s+$/,'');
	if (str.length == 0){ return; }
	str = str.replace(/\s+/g,' '); 
	
	var listArray = str.split(' ');
	for (var i = 0; i < listArray.length; i++) {
		var b = parseInt(listArray[i], 16); //alert(listArray[i]+'='+b);
		if (b < 0 || b > 0xFFFF) {
			outputString += '!Error in convertUTF162Char: unexpected value, b=' + dec2hex(b) + '!';
			}
		if (highsurrogate != 0) {
			if (0xDC00 <= b && b <= 0xDFFF) {
				outputString += dec2char(0x10000 + ((highsurrogate - 0xD800) << 10) + (b - 0xDC00));
				highsurrogate = 0;
				continue;
				}
			else {
				outputString += 'Error in convertUTF162Char: low surrogate expected, b=' + dec2hex(b) + '!';
				highsurrogate = 0;
				}
			}
		if (0xD800 <= b && b <= 0xDBFF) { // start of supplementary character
			highsurrogate = b;
			}
		else {
			outputString += dec2char(b);
			}
		}
	return outputString
	}



function convertpEnc2Char ( str ) { 
	// converts a string containing precent encoded escapes to a string of characters
	// str: string, the input
	
	// find runs of hex numbers separated by % and send them for conversion
	str = str.replace(/((%[A-Fa-f0-9]{2})+)/g, 
					function(matchstr, parens) {
						//return convertpEsc2Char(parens.replace(/%/g,' ')); 
						return convertpEsc2Char(parens)
						}
						)
	return str
	}



function convertpEsc2Char ( str ) {
	// converts to characters a sequence of %-separated hex numbers representing bytes in utf8
	// str: string, the sequence to be converted

	var outputString = "";
	var counter = 0;
	var n = 0;
	
	var listArray = str.split('%');
	for ( var i = 1; i < listArray.length; i++ ) {
		var b = parseInt(listArray[i], 16);  // alert('b:'+dec2hex(b));
		switch (counter) {
		case 0:
			if (0 <= b && b <= 0x7F) {  // 0xxxxxxx
				outputString += dec2char(b); } 
			else if (0xC0 <= b && b <= 0xDF) {  // 110xxxxx
				counter = 1;
				n = b & 0x1F; }
			else if (0xE0 <= b && b <= 0xEF) {  // 1110xxxx
				counter = 2;
				n = b & 0xF; }
			else if (0xF0 <= b && b <= 0xF7) {  // 11110xxx
				counter = 3;
				n = b & 0x7; }
			else {
				outputString += 'convertpEsc2Char: error ' + dec2hex(b) + '! ';
				}
			break;
		case 1:
			if (b < 0x80 || b > 0xBF) {
				outputString += 'convertpEsc2Char: error ' + dec2hex(b) + '! ';
				}
			counter--;
			outputString += dec2char((n << 6) | (b-0x80));
			n = 0;
			break;
		case 2: case 3:
			if (b < 0x80 || b > 0xBF) {
				outputString += 'convertpEsc2Char: error ' + dec2hex(b) + '! ';
				}
			n = (n << 6) | (b-0x80);
			counter--;
			break;
		}
		}
	return outputString;
	}


function convertjEsc2Char ( str, shortEscapes ) { 
	// converts a string containing JavaScript or Java escapes to a string of characters
	// str: string, the input
	// shortEscapes: boolean, if true the function will convert \b etc to characters
	
	// convert ES6 escapes to characters
	str = convertuBracket2Char(str)
    
	// convert \U and 6 digit escapes to characters
	str = convertU0000002Char(str)
    
	// convert \u and 4 digit escapes to characters
	str = convertU00002Char(str)
    
	// convert \x and 2 digit escapes to characters
	str = convertx002Char(str)
    
	// convert \b etc to characters, if flag set
	if (shortEscapes) {
		str = convertSlashChar2Char(str)
		}
	return str
	}


function convertRust2Char ( str, shortEscapes ) { 
	// converts a string containing Rust escapes to a string of characters
	// str: string, the input
	
	// convert \u{...} escapes to characters
	str = convertuBracket2Char(str)
    
	// convert \u{... ... ...} escapes to characters
	str = convertuBrSequence2Char(str)
    
	// convert \x and 2 digit escapes to characters
	str = convertx002Char(str)
    
	// convert \b etc to characters
    str = convertSlashChar2Char(str)
	return str
	}



function convertPerl2Char ( str, shortEscapes ) { 
	// converts a string containing Perl escapes to a string of characters
	// str: string, the input
	
	// convert \x{...} escapes to characters
	str = convertxBracket2Char(str)
    
	// convert \x and 2 digit escapes to characters
	str = convertx002Char(str)
    
	// convert \b etc to characters
    str = convertSlashChar2Char(str)
	return str
	}



function convertXML2Char (str) {
	// converts XML or HTML text to characters by removing all character entities and ncrs
	// str: string, the sequence to be converted

	// remove various escaped forms
	str = convertHexNCR2Char(str)
	str = convertDecNCR2Char(str)
	str = convertEntities2Char(str)
	
	return str
	}



// ============================== Convert to escapes ===============================================

function convertCharStr2XML ( str, parameters ) {
	// replaces xml/html syntax-sensitive characters in a string with entities
	// also replaces invisible and ambiguous characters with escapes (list to be extended)
	// str: string, the input string
    // parameters: string, list of enum[convertinvisibles, bidimarkup]
	// (convertinvisibles) invisible characters are converted to NCRs
	// (bidimarkup) bidi rle/lre/pdf/rli/lri/fsi/pdi characters are converted to markup
	str = str.replace(/&/g, '&amp;')
	str = str.replace(/"/g, '&quot;')
	str = str.replace(/</g, '&lt;')
	str = str.replace(/>/g, '&gt;')
	
	// replace invisible and ambiguous characters
    var nongraphic = new Set([
		'\u00AD',  // shy

        '\u061C',  // alm
        '\u070F',  // sam
        '\u08E2',  // end of ayah
        '\u180E',  // mvs
		'\u200B',  // zwsp
 		'\u200C',  // zwnj
		'\u200D',  // zwj
		'\u200E',  // lrm
		'\u200F',  // rlm
		'\u202A',  // lre
		'\u202B',  // rle
		'\u202D',  // lro
		'\u202E',  // rlo
		'\u202C',  // pdf
 		'\u2060',  // wjoiner
		'\u2061',  // func appln
 		'\u2062',  // inv x
		'\u2063',  // inv sep
		'\u2064',  // inv +
        '\u2066',  // lri
		'\u2067',  // rli
		'\u2068',  // fsi
		'\u2069',  // pdi
        '\u206A',  // iss
		'\u206B',  // ass
		'\u206C',  // iafs
		'\u206D',  // aafs
		'\u206E',  // nads
		'\u206F',  // nods
		'\uFFF9',  // iaa
		'\uFFFA',  // ias
		'\uFFFB',  // iat

		'\u13430',  // vert join
		'\u13431',  // horiz join
		'\u13432',  // ins top start
		'\u13433',  // ins bottom start
		'\u13434',  // ins top end
		'\u13435',  // ins bottom end
		'\u13436',  // overlay mid
		'\u13437',  // beg seg
		'\u13438',  // end seg

		'\u1BCA0',  // sh let overlap
		'\u1BCA1',  // sh cont overlap
		'\u1BCA2',  // sh format down
		'\u1BCA3',  // sh format up

		'\u1D173',  // mus beg beam
		'\u1D174',  // mus end beam
		'\u1D175',  // mus beg tie
		'\u1D176',  // mus end tie
		'\u1D177',  // mus beg slur
		'\u1D178',  // mus end slur
		'\u1D179',  // mus beg phrase
		'\u1D17A',  // mus end phrase
	
		'\u2000',  // en quad
		'\u2001',  // em quad
		'\u2002',  // en space
		'\u2003',  // em space
		'\u2004',  // 3 per em space
		'\u2005',  // 4 per em space
		'\u2006',  // 6 per em space
		'\u2007',  // figure space
		'\u2008',  // punctuation space
		'\u2009',  // thin space
		'\u200A',  // hair space
		'\u205F',  // mmsp
		'\u00A0',  // nbsp
		'\u3000',  // ideographic sp
		'\u202F',  // nnbsp

		'\u180B',  // mfvs1
		'\u180C',  // mfvs2
		'\u180D',  // mfvs3

		'\u2028',  // line sep

        '\u0000',  // null
        ])

	if (parameters.match(/convertinvisibles/)) {
        newstring = ''
        for (let i=0;i<str.length;i++) {
            if (str.codePointAt(i)===0x09 || str.codePointAt(i)===0x0A || str.codePointAt(i)===0x0D) newstring += str[i]
            else if (str.codePointAt(i)<32 || (str.codePointAt(i)>126 && str.codePointAt(i)<160) || str.codePointAt(i)>0xE0000) {
                hex = str.codePointAt(i).toString(16).toUpperCase()
                while (hex.length < 4) hex = '0'+hex
                newstring += '&#x'+hex+';'
                }
            else if (nongraphic.has(str[i])) {
                hex = str.codePointAt(i).toString(16).toUpperCase()
                while (hex.length < 4) hex = '0'+hex
                newstring += '&#x'+hex+';'
                }
            else newstring += str[i]
            }
        str = newstring
        }

	// convert lre/rle/pdf/rli/lri/fsi/pdi to markup
	if (parameters.match(/bidimarkup/)) {
		str = str.replace(/\u2066|&#x2066;/g, '&lt;span dir=&quot;ltr&quot;&gt;') // lri
		str = str.replace(/\u2067|&#x2067;/g, '&lt;span dir=&quot;rtl&quot;&gt;') // rli
		str = str.replace(/\u2068|&#x2068;/g, '&lt;span dir=&quot;auto&quot;&gt;') // fsi
		str = str.replace(/\u2069|&#x2069;/g, '&lt;/span&gt;') // pdi
		
		str = str.replace(/\u202A|&#x202A;/g, '&lt;span dir=&quot;ltr&quot;&gt;') // lre
		str = str.replace(/\u202B|&#x202B;/g, '&lt;span dir=&quot;rtl&quot;&gt;') // rle
		str = str.replace(/\u202C|&#x202C;/g, '&lt;/span&gt;') // pdf
        
		//str = str.replace(/\u202D/g, '&lt;bdo dir=&quot;ltr&quot;&gt;')
		//str = str.replace(/\u202E/g, '&lt;bdo dir=&quot;rtl&quot;&gt;')
		}

	return str;
	}


function convertCharStr2XMLOLD ( str, parameters ) {
	// replaces xml/html syntax-sensitive characters in a string with entities
	// also replaces invisible and ambiguous characters with escapes (list to be extended)
	// str: string, the input string
    // parameters: string, list of enum[convertinvisibles, bidimarkup]
	// (convertinvisibles) invisible characters are converted to NCRs
	// (bidimarkup) bidi rle/lre/pdf/rli/lri/fsi/pdi characters are converted to markup
	str = str.replace(/&/g, '&amp;')
	str = str.replace(/"/g, '&quot;')
	str = str.replace(/</g, '&lt;')
	str = str.replace(/>/g, '&gt;')
	
	// replace invisible and ambiguous characters
	if (parameters.match(/convertinvisibles/)) {
		str = str.replace(/\u2066/g, '&#x2066;')  // lri
		str = str.replace(/\u2067/g, '&#x2067;')  // rli
		str = str.replace(/\u2068/g, '&#x2068;')  // fsi
		str = str.replace(/\u2069/g, '&#x2069;')  // pdi

		str = str.replace(/\u202A/g, '&#x202A;') // lre
		str = str.replace(/\u202B/g, '&#x202B;') // rle
		str = str.replace(/\u202D/g, '&#x202D;') // lro
		str = str.replace(/\u202E/g, '&#x202E;') // rlo
		str = str.replace(/\u202C/g, '&#x202C;') // pdf
		str = str.replace(/\u200E/g, '&#x200E;') // lrm
		str = str.replace(/\u200F/g, '&#x200F;') // rlm
		
		str = str.replace(/\u2000/g, '&#x2000;') // en quad
		str = str.replace(/\u2001/g, '&#x2001;') // em quad
		str = str.replace(/\u2002/g, '&#x2002;') // en space
		str = str.replace(/\u2003/g, '&#x2003;') // em space
		str = str.replace(/\u2004/g, '&#x2004;') // 3 per em space
		str = str.replace(/\u2005/g, '&#x2005;') // 4 per em space
		str = str.replace(/\u2006/g, '&#x2006;') // 6 per em space
		str = str.replace(/\u2007/g, '&#x2007;') // figure space
		str = str.replace(/\u2008/g, '&#x2008;') // punctuation space
		str = str.replace(/\u2009/g, '&#x2009;') // thin space
		str = str.replace(/\u200A/g, '&#x200A;') // hair space
		str = str.replace(/\u200B/g, '&#x200B;') // zwsp
		str = str.replace(/\u205F/g, '&#x205F;') // mmsp
		str = str.replace(/\u00A0/g, '&#x00A0;') // nbsp
		str = str.replace(/\u3000/g, '&#x3000;') // ideographic sp
		str = str.replace(/\u202F/g, '&#x202F;') // nnbsp

		str = str.replace(/\u180B/g, '&#x180B;') // mfvs1
		str = str.replace(/\u180C/g, '&#x180C;') // mfvs2
		str = str.replace(/\u180D/g, '&#x180D;') // mfvs3

		str = str.replace(/\u200C/g, '&#x200C;') // zwnj
		str = str.replace(/\u200D/g, '&#x200D;') // zwj
		str = str.replace(/\u2028/g, '&#x2028;') // line sep
		str = str.replace(/\u00AD/g, '&#x00AD;') // shy
		str = str.replace(/\u2060/g, '&#x2060;') // wjoiner

        str = str.replace(/\u0000/g, '&#x0000;') // null
        str = str.replace(/\u206A/g, '&#x206A;') // iss
		str = str.replace(/\u206B/g, '&#x206B;') // ass
		str = str.replace(/\u206C/g, '&#x206C;') // iafs
		str = str.replace(/\u206D/g, '&#x206D;') // aafs
		str = str.replace(/\u206E/g, '&#x206E;') // nads
		str = str.replace(/\u206F/g, '&#x206F;') // nods
		}

	// convert lre/rle/pdf/rli/lri/fsi/pdi to markup
	if (parameters.match(/bidimarkup/)) {
		str = str.replace(/\u2066|&#x2066;/g, '&lt;span dir=&quot;ltr&quot;&gt;') // lri
		str = str.replace(/\u2067|&#x2067;/g, '&lt;span dir=&quot;rtl&quot;&gt;') // rli
		str = str.replace(/\u2068|&#x2068;/g, '&lt;span dir=&quot;auto&quot;&gt;') // fsi
		str = str.replace(/\u2069|&#x2069;/g, '&lt;/span&gt;') // pdi
		
		str = str.replace(/\u202A|&#x202A;/g, '&lt;span dir=&quot;ltr&quot;&gt;') // lre
		str = str.replace(/\u202B|&#x202B;/g, '&lt;span dir=&quot;rtl&quot;&gt;') // rle
		str = str.replace(/\u202C|&#x202C;/g, '&lt;/span&gt;') // pdf
        
		//str = str.replace(/\u202D/g, '&lt;bdo dir=&quot;ltr&quot;&gt;')
		//str = str.replace(/\u202E/g, '&lt;bdo dir=&quot;rtl&quot;&gt;')
		}

	return str;
	}


function convertCharStr2SelectiveCPs ( str, parameters, pad, before, after, base ) { 
	// converts a string of characters to code points or code point based escapes
	// str: string, the string to convert
	// parameters: string enum [ascii, latin1], a set of characters to not convert
	// pad: boolean, if true, hex numbers lower than 1000 are padded with zeros
	// before: string, any characters to include before a code point (eg. &#x for NCRs)
	// after: string, any characters to include after (eg. ; for NCRs)
	// base: string enum [hex, dec], hex or decimal output
	var haut = 0; 
	var n = 0; var cp;
	var CPstring = '';
	for (var i = 0; i < str.length; i++) {
		var b = str.charCodeAt(i); 
		if (b < 0 || b > 0xFFFF) {
			CPstring += 'Error in convertCharStr2SelectiveCPs: byte out of range ' + dec2hex(b) + '!';
			}
		if (haut != 0) {
			if (0xDC00 <= b && b <= 0xDFFF) {
				if (base == 'hex') {
					CPstring += before + dec2hex(0x10000 + ((haut - 0xD800) << 10) + (b - 0xDC00)) + after;
					}
				else { cp = 0x10000 + ((haut - 0xD800) << 10) + (b - 0xDC00);
					CPstring += before + cp + after; 
					}
				haut = 0;
				continue;
				}
			else {
				CPstring += 'Error in convertCharStr2SelectiveCPs: surrogate out of range ' + dec2hex(haut) + '!';
				haut = 0;
				}
			}
		if (0xD800 <= b && b <= 0xDBFF) {
			haut = b;
			}
		else {
			if (parameters.match(/ascii/) && b <= 127) { //  && b != 0x3E && b != 0x3C &&  b != 0x26) {
				CPstring += str.charAt(i);
				}
			else if (b <= 255 && parameters.match(/latin1/)) { // && b != 0x3E && b != 0x3C &&  b != 0x26) {
				CPstring += str.charAt(i);
				}
			else { 
				if (base == 'hex') {
					cp = dec2hex(b); 
					if (pad) { while (cp.length < 4) { cp = '0'+cp; } }
					}
				else { cp = b; }
				CPstring += before + cp + after; 
				}
			}
		}
	return CPstring;
	}
	
function convertCharStr2Unicode ( textString, preserve, pad ) { 
	// converts a string of characters to U+... notation, separated by space
	// textString: string, the string to convert
	// preserve: string enum [ascii, latin1], a set of characters to not convert
	// pad: boolean, if true, hex numbers lower than 1000 are padded with zeros
	var haut = 0;
	var n = 0;
	var CPstring = ''; pad=false;
	for (var i = 0; i < textString.length; i++) {
		var b = textString.charCodeAt(i); 
		if (b < 0 || b > 0xFFFF) {
			CPstring += 'Error in convertChar2CP: byte out of range ' + dec2hex(b) + '!';
			}
		if (haut != 0) {
			if (0xDC00 <= b && b <= 0xDFFF) {
				CPstring += dec2hex(0x10000 + ((haut - 0xD800) << 10) + (b - 0xDC00)) + ' ';
				haut = 0;
				continue;
				}
			else {
				CPstring += 'Error in convertChar2CP: surrogate out of range ' + dec2hex(haut) + '!';
				haut = 0;
				}
			}
		if (0xD800 <= b && b <= 0xDBFF) {
			haut = b;
			}
		else {
			if (b <= 127 && preserve == 'ascii') {
				CPstring += textString.charAt(i)+' ';
				}
			else if (b <= 255 && preserve == 'latin1') {
				CPstring += textString.charAt(i)+' ';
				}
			else { 
				cp = dec2hex(b); 
				if (pad) { while (cp.length < 4) { cp = '0'+cp; } }
				CPstring += 'U+' + cp + ' '; 
				}
			}
		}
	return CPstring.substring(0, CPstring.length-1);
	}


function convertCharStr2HexNCR ( textString ) {
  var outputString = "";
  textString = textString.replace(/^\s+/, '');
  if (textString.length == 0) { return ""; }
  textString = textString.replace(/\s+/g, ' ');
  var listArray = textString.split(' ');
  for ( var i = 0; i < listArray.length; i++ ) {
    var n = parseInt(listArray[i], 16);
    outputString += '&#x' + dec2hex(n) + ';';
  }
  return( outputString );
}




function convertCharStr2pEsc ( str ) {
	// str: sequence of Unicode characters
	var outputString = "";
	var CPstring = convertChar2CP(str);
	if (str.length == 0) { return ""; }
	// process each codepoint
	var listArray = CPstring.split(' ');
	for ( var i = 0; i < listArray.length; i++ ) {
		var n = parseInt(listArray[i], 16);
		//if (i > 0) { outputString += ' ';}
		if (n == 0x20) { outputString += '%20'; }
		else if (n >= 0x41 && n <= 0x5A) { outputString += String.fromCharCode(n); } // alpha
		else if (n >= 0x61 && n <= 0x7A) { outputString += String.fromCharCode(n); } // alpha
		else if (n >= 0x30 && n <= 0x39) { outputString += String.fromCharCode(n); } // digits
		else if (n == 0x2D || n == 0x2E || n == 0x5F || n == 0x7E) { outputString += String.fromCharCode(n); } // - . _ ~
		else if (n <= 0x7F) { outputString += '%'+dec2hex2(n); }
		else if (n <= 0x7FF) { outputString += '%'+dec2hex2(0xC0 | ((n>>6) & 0x1F)) + '%' + dec2hex2(0x80 | (n & 0x3F)); } 
		else if (n <= 0xFFFF) { outputString += '%'+dec2hex2(0xE0 | ((n>>12) & 0x0F)) + '%' + dec2hex2(0x80 | ((n>>6) & 0x3F)) + '%' + dec2hex2(0x80 | (n & 0x3F)); } 
		else if (n <= 0x10FFFF) {outputString += '%'+dec2hex2(0xF0 | ((n>>18) & 0x07)) + '%' + dec2hex2(0x80 | ((n>>12) & 0x3F)) + '%' + dec2hex2(0x80 | ((n>>6) & 0x3F)) + '%' + dec2hex2(0x80 | (n & 0x3F)); } 
		else { outputString += '!Error ' + dec2hex(n) +'!'; }
		}
	return( outputString );
	}



function convertCharStr2UTF8 ( str ) { 
	// Converts a string of characters to UTF-8 byte codes, separated by spaces
	// str: sequence of Unicode characters
	var highsurrogate = 0;
	var suppCP; // decimal code point value for a supp char
	var n = 0;
	var outputString = '';
	for (var i = 0; i < str.length; i++) {
		var cc = str.charCodeAt(i); 
		if (cc < 0 || cc > 0xFFFF) {
			outputString += '!Error in convertCharStr2UTF8: unexpected charCodeAt result, cc=' + cc + '!';
			}
		if (highsurrogate != 0) {  
			if (0xDC00 <= cc && cc <= 0xDFFF) {
				suppCP = 0x10000 + ((highsurrogate - 0xD800) << 10) + (cc - 0xDC00); 
				outputString += ' '+dec2hex2(0xF0 | ((suppCP>>18) & 0x07)) + ' ' + dec2hex2(0x80 | ((suppCP>>12) & 0x3F)) + ' ' + dec2hex2(0x80 | ((suppCP>>6) & 0x3F)) + ' ' + dec2hex2(0x80 | (suppCP & 0x3F));
				highsurrogate = 0;
				continue;
				}
			else {
				outputString += 'Error in convertCharStr2UTF8: low surrogate expected, cc=' + cc + '!';
				highsurrogate = 0;
				}
			}
		if (0xD800 <= cc && cc <= 0xDBFF) { // high surrogate
			highsurrogate = cc;
			}
		else {
			if (cc <= 0x7F) { outputString += ' '+dec2hex2(cc); }
			else if (cc <= 0x7FF) { outputString += ' '+dec2hex2(0xC0 | ((cc>>6) & 0x1F)) + ' ' + dec2hex2(0x80 | (cc & 0x3F)); } 
			else if (cc <= 0xFFFF) { outputString += ' '+dec2hex2(0xE0 | ((cc>>12) & 0x0F)) + ' ' + dec2hex2(0x80 | ((cc>>6) & 0x3F)) + ' ' + dec2hex2(0x80 | (cc & 0x3F)); } 
			}
		}
	return outputString.substring(1);
	}



function convertCharStr2UTF16 ( str ) { 
	// Converts a string of characters to UTF-16 code units, separated by spaces
	// str: sequence of Unicode characters
	var highsurrogate = 0;
	var suppCP;
	var n = 0;
	var outputString = '';
	for (var i = 0; i < str.length; i++) {
		var cc = str.charCodeAt(i); 
		if (cc < 0 || cc > 0xFFFF) {
			outputString += '!Error in convertCharStr2UTF16: unexpected charCodeAt result, cc=' + cc + '!';
			}
		if (highsurrogate != 0) {
			if (0xDC00 <= cc && cc <= 0xDFFF) {
				suppCP = 0x10000 + ((highsurrogate - 0xD800) << 10) + (cc - 0xDC00); 
				suppCP -= 0x10000; outputString += dec2hex4(0xD800 | (suppCP >> 10)) + ' ' + dec2hex4(0xDC00 | (suppCP & 0x3FF)) + ' ';
				highsurrogate = 0;
				continue;
				}
			else {
				outputString += 'Error in convertCharStr2UTF16: low surrogate expected, cc=' + cc + '!';
				highsurrogate = 0;
				}
			}
		if (0xD800 <= cc && cc <= 0xDBFF) { // start of supplementary character
			highsurrogate = cc;
			}
		else {
			result = dec2hex(cc)
			while (result.length < 4) result = '0' + result
			outputString += result + ' '
			}
		}
	return outputString.substring(0, outputString.length-1);
	}


function convertCharStr2jEsc ( str, parameters ) { 
	// Converts a string of characters to JavaScript escapes
	// str: sequence of Unicode characters
	// parameters: a semicolon separated string showing ids for checkboxes that are turned on
	var highsurrogate = 0;
	var suppCP;
	var pad;
	var n = 0;
	var pars = parameters.split(';')
	var outputString = '';
	for (var i = 0; i < str.length; i++) {
		var cc = str.charCodeAt(i); 
		if (cc < 0 || cc > 0xFFFF) {
			outputString += '!Error in convertCharStr2UTF16: unexpected charCodeAt result, cc=' + cc + '!';
			}
		if (highsurrogate != 0) { // this is a supp char, and cc contains the low surrogate
			if (0xDC00 <= cc && cc <= 0xDFFF) {
				suppCP = 0x10000 + ((highsurrogate - 0xD800) << 10) + (cc - 0xDC00); 
				if (parameters.match(/cstyleSC/)) {
					pad = suppCP.toString(16);
					while (pad.length < 8) { pad = '0'+pad; }
					outputString += '\\U'+pad; 
					}
				else if (parameters.match(/es6styleSC/)) {
					pad = suppCP.toString(16).toUpperCase()
					outputString += '\\u{'+pad+'}' 
					}
				else {
					suppCP -= 0x10000; 
					outputString += '\\u'+ dec2hex4(0xD800 | (suppCP >> 10)) +'\\u'+ dec2hex4(0xDC00 | (suppCP & 0x3FF));
					}
				highsurrogate = 0;
				continue;
				}
			else {
				outputString += 'Error in convertCharStr2UTF16: low surrogate expected, cc=' + cc + '!';
				highsurrogate = 0;
				}
			}
		if (0xD800 <= cc && cc <= 0xDBFF) { // start of supplementary character
			highsurrogate = cc;
			}
		else { // this is a BMP character
			//outputString += dec2hex(cc) + ' ';
			switch (cc) {
				case 0: outputString += '\\0'; break;
				case 8: outputString += '\\b'; break;
				case 9: if (parameters.match(/noCR/)) {outputString += '\\t';} else {outputString += '\t'}; break;
				case 10: if (parameters.match(/noCR/)) {outputString += '\\n';} else {outputString += '\n'}; break;
				case 13: if (parameters.match(/noCR/)) {outputString += '\\r';} else {outputString += '\r'}; break;
				case 11: outputString += '\\v'; break;
				case 12: outputString += '\\f'; break;
				case 34: if (parameters.match(/noCR/)) {outputString += '\\\"';} else {outputString += '"'}; break;
				case 39: if (parameters.match(/noCR/)) {outputString += "\\\'";} else {outputString += '\''}; break;
				case 92: outputString += '\\\\'; break;
				default: 
					if (cc > 0x1f && cc < 0x7F) { 
						outputString += String.fromCharCode(cc)
						}
					else if (parameters.match(/es6styleSC/)) {
						pad = cc.toString(16).toUpperCase();
						outputString += '\\u{'+pad+'}'
						}
					else { 
						pad = cc.toString(16).toUpperCase();
						while (pad.length < 4) { pad = '0'+pad; }
						outputString += '\\u'+pad 
						}
				}
			}
		}
	return outputString;
	}


function convertCharStr2Rust ( strIn, parameters ) { 
	// Converts a string of characters to Rust escapes
	// str: sequence of Unicode characters
	// parameters: a semicolon separated string showing ids for checkboxes that are turned on
    var str = ''
    var chars = [...strIn]
	for (let i=0; i<chars.length; i++) {
        cp = chars[i].codePointAt(0)
        hex = cp.toString(16).toUpperCase() 
        switch (cp) {
            case 0: str += '\\0'; break;
            case 8: str += '\\b'; break;
            case 9: if (parameters.match(/noCR/)) {str += '\\t';} else {str += '\t'}; break;
            case 10: if (parameters.match(/noCR/)) {str += '\\n';} else {str += '\n'}; break;
            case 13: if (parameters.match(/noCR/)) {str += '\\r';} else {str += '\r'}; break;
            case 11: str += '\\v'; break;
            case 12: str += '\\f'; break;
            case 34: if (parameters.match(/noCR/)) {str += '\\\"';} else {str += '"'}; break;
            case 39: if (parameters.match(/noCR/)) {str += "\\\'";} else {str += '\''}; break;
            case 92: str += '\\\\'; break;
            default: 
                if (cp > 0x00 && cp < 0x20) { 
                    str += '\\x'+hex
                    }
                else if (cp > 0x7E && cp < 0xA0) { 
                    str += '\\x'+hex 
                    }
                else if (cp > 0x1f && cp < 0x7F) { 
                    str += chars[i]
                    }
                else { 
                    str += '\\u{'+hex+'}'
                    }
                }
          }
	return str.trim()
	}



function convertCharStr2Perl ( strIn, parameters ) { 
	// Converts a string of characters to Rust escapes
	// str: sequence of Unicode characters
	// parameters: a semicolon separated string showing ids for checkboxes that are turned on
    var str = ''
    var chars = [...strIn]
	for (let i=0; i<chars.length; i++) {
        cp = chars[i].codePointAt(0)
        hex = cp.toString(16).toUpperCase() 
        switch (cp) {
            case 0: str += '\\0'; break;
            case 8: str += '\\b'; break;
            case 9: if (parameters.match(/noCR/)) {str += '\\t';} else {str += '\t'}; break;
            case 10: if (parameters.match(/noCR/)) {str += '\\n';} else {str += '\n'}; break;
            case 13: if (parameters.match(/noCR/)) {str += '\\r';} else {str += '\r'}; break;
            case 11: str += '\\v'; break;
            case 12: str += '\\f'; break;
            case 34: if (parameters.match(/noCR/)) {str += '\\\"';} else {str += '"'}; break;
            case 39: if (parameters.match(/noCR/)) {str += "\\\'";} else {str += '\''}; break;
            case 92: str += '\\\\'; break;
            default: 
                if (cp > 0x00 && cp < 0x20) { 
                    str += '\\x'+hex
                    }
                else if (cp > 0x7E && cp < 0xA0) { 
                    str += '\\x'+hex 
                    }
                else if (cp > 0x1f && cp < 0x7F) { 
                    str += chars[i]
                    }
                else { 
                    str += '\\x{'+hex+'}'
                    }
                }
          }
	return str.trim()
	}







function convertCharStr2CSS ( str ) { 
	// Converts a string of characters to CSS escapes
	// str: sequence of Unicode characters
	var highsurrogate = 0;
	var suppCP;
	var pad;
	var outputString = '';
	for (var i = 0; i < str.length; i++) {
		var cc = str.charCodeAt(i); 
		if (cc < 0 || cc > 0xFFFF) {
			outputString += '!Error in convertCharStr2CSS: unexpected charCodeAt result, cc=' + cc + '!';
			}
		if (highsurrogate != 0) { // this is a supp char, and cc contains the low surrogate
			if (0xDC00 <= cc && cc <= 0xDFFF) {
				suppCP = 0x10000 + ((highsurrogate - 0xD800) << 10) + (cc - 0xDC00); 
				pad = suppCP.toString(16).toUpperCase();
				if (suppCP < 0x10000) { while (pad.length < 4) { pad = '0'+pad; } }
				else { while (pad.length < 6) { pad = '0'+pad; } }
				outputString += '\\'+pad+' '; 
				highsurrogate = 0;
				continue;
				}
			else {
				outputString += 'Error in convertCharStr2CSS: low surrogate expected, cc=' + cc + '!';
				highsurrogate = 0;
				}
			}
		if (0xD800 <= cc && cc <= 0xDBFF) { // start of supplementary character
			highsurrogate = cc;
			}
		else { // this is a BMP character
			if (cc == 0x5C) { outputString += '\\\\'; }
			else if (cc > 0x1f && cc < 0x7F) { outputString += String.fromCharCode(cc); }
			else if (cc == 0x9 || cc == 0xA || cc == 0xD) { outputString += String.fromCharCode(cc); }
			else /* if (cc > 0x7E) */ { 
				pad = cc.toString(16).toUpperCase();
				while (pad.length < 4) { pad = '0'+pad; }
				outputString += '\\'+pad+' '; 
				}
			}
		}
	return outputString;
	}



function convertCharStr2CP ( textString, parameters, pad, type, mixed ) {
	// converts a string of characters to code points, separated by space
	// textString: string, the string to convert
	// parameters: string enum [ascii, latin1], a set of characters to not convert
	// pad: boolean, if true, hex numbers lower than 1000 are padded with zeros
	// type: string enum[hex, dec, unicode, 0x], whether output should be in hex or dec or unicode U+ form
    // mixed: boolean, true if Show Latin is selected: causes space separators to be added
	var str = ''
    var number
    var chars = [...textString]

    chars[chars.length] = ' '
	for (let i=0; i<chars.length-1; i++) {
        var cp = chars[i].codePointAt(0)
        
        if (cp <= 127 && parameters.includes('ascii')) str += chars[i]
        else if (cp <= 255 && parameters.includes('latin1')) str += chars[i]
        else {
            switch (type) {
                case 'hex': number = chars[i].codePointAt(0).toString(16).toUpperCase()
                            if (pad>0) while (number.length < pad) number = '0'+number
                            if (!mixed) str += number+' '
                            else { 
                                if (chars[i+1].codePointAt(0) > 127) str += number+' '
                                else str += number
                                }
                            break
                case 'zerox':  number = chars[i].codePointAt(0).toString(16).toUpperCase()
                            if (pad>0) while (number.length < pad) number = '0'+number
                            str += '0x'+number
                            break
                case 'unicode': number = chars[i].codePointAt(0).toString(16).toUpperCase()
                            if (pad>0) while (number.length < pad) number = '0'+number
                            str += 'U+'+number
                            break
                case 'dec': number = cp
                            if (!mixed) str += number+' '
                            else { 
                                if (chars[i+1].codePointAt(0) > 127) str += number+' '
                                else str += number
                                }
                             }
            }
        }
	return str.trim()
	}
	
	
function convertCharStr2CPOLD ( textString, parameters, pad, type ) { 
	// converts a string of characters to code points, separated by space
	// textString: string, the string to convert
	// parameters: string enum [ascii, latin1], a set of characters to not convert
	// pad: boolean, if true, hex numbers lower than 1000 are padded with zeros
	// type: string enum[hex, dec, unicode, 0x], whether output should be in hex or dec or unicode U+ form
	var haut = 0;
	var n = 0;
	var CPstring = '';
	var afterEscape = false;
	for (var i = 0; i < textString.length; i++) {
		var b = textString.charCodeAt(i); 
		if (b < 0 || b > 0xFFFF) {
			CPstring += 'Error in convertChar2CP: byte out of range ' + dec2hex(b) + '!';
			}
		if (haut != 0) {
			if (0xDC00 <= b && b <= 0xDFFF) { 
				if (afterEscape) { CPstring += ' '; }
				if (type == 'hex') { 
					CPstring += dec2hex(0x10000 + ((haut - 0xD800) << 10) + (b - 0xDC00)); 
					}
				else if (type == 'unicode') { 
					CPstring += 'U+'+dec2hex(0x10000 + ((haut - 0xD800) << 10) + (b - 0xDC00)); 
					}
				else if (type == 'zerox') { 
					CPstring += '0x'+dec2hex(0x10000 + ((haut - 0xD800) << 10) + (b - 0xDC00)); 
					}
				else { 
					CPstring += 0x10000 + ((haut - 0xD800) << 10) + (b - 0xDC00); 
					}
				haut = 0;
				continue;
				afterEscape = true;
				}
			else {
				CPstring += 'Error in convertChar2CP: surrogate out of range ' + dec2hex(haut) + '!';
				haut = 0;
				}
			}
		if (0xD800 <= b && b <= 0xDBFF) {
			haut = b;
			}
		else {
			if (b <= 127 && parameters.match(/ascii/)) {
				CPstring += textString.charAt(i);
				afterEscape = false;
				}
			else if (b <= 255 && parameters.match(/latin1/)) {
				CPstring += textString.charAt(i);
				afterEscape = false;
				}
			else { 
				if (afterEscape) { CPstring += ' '; }
				if (type == 'hex') { 
					cp = dec2hex(b); 
					if (pad) { while (cp.length < 4) { cp = '0'+cp; } }
					}
				else if (type == 'unicode') { 
					cp = dec2hex(b); 
					if (pad) { while (cp.length < 4) { cp = '0'+cp; } }
					CPstring += 'U+'; 
					}
				else if (type == 'zerox') { 
					cp = dec2hex(b); 
					if (pad) { while (cp.length < 4) { cp = '0'+cp; } }
					CPstring += '0x'; 
					}
				else { 
					cp = b;
					}
				CPstring += cp; 
				afterEscape = true;
				}
			}
		}
	return CPstring;
	}
	
	
function convertCharStr2Unicode ( textString, preserve, pad ) { 
	// converts a string of characters to U+... notation, separated by space
	// textString: string, the string to convert
	// preserve: string enum [ascii, latin1], a set of characters to not convert
	// pad: boolean, if true, hex numbers lower than 1000 are padded with zeros
	var haut = 0;
	var n = 0;
	var CPstring = ''; pad=false;
	for (var i = 0; i < textString.length; i++) {
		var b = textString.charCodeAt(i); 
		if (b < 0 || b > 0xFFFF) {
			CPstring += 'Error in convertChar2CP: byte out of range ' + dec2hex(b) + '!';
			}
		if (haut != 0) {
			if (0xDC00 <= b && b <= 0xDFFF) {
				CPstring += 'U+' + dec2hex(0x10000 + ((haut - 0xD800) << 10) + (b - 0xDC00)) + ' ';
				haut = 0;
				continue;
				}
			else {
				CPstring += 'Error in convertChar2CP: surrogate out of range ' + dec2hex(haut) + '!';
				haut = 0;
				}
			}
		if (0xD800 <= b && b <= 0xDBFF) {
			haut = b;
			}
		else {
			if (b <= 127 && preserve == 'ascii') {
				CPstring += textString.charAt(i)+' ';
				}
			else if (b <= 255 && preserve == 'latin1') {
				CPstring += textString.charAt(i)+' ';
				}
			else { 
				cp = dec2hex(b); 
				if (pad) { while (cp.length < 4) { cp = '0'+cp; } }
				CPstring += 'U+' + cp + ' '; 
				}
			}
		}
	return CPstring.substring(0, CPstring.length-1);
	}
	
	
