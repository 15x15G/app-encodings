const { convertAllEscapes } = require("./conversionfunctions")
const { indexes } = require('./indexes')
const conversion = require('./conversion')

const encodelist = [
    { "name": "utf8", "encode": function(x) { return conversion.utf8Encoder(x) }, "decode": function(x) { return conversion.utf8Decoder(x) }, },
    { "name": "big5", "encode": function(x) { return conversion.big5Encoder(x) }, "decode": function(x) { return conversion.big5Decoder(x) }, },
    { "name": "euc-jp", "encode": function(x) { return conversion.eucjpEncoder(x) }, "decode": function(x) { return conversion.eucjpDecoder(x) }, },
    { "name": "iso-2022-jp ", "encode": function(x) { return conversion.iso2022jpEncoder(x) }, "decode": function(x) { return conversion.iso2022jpDecoder(x) }, },
    { "name": "shift_jis", "encode": function(x) { return conversion.sjisEncoder(x) }, "decode": function(x) { return conversion.sjisDecoder(x) }, },
    { "name": "euc-kr", "encode": function(x) { return conversion.euckrEncoder(x) }, "decode": function(x) { return conversion.euckrDecoder(x) }, },
    { "name": "gb18030", "encode": function(x) { return conversion.gbEncoder(x, false) }, "decode": function(x) { return conversion.gbDecoder(x, false) }, },
    { "name": "gbk", "encode": function(x) { return conversion.gbEncoder(x, true) }, "decode": function(x) { return conversion.gbDecoder(x, true) }, },
    { "name": "koi8-r", "encode": function(x) { return conversion.sbEncoder(x, indexes.koi8r) }, "decode": function(x) { return conversion.sbDecoder(x, indexes.koi8r) }, },
    { "name": "koi8-u", "encode": function(x) { return conversion.sbEncoder(x, indexes.koi8u) }, "decode": function(x) { return conversion.sbDecoder(x, indexes.koi8u) }, },
    { "name": "windows-1250", "encode": function(x) { return conversion.sbEncoder(x, indexes.windows1250) }, "decode": function(x) { return conversion.sbDecoder(x, indexes.windows1250) }, },
    { "name": "windows-1251", "encode": function(x) { return conversion.sbEncoder(x, indexes.windows1251) }, "decode": function(x) { return conversion.sbDecoder(x, indexes.windows1251) }, },
    { "name": "windows-1252/latin1", "encode": function(x) { return conversion.sbEncoder(x, indexes.windows1252) }, "decode": function(x) { return conversion.sbDecoder(x, indexes.windows1252) }, },
    { "name": "windows-1253", "encode": function(x) { return conversion.sbEncoder(x, indexes.windows1253) }, "decode": function(x) { return conversion.sbDecoder(x, indexes.windows1253) }, },
    { "name": "windows-1254", "encode": function(x) { return conversion.sbEncoder(x, indexes.windows1254) }, "decode": function(x) { return conversion.sbDecoder(x, indexes.windows1254) }, },
    { "name": "windows-1255", "encode": function(x) { return conversion.sbEncoder(x, indexes.windows1255) }, "decode": function(x) { return conversion.sbDecoder(x, indexes.windows1255) }, },
    { "name": "windows-1256", "encode": function(x) { return conversion.sbEncoder(x, indexes.windows1256) }, "decode": function(x) { return conversion.sbDecoder(x, indexes.windows1256) }, },
    { "name": "windows-1257", "encode": function(x) { return conversion.sbEncoder(x, indexes.windows1257) }, "decode": function(x) { return conversion.sbDecoder(x, indexes.windows1257) }, },
    { "name": "windows-1258", "encode": function(x) { return conversion.sbEncoder(x, indexes.windows1258) }, "decode": function(x) { return conversion.sbDecoder(x, indexes.windows1258) }, },
    { "name": "windows-874", "encode": function(x) { return conversion.sbEncoder(x, indexes.windows874) }, "decode": function(x) { return conversion.sbDecoder(x, indexes.windows874) }, },
    { "name": "macintosh ", "encode": function(x) { return conversion.sbEncoder(x, indexes.macintosh) }, "decode": function(x) { return conversion.sbDecoder(x, indexes.macintosh) }, },
    { "name": "ibm866", "encode": function(x) { return conversion.sbEncoder(x, indexes.ibm866) }, "decode": function(x) { return conversion.sbDecoder(x, indexes.ibm866) }, },
    { "name": "x-mac-cyrillic", "encode": function(x) { return conversion.sbEncoder(x, indexes.xmaccyrillic) }, "decode": function(x) { return conversion.sbDecoder(x, indexes.xmaccyrillic) }, },
    { "name": "iso-8859-2", "encode": function(x) { return conversion.sbEncoder(x, indexes.iso88592) }, "decode": function(x) { return conversion.sbDecoder(x, indexes.iso88592) }, },
    { "name": "iso-8859-3", "encode": function(x) { return conversion.sbEncoder(x, indexes.iso88593) }, "decode": function(x) { return conversion.sbDecoder(x, indexes.iso88593) }, },
    { "name": "iso-8859-4", "encode": function(x) { return conversion.sbEncoder(x, indexes.iso88594) }, "decode": function(x) { return conversion.sbDecoder(x, indexes.iso88594) }, },
    { "name": "iso-8859-5", "encode": function(x) { return conversion.sbEncoder(x, indexes.iso88595) }, "decode": function(x) { return conversion.sbDecoder(x, indexes.iso88595) }, },
    { "name": "iso-8859-6", "encode": function(x) { return conversion.sbEncoder(x, indexes.iso88596) }, "decode": function(x) { return conversion.sbDecoder(x, indexes.iso88596) }, },
    { "name": "iso-8859-7", "encode": function(x) { return conversion.sbEncoder(x, indexes.iso88597) }, "decode": function(x) { return conversion.sbDecoder(x, indexes.iso88597) }, },
    { "name": "iso-8859-8", "encode": function(x) { return conversion.sbEncoder(x, indexes.iso88598) }, "decode": function(x) { return conversion.sbDecoder(x, indexes.iso88598) }, },
    { "name": "iso-8859-8-i", "encode": function(x) { return conversion.sbEncoder(x, indexes.iso88598) }, "decode": function(x) { return conversion.sbDecoder(x, indexes.iso88598) }, },
    { "name": "iso-8859-10", "encode": function(x) { return conversion.sbEncoder(x, indexes.iso885910) }, "decode": function(x) { return conversion.sbDecoder(x, indexes.iso885910) }, },
    { "name": "iso-8859-13", "encode": function(x) { return conversion.sbEncoder(x, indexes.iso885913) }, "decode": function(x) { return conversion.sbDecoder(x, indexes.iso885913) }, },
    { "name": "iso-8859-14", "encode": function(x) { return conversion.sbEncoder(x, indexes.iso885914) }, "decode": function(x) { return conversion.sbDecoder(x, indexes.iso885914) }, },
    { "name": "iso-8859-15", "encode": function(x) { return conversion.sbEncoder(x, indexes.iso885915) }, "decode": function(x) { return conversion.sbDecoder(x, indexes.iso885915) }, },
    { "name": "iso-8859-16", "encode": function(x) { return conversion.sbEncoder(x, indexes.iso885916) }, "decode": function(x) { return conversion.sbDecoder(x, indexes.iso885916) }, },
]

