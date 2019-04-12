var express = require('express');
var app = express();
app.use(express.static('../angular-output'));
app.listen(4200);
