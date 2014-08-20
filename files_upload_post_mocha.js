var should = require('chai').should();
var fs = require('fs');
var request = require('request');

// start mocha test
describe('When performing a slack file upload test,', function() {

  // setup shared test data object
  var testData = {
    url_download: null,
    thumb_64: null,
    thumb_80: null,
    thumb_360: null,
    sizeOriginal: null,
    size64: null,
    size80: null,
    size360: null,
  }

  it('should upload png and verify file object response', function(done) {

    // setup test variables
    var apiURL = 'https://slack.com/api';
    var apiEndpoint = '/files.upload';
    var accessToken = '?token=xoxp-2562897258-2562897260-2562947180-dea22d';
    var fileName = 'APPLE_IPHONE.PNG';
    var urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    var originalRegex = new RegExp(fileName.toLowerCase(), 'g');
    var thumb64Regex = new RegExp(fileName.toLowerCase().replace('.png', '_64.png'), 'g');
    var thumb80Regex = new RegExp(fileName.toLowerCase().replace('.png', '_80.png'), 'g');
    var thumb360Regex = new RegExp(fileName.toLowerCase().replace('.png', '_360.png'), 'g');

    // make POST call to upload sample file
    request.post(apiURL + apiEndpoint + accessToken, function optionalCallback (err, httpResponse, body) {
      if (err) {
        return console.error('upload failed:', err);
      }
      // make assertions on file object
      httpResponse.statusCode.should.equal(200);
      var body = JSON.parse(body);
      body.should.be.an('object');
      body.ok.should.be.true;
      body.file.should.have.property('id').and.to.be.a('string').and.to.not.be.empty;
      body.file.should.have.property('url_download').and.to.be.a('string').and.to.match(urlRegex).and.to.match(originalRegex);
      body.file.should.have.property('thumb_64').and.to.be.a('string').and.to.match(urlRegex).and.to.match(thumb64Regex);
      body.file.should.have.property('thumb_80').and.to.be.a('string').and.to.match(urlRegex).and.to.match(thumb80Regex);
      body.file.should.have.property('thumb_360').and.to.be.a('string').and.to.match(urlRegex).and.to.match(thumb360Regex);

      // save data for future test use
      testData.url_download = body.file.url_download;
      testData.thumb_64 = body.file.thumb_64;
      testData.thumb_80 = body.file.thumb_80;
      testData.thumb_360 = body.file.thumb_360;
      done();
    })
    .form()
    .append('file', fs.createReadStream(fileName));
  });

  // download thumbnails and check their respective lengths are within range
  it('should download original image and verify expected length', function(done) {
    request(testData.url_download, function(error, response, body) {
      body.should.not.be.empty;
      body.should.have.length.within(648017,648021);
      testData.sizeOriginal = body.length;
      done();
    });
  });

  it('should download 64 thumbnail and verify expected length', function(done) {
    request(testData.thumb_64, function(error, response, body) {
      body.should.not.be.empty;
      body.should.have.length.within(9272,9276);
      testData.size64 = body.length;
      done();
    });
  });

  it('should download 80 thumbnail and verify expected length', function(done) {
    request(testData.thumb_80, function(error, response, body) {
      body.should.not.be.empty;
      body.should.have.length.within(13544,13548);
      testData.size80 = body.length;
      done();
    });
  });

  it('should download 360 thumbnail and verify expected length', function(done) {
    request(testData.thumb_360, function(error, response, body) {
      body.should.not.be.empty;
      body.should.have.length.within(123633,123637);
      testData.size360 = body.length;
      done();
    });
  });

  // confirm that the thumbnail file sizes are an expected hierarchy of length
  it('should confirm file sizes correspond to thumbnail size by length', function(done) {
    testData.sizeOriginal.should.be.above(testData.size360).and.be.above(testData.size80).and.be.above(testData.size64);
    testData.size360.should.be.below(testData.sizeOriginal).and.be.above(testData.size80).and.be.above(testData.size64);
    testData.size80.should.be.below(testData.sizeOriginal).and.be.below(testData.size360).and.be.above(testData.size64);
    testData.size64.should.be.below(testData.sizeOriginal).and.be.below(testData.size360).and.be.below(testData.size80);
    done();
  });
});
