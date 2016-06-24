var fs = require('fs-extra');
var deploy = require('deploy-azure-cdn');
var glob = require('glob');
var logger = console.log;

var argv = require('minimist')(process.argv.slice(2));
var experimentDir = argv._[0]; // expected to be a subdirectory of where this script is run

glob(experimentDir + "/*.mp3", {}, function(err, files) {
    files = files.map(function(fp) {
        return { path: fp };
    });
    var opts = {
        containerName: 'experiments',
        containerOptions: { publicAccessLevel: "blob" },
        folder: experimentDir, // path within container
        deleteExistingBlobs: true, // true means recursively deleting anything under folder
        concurrentUploadThreads: 4, // number of concurrent uploads, choose best for your network condition
        zip: true, // gzip files if they become smaller after zipping, content-encoding header will change if file is zipped
        metadata: { cacheControl: 'public, max-age=31556926' }, // metadata for each uploaded file
        testRun: true // test run - means no blobs will be actually deleted or uploaded, see log messages for details
    };
    deploy(opts, files, logger, function(err, res){
        if(err) {
            logger("Error deploying", err)
        }
        logger('Job\'s done! Files uploaded to: ');
        logger(files.map(function(f) {
            return {
                path: f.path,
                url: 'https://bachbot.azureedge.net/' + f.path
            };
        }));
    });
});


glob(experimentDir + "/*.json", {}, function(err, files) {
    files = files.map(function(fp) {
        return { path: fp };
    });
    var opts = {
        containerName: 'client',
        containerOptions: { publicAccessLevel: "blob" },
        folder: experimentDir, // path within container
        deleteExistingBlobs: true, // true means recursively deleting anything under folder
        concurrentUploadThreads: 4, // number of concurrent uploads, choose best for your network condition
        zip: true, // gzip files if they become smaller after zipping, content-encoding header will change if file is zipped
        metadata: { cacheControl: 'public, max-age=31556926' }, // metadata for each uploaded file
        testRun: true // test run - means no blobs will be actually deleted or uploaded, see log messages for details
    };
    deploy(opts, files, logger, function(err, res){
        if(err) {
            logger("Error deploying", err)
        }
        logger('Job\'s done! Files uploaded to: ');
        logger(files.map(function(f) {
            return {
                path: f.path,
                url: 'https://bachbot-experiments.azureedge.net/' + f.path
            };
        }));
    });
});
