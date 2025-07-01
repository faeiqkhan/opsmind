const { loginUser, registerUser } = require('../../controllers/userController');

// You can adapt these to use a service layer if desired
exports.login = loginUser;
exports.register = registerUser; 