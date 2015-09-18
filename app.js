var XML = require('pixl-xml');
var jsforce = require('jsforce');
var conn = new jsforce.Connection();
var exec = require('child_process').exec;
var fs = require("fs");
var markdownpdf = require("markdown-pdf");
var minfo = 'mediainfo -f --Output=XML ';
var digest;
var chkSum = 'shasum ';

exec(chkSum + process.argv[2], function(err, stdout, stderr) {
    
    if (err) {
        return console.error(err);
    }
    var chkSumDigest = stdout;
    var res = chkSumDigest.split(" ");
    console.log(res[0]);
    digest = res[0];

    exec(minfo + process.argv[2], function(error, stdout, stderr) {
        var doc = XML.parse(stdout);
        console.log(doc.File.track[0].File_name + "." + doc.File.track[0].File_extension);
        console.log(doc.File.track[0].File_last_modification_date);
        console.log(doc.File.track[0].File_extension);
        console.log(doc.File.track[0].Frame_count);
        console.log(doc.File.track[0].Folder_name);
        console.log(doc.File.track[0].Duration[5]);
        console.log(doc.File.track[0].Overall_bit_rate[1]);
        console.log(doc.File.track[1].Codec_ID);
        console.log(doc.File.track[1].Color_space);
        console.log(doc.File.track[1].Chroma_subsampling);
        console.log(doc.File.track[1].Width[0] + "x" + doc.File.track[1].Height[0]);
        console.log(doc.File.track[1].Display_aspect_ratio[1]);
        console.log(doc.File.track[1].Frame_rate[1]);
        console.log(doc.File.track[1].Bit_depth[1]);
        console.log(doc.File.track[1].Compression_mode[0]);
        console.log(doc.File.track[1].Color_space);
        console.log(doc.File.track[2].Channel_s_[1]);
        console.log(doc.File.track[2].Codec[1]);
        console.log(doc.File.track[2].Sampling_rate[1]);
        console.log(doc.File.track[2].Bit_rate[1]);

        conn.login('markh@bavc.org', '12!troutzKuV4fQakhBYLCBmHBzAf89K', function(err, res) {
            if (err) {
                return console.error(err);
            }
                var stream = fs.createWriteStream("my_file.md");
                stream.once('open', function(fd) {
                    stream.write("## Media report for : " + doc.File.track[0].File_name + "." + doc.File.track[0].File_extension + "  \n");
                    stream.write("* Last Modification Date : " + doc.File.track[0].File_last_modification_date + "  \n");
                    stream.write("* Checksum Algorithm : SHA-1  \n");
                    stream.write("* Checksum Digest : " + digest + "  \n");
                    stream.write("* Writing Application : " + doc.File.track[0].Writing_application[1] + "  \n");
                    stream.write("* File Extension : " + doc.File.track[0].File_extension + "  \n");
                    stream.write("* Frame Count : " + doc.File.track[0].Frame_count + "  \n");
                    stream.write("* Location : " + doc.File.track[0].Folder_name + "  \n");
                    stream.write("* Duration : " + doc.File.track[0].Duration[5] + "  \n");
                    stream.write("* Bit Rate : " + doc.File.track[0].Overall_bit_rate[1] + "  \n");
                    stream.write("* Codec ID : " + doc.File.track[1].Codec_ID + "  \n");
                    stream.write("* Color Space : " + doc.File.track[1].Color_space + "  \n");
                    stream.write("* Chroma Subsampling : " + doc.File.track[1].Chroma_subsampling + "  \n");
                    stream.write("* Frame Size : " + doc.File.track[1].Width[0] + "x" + doc.File.track[1].Height[0] + "  \n");
                    stream.write("* Aspect Ratio : " + doc.File.track[1].Display_aspect_ratio[1] + "  \n");
                    stream.write("* Framerate : " + doc.File.track[1].Frame_rate[1] + "  \n");
                    stream.write("* Bit Depth : " + doc.File.track[1].Bit_depth[1] + "  \n");
                    stream.write("* Compression Type : " + doc.File.track[1].Compression_mode[0] + "  \n");
                    stream.write("* Color Space : " + doc.File.track[1].Color_space + "  \n");
                    stream.write("* Audio Channels : " + doc.File.track[2].Channel_s_[1] + "  \n");
                    stream.write("* Audio Codec : " + doc.File.track[2].Codec[1] + "  \n");
                    stream.write("* Audio Sample Rate : " + doc.File.track[2].Sampling_rate[1] + "  \n");
                    stream.write("* Audio Bit Rate : " + doc.File.track[2].Bit_rate[1] + "  \n");
                    stream.end();
                    stream.on('finish', function() {
                        var systream = fs.createReadStream("my_file.md")
                            .pipe(markdownpdf())
                            .pipe(fs.createWriteStream("document.pdf"))
                            systream.on('close', function(){
                            var open = 'open ';
                            exec(open + " document.pdf", function(error, stdout, stderr) {});
                            });
                             
                   


                });
            });
        });
    });
});

function frameRateCalc(val) {
    var rate = math.eval(val);
    return rate;
}

function getFilesizeInBytes(filename) {
    var stats = fs.statSync(filename)
    var fileSizeInBytes = stats["size"]
    var fileSizeInMegabytes = fileSizeInBytes / 1000000.0
    return fileSizeInMegabytes + " MB"
}


