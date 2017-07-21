module.exports = {
	signup_check: function signup_check(name, gender, bio, avator, password, repassword) {
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
				throw new Error('No Avator');
			}
			if(password.length < 6) {
				throw new Error('Password at least 6 letters');
			}
			if(password !== repassword) {
				throw new Error('Two password are not the same');
			}
		} catch (e) {
			return e.message;
		}
		return 'OK';
	},
	signup: function signup(name, gender, bio, avator, password, repassword) {
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
		})
	}
};