const { convertAllEscapes } = require("./conversionfunctions")
const { indexes } = require('./indexes')
const conversion = require('./conversion')

var str = "娴嬭瘯"
var a = convertAllEscapes(str)
var list = encode(a)
list.forEach(element =>
{
    if (element.class == true)
    {
        var list2 = decode(element.result)
        list2.forEach(item => {
            if (item.class == true) {
                console.log(`${element.name} -> ${item.name} : ${item.result}`)
            }
        })
    }
});


function encode(stream)
{
    var list = [
        { "name": "utf8", "result": conversion.utf8Encoder(stream), },
        { "name": "big5", "result": conversion.big5Encoder(stream), },
        { "name": "euc-jp", "result": conversion.eucjpEncoder(stream), },
        { "name": "iso-2022-jp ", "result": conversion.iso2022jpEncoder(stream), },
        { "name": "shift_jis", "result": conversion.sjisEncoder(stream), },
        { "name": "euc-kr", "result": conversion.euckrEncoder(stream), },
        { "name": "gb18030", "result": conversion.gbEncoder(stream, false), },
        { "name": "gbk", "result": conversion.gbEncoder(stream, true), },
        { "name": "koi8-r", "result": conversion.sbEncoder(stream, indexes.koi8r), },
        { "name": "koi8-u", "result": conversion.sbEncoder(stream, indexes.koi8u), },
        { "name": "windows-1250", "result": conversion.sbEncoder(stream, indexes.windows1250), },
        { "name": "windows-1251", "result": conversion.sbEncoder(stream, indexes.windows1251), },
        { "name": "windows-1252/latin1", "result": conversion.sbEncoder(stream, indexes.windows1252), },
        { "name": "windows-1253", "result": conversion.sbEncoder(stream, indexes.windows1253), },
        { "name": "windows-1254", "result": conversion.sbEncoder(stream, indexes.windows1254), },
        { "name": "windows-1255", "result": conversion.sbEncoder(stream, indexes.windows1255), },
        { "name": "windows-1256", "result": conversion.sbEncoder(stream, indexes.windows1256), },
        { "name": "windows-1257", "result": conversion.sbEncoder(stream, indexes.windows1257), },
        { "name": "windows-1258", "result": conversion.sbEncoder(stream, indexes.windows1258), },
        { "name": "windows-874", "result": conversion.sbEncoder(stream, indexes.windows874), },
        { "name": "macintosh ", "result": conversion.sbEncoder(stream, indexes.macintosh), },
        { "name": "ibm866", "result": conversion.sbEncoder(stream, indexes.ibm866), },
        { "name": "x-mac-cyrillic", "result": conversion.sbEncoder(stream, indexes.xmaccyrillic), },
        { "name": "iso-8859-2", "result": conversion.sbEncoder(stream, indexes.iso88592), },
        { "name": "iso-8859-3", "result": conversion.sbEncoder(stream, indexes.iso88593), },
        { "name": "iso-8859-4", "result": conversion.sbEncoder(stream, indexes.iso88594), },
        { "name": "iso-8859-5", "result": conversion.sbEncoder(stream, indexes.iso88595), },
        { "name": "iso-8859-6", "result": conversion.sbEncoder(stream, indexes.iso88596), },
        { "name": "iso-8859-7", "result": conversion.sbEncoder(stream, indexes.iso88597), },
        { "name": "iso-8859-8", "result": conversion.sbEncoder(stream, indexes.iso88598), },
        { "name": "iso-8859-8-i", "result": conversion.sbEncoder(stream, indexes.iso88598), },
        { "name": "iso-8859-10", "result": conversion.sbEncoder(stream, indexes.iso885910), },
        { "name": "iso-8859-13", "result": conversion.sbEncoder(stream, indexes.iso885913), },
        { "name": "iso-8859-14", "result": conversion.sbEncoder(stream, indexes.iso885914), },
        { "name": "iso-8859-15", "result": conversion.sbEncoder(stream, indexes.iso885915), },
        { "name": "iso-8859-16", "result": conversion.sbEncoder(stream, indexes.iso885916), },
    ]

    for (var t = 0; t < list.length; t++)
    {
        if (list[t].result.match('&')) list[t].class = false
        else if (list[t].result != '') list[t].class = true
    }
    //console.log(JSON.stringify(list, null, 4))
    return list
}

