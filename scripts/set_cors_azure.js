var azure = require('azure-storage');
var service = azure.createBlobService();
var serviceProperties = {
  Cors: {
    CorsRule: [{
      AllowedOrigins: [
        'http://bachbot.com',
        'http://www.bachbot.com',
        'http://bachbot-server.azurewebsites.net',
        'https://bachbot.com',
        'https://www.bachbot.com',
        'https://bachbot-server.azurewebsites.net',
      ],
      AllowedMethods: ['GET'],
      AllowedHeaders: [],
      ExposedHeaders: [],
      MaxAgeInSeconds: 60
    }]
  }
};

service.setServiceProperties(serviceProperties, function(err, res) {
  if (err) {
    console.log(err);
  }
  console.log(res);
});
