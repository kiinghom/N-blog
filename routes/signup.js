var express = require('express');
var router = express.Router();
var path = require('path');
var sha1 = require('sha1');

var UserModel = require('../models/users');
var checkNotLogin = require('../middlewares/check').checkNotLogin;

router.get('/', checkNotLogin, function(req, res, next) {
	res.render('signup');
});

router.post('/', checkNotLogin, function(req, res, next) {
	var name = req.fields.name;
	var gender = req.fields.gender;
	var bio = req.fields.bio;
	var avator = req.files.avator.path.split(path.sep).pop();
	var password = req.fields.password;
	var repassword = req.fields.repassword;
	try {
			if (!(name.length >= 1 && name.length <= 10)) {
				throw new Error('UserName limit 1-10 letters');
			}
			if(['m', 'f', 'x'].indexOf(gender) === -1) {
				throw new Error('Gender need in [m, f, x]');
			}
			if(!(bio.length >= 1 && bio.length <= 30)) {
				throw new Error('Bio limit 1-30 letters');
			}
			if (!req.files.avator.name) {
				throw new Error('No avator');
			}
			if(password.length < 6) {
				throw new Error('Password at least 6 letters');
			}
			if(password !== repassword) {
				throw new Error('Two password are not the same');
			}
		} catch (e) {
			req.flash('error', e.message);
			return res.redirect('/signup');
		}

		password = sha1(password);

		var user = {
			name: name,
			password: password,
			gender: gender,
			bio: bio,
			avator: avator
		};
		UserModel.create(user).then(function (result) {
			user = result.ops[0];
			delete user.password;
			req.session.user = user;
			req.flash('success', 'Register success');
			res.redirect('/posts');
		}).catch(function (e) {
			if (e.message.match('E11000 duplicate key')) {
				req.flash('error', 'UserName have been register');
				return res.redirect('/signup');
			}

			next(e);
		});
});

module.exports = router;