function decode(stream)
{
    var list =[
    { "name": "utf8", "result": conversion.utf8Decoder(stream) },
    { "name": "big5", "result": conversion.big5Decoder(stream) },
    { "name": "euc-jp", "result": conversion.eucjpDecoder(stream) },
    { "name": "iso-2022-jp", "result": conversion.iso2022jpDecoder(stream) },
    { "name": "shift_jis", "result": conversion.sjisDecoder(stream) },
    { "name": "euc-kr", "result": conversion.euckrDecoder(stream) },
    { "name": "gb18030", "result": conversion.gbDecoder(stream) },
    { "name": "gbk", "result": conversion.gbDecoder(stream) },
    { "name": "koi8-r", "result": conversion.sbDecoder(stream, indexes.koi8r) },
    { "name": "koi8-u", "result": conversion.sbDecoder(stream, indexes.koi8u) },
    { "name": "windows-1250", "result": conversion.sbDecoder(stream, indexes.windows1250) },
    { "name": "windows-1251", "result": conversion.sbDecoder(stream, indexes.windows1251) },
    { "name": "windows-1252/latin1", "result": conversion.sbDecoder(stream, indexes.windows1252) },
    { "name": "windows-1253", "result": conversion.sbDecoder(stream, indexes.windows1253) },
    { "name": "windows-1254", "result": conversion.sbDecoder(stream, indexes.windows1254) },
    { "name": "windows-1255", "result": conversion.sbDecoder(stream, indexes.windows1255) },
    { "name": "windows-1256", "result": conversion.sbDecoder(stream, indexes.windows1256) },
    { "name": "windows-1257", "result": conversion.sbDecoder(stream, indexes.windows1257) },
    { "name": "windows-1258", "result": conversion.sbDecoder(stream, indexes.windows1258) },
    { "name": "windows-874", "result": conversion.sbDecoder(stream, indexes.windows874) },
    { "name": "macintosh", "result": conversion.sbDecoder(stream, indexes.macintosh) },
    { "name": "ibm866", "result": conversion.sbDecoder(stream, indexes.ibm866) },
    { "name": "x-mac-cyrillic", "result": conversion.sbDecoder(stream, indexes.xmaccyrillic) },
    { "name": "iso-8859-2", "result": conversion.sbDecoder(stream, indexes.iso88592) },
    { "name": "iso-8859-3", "result": conversion.sbDecoder(stream, indexes.iso88593) },
    { "name": "iso-8859-4", "result": conversion.sbDecoder(stream, indexes.iso88594) },
    { "name": "iso-8859-5", "result": conversion.sbDecoder(stream, indexes.iso88595) },
    { "name": "iso-8859-6", "result": conversion.sbDecoder(stream, indexes.iso88596) },
    { "name": "iso-8859-7", "result": conversion.sbDecoder(stream, indexes.iso88597) },
    { "name": "iso-8859-8", "result": conversion.sbDecoder(stream, indexes.iso88598) },
    { "name": "iso-8859-8-i", "result": conversion.sbDecoder(stream, indexes.iso88598) },
    { "name": "iso-8859-10", "result": conversion.sbDecoder(stream, indexes.iso885910) },
    { "name": "iso-8859-13", "result": conversion.sbDecoder(stream, indexes.iso885913) },
    { "name": "iso-8859-14", "result": conversion.sbDecoder(stream, indexes.iso885914) },
    { "name": "iso-8859-15", "result": conversion.sbDecoder(stream, indexes.iso885915) },
    { "name": "iso-8859-16", "result": conversion.sbDecoder(stream, indexes.iso885916) },
    ]
    for (var t = 0; t < list.length; t++)
    {
        if (list[t].result.match('�')) list[t].class = false
        else if (list[t].result != '') list[t].class = true
    }
    return list
}
