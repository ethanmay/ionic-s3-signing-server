S3 Signing Server
-----------------

**A push to the `master` branch of this repository will push to the live Heroku server.**

Node/Express signing server to upload media to an AWS S3 bucket.

First perform an `npm install`.

Next create a .env file and define your constants:

```
AWS_ACCESS_KEY_ID=ASDWOJFIJDSFHAEXAMPLE
AWS_SECRET_ACCESS_KEY=5lkdfauDJUUAHFJSfjsdNKSjafajhsdjfEXAMPLE
S3_BUCKET=s3bucketname
```

Start your server with `npm start`.

Send a `POST` request with the following object to `/sign-s3`:

```
{
	"name": "your-file-name.ext"
}
```

The server will create credentials for your application that will expire in 5 minutes.

Use the response data to inform a `POST` request to your S3 bucket.

``` javascript
// Sample AngularJS Service
// Requires Cordova File Transfer

angular.module('myapp')

.service( 'UploadService', [ '$q', '$http', function( $q, $http ) {
	
	function s3Uploader( imageURI, fileName ) {
	 	var deferred = $q.defer();

		var mime = imageURI.substr( imageURI.length - 3 );

	  var options = new FileUploadOptions();
	  options.fileKey = 'file';
	  options.fileName = fileName;
	  options.mimeType = 'image/' + mime;
	  options.chunkedMode = false;

	  $http.post( 'https://my-host-url.com/sign-s3', { 'name': fileName } ).then( function( res ) {
	  	var data = res.data;
	  	options.params = {
	        "key": fileName,
	        "AWSAccessKeyId": data.key,
	        "acl": "public-read",
	        "policy": data.policy,
	        "signature": data.signature,
	        "Content-Type": options.mimeType
	    };
	  	var ft = new FileTransfer();
	  	ft.upload( imageURI, "https://" + data.bucket + ".s3.amazonaws.com", function() {
	  		var imgUrl = "https://" + data.bucket + ".s3.amazonaws.com", + fileName;
	  		deferred.resolve( imgUrl );
	  	}, function( err ) {
	  		deferred.reject( err );
	  	}, options );
	  });

	  return deferred.promise;
	}

	var service = {
		upload: s3Uploader
	};

	return service;

}]);
```