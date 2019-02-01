var jwt = require('jsonwebtoken');

const JWT_SIGN_SERCRET = '9hjs8hns08njksn5bnsks7ghs5gj4vbsh3';

module.exports = {
	generateTokenForUser : function(userData){

		return jwt.sign({
			userId: userData.id,
			isAdmin : userData.isAdmin
		},
		JWT_SIGN_SERCRET,
		{
			expiresIn :'1h'
		})
	},

	parseAuthorization : function(authorization){
		return (authorization!= null) ? authorization.replace('Bearer',''): null;
	},
	getUserId : function(authorization){
		var userId = -1;
		var token = module.exports.parseAuthorization(authorization);
		if(authorization!= null){
			try{
				var jwtToken = jwt.verify(authorization,JWT_SIGN_SERCRET);
				if(jwtToken!=null)
					userId= jwtToken.userId;
			}catch(err){ }
		}
		return userId;
	}
}