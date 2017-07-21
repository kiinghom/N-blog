var express = require('express');
var router = express.Router();
var sha1 = require('sha1');

var UserModel = require('../models/users');
var checkNotLogin = require('../middlewares/check').checkNotLogin;

router.get('/', checkNotLogin, function(req, res, next) {
	res.render('signin');
})

router.post('/', checkNotLogin, function(req, res, next) {
	var name = req.fields.name;
	var password = req.fields.password;

	UserModel.getUserByName(name).then(function (user) {
		if(!user) {
			req.flash('error', 'User have not exist');
			return res.redirect('back');
		}

		if(sha1(password) !== user.password) {
			req.flash('error', 'UserName or password wrong');
			return res.redirect('back');
		}
		req.flash('success', 'Login success');
		delete user.password;
		req.session.user = user;
		res.redirect('/posts');
	}).catch(next);
});

module.exports = router;