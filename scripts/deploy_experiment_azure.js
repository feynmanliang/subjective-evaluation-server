var fs = require('fs-extra');
var path = require('path');
var deploy = require('deploy-azure-cdn');
var glob = require('glob');
var logger = console.log;

var argv = require('minimist')(process.argv.slice(2));
var experimentDir = argv._[0]; // path to a directory holding the MP3s and experiment.json, directory name should === experimentName
var experimentName = path.basename(experimentDir)

// Upload all files to experiment blob
glob(experimentDir + "/*", {}, function(err, files) {
    files = files.map(function(fp) {
        return { path: fp };
    });
    var opts = {
        containerName: 'experiments',
        containerOptions: { publicAccessLevel: "blob" },
        folder: experimentName, // path within container
        deleteExistingBlobs: false, // true means recursively deleting anything under folder
        concurrentUploadThreads: 4, // number of concurrent uploads, choose best for your network condition
        zip: true, // gzip files if they become smaller after zipping, content-encoding header will change if file is zipped
        metadata: { cacheControl: 'public, max-age=31556926' }, // metadata for each uploaded file
        testRun: false // test run - means no blobs will be actually deleted or uploaded, see log messages for details
    };
    deploy(opts, files, logger, function(err, res) {
        if(err) {
            logger("Error deploying", err)
        }
        logger('Job\'s done! Files uploaded to: ');
        logger(files.map(function(f) {
            var fileName = path.basename(f.path);
            return {
                path: f.path,
                url: 'https://bachbot.blob.core.windows.net/experiments/' + experimentName + '/' + fileName
            };
        }));
    });
});

// copy experiment.json to root
glob(experimentDir + "/*.json", {}, function(err, files) {
    files = files.map(function(fp) {
        return { path: fp };
    });
    var opts = {
        containerName: 'experiments',
        containerOptions: { publicAccessLevel: "blob" },
        folder: '', // path within container
        deleteExistingBlobs: false, // true means recursively deleting anything under folder
        concurrentUploadThreads: 4, // number of concurrent uploads, choose best for your network condition
        zip: true, // gzip files if they become smaller after zipping, content-encoding header will change if file is zipped
        metadata: { cacheControl: 'public, max-age=31556926' }, // metadata for each uploaded file
        testRun: false // test run - means no blobs will be actually deleted or uploaded, see log messages for details
    };
    deploy(opts, files, logger, function(err, res){
        if(err) {
            logger("Error deploying", err)
        }
        logger('Job\'s done! Files uploaded to: ');
        logger(files.map(function(f) {
            var fileName = path.basename(f.path);
            return {
                path: f.path,
                url: 'https://bachbot.blob.core.windows.net/experiments/' + fileName
            };
        }));
    });
});