function output(str = "娴嬭瘯", testlist = ['utf8', 'big5', 'gbk', 'windows-1252/latin1'])
{
    var a = convertAllEscapes(str)
    var list = encode(a, testlist)
    list.forEach(element =>
    {
        if (element.valuable == true)
        {
            var list2 = decode(element.encode, testlist)
            list2.forEach(item =>
            {
                if (item.valuable == true && element.name != item.name)
                {
                    console.log(`${element.name} -> ${item.name} : ${item.decode}`)
                }
            })
        }
    });
}

function encode(stream, name)
{
    let newlist = []
    for (let n = 0; n < name.length; n++)
    {
        for (let t = 0; t < encodelist.length; t++)
        {
            if (name[n] == encodelist[t].name)
            {
                const encode = encodelist[t].encode(stream)
                newlist.push(
                {
                    "name": name[n],
                    "encode": encode,
                    "valuable": (encode != '' && !encode.match('&')) ? true : false,
                })
            }
        }
    }
    //console.log(JSON.stringify(list, null, 4))
    return newlist
}

function decode(stream, name)
{
    let newlist = []
    for (let n = 0; n < name.length; n++)
    {
        for (let t = 0; t < encodelist.length; t++)
        {
            if (name[n] == encodelist[t].name)
            {
                const decode = encodelist[t].decode(stream)
                newlist.push(
                {
                    "name": name[n],
                    "decode": decode,
                    "valuable": (decode != '' && !decode.match('�')) ? true : false,
                })
            }
        }
    }
    //console.log(JSON.stringify(list, null, 4))
    return newlist
}

export default output
