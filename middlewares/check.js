module.exports = {
	checkLogin: function checkLogin(req, res, next) {
		if(!req.session.user) {
			req.flash('error', "haven't sign in");
			return res.redirect('/signin');
		}
		next();
	},

	checkNotLogin: function checkNotLogin(req, res, next) {
		if(req.session.user) {
			req.flash('error', 'have sign in');
			return res.redirect('back');
		}
		next();
	}
};