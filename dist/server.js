'use strict';

var _app = require('./app');

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_app2.default.set('port', process.env.PORT || 3000);

var server = _app2.default.listen(_app2.default.get('port'), function () {
  console.log('Server listening on port ' + server.address().port);
});