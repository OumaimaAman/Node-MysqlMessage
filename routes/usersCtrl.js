//import
var bcrypt = require('bcrypt');
var jwtUtils = require('../utils/jwt.utils');
var models = require('../models');
var asyncLib = require('async');

//constats
const EMAIL_REGEX     = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX  = /^(?=.*\d).{4,8}$/;

//export
module.exports ={

    register : async function(req,res){
 		var email = req.body.email;
 		var useraname = req.body.username;
 		var password = req.body.password;
 		var bio = req.body.bio;
    
    if(email == null || useraname == null || password == null){
    	return res.status(400).json({'error' : 'missing parameters'});
    }
    if(useraname.length>=13 || useraname.length<=4){
        return res.status(400).json({'error': 'username must be lenght 5-12'});
    }
    if(!EMAIL_REGEX.test(email)){
        return res.status(400).json({'error': 'invalid email'});
    }
    if(!PASSWORD_REGEX.test(password)){
        return res.status(400).json({'error': 'invalid password'});
    }

    let userFond = await models.User.findOne({
    	attributes : ['email'],
    	where : {email : email}
    })

    try {
        const cryFunction = function() {
            return new Promise((success,failure) => {
                bcrypt.hash(password, 5,function(err ,bcryptPassword){
                  if(err) failure(err);
                         success(bcryptPassword);
                });
            });
        };
     
        if(!userFond){
            const bcryptPassword = await cryFunction();
            var newUser = await models.User.create({
                email : email,
                useraname : useraname,
                password : bcryptPassword,
                bio : bio,
                isAdmin :0
            }); 
            return res.status(201).json({'userId': newUser.id});
        }else{
            return res.status(409).json({'error': 'user already exist'});
            }
        }catch(err){
        return res.status(500).json({'error': 'unable to verify user'});
    }

    },
    
	login : function(req,res){

        var email = req.body.email;
        var password = req.body.password;

        if(email == null || password == null){

            return res.status(400).json({'error' : 'missing parameters'});
        }
        models.User.findOne({
            where : {email : email}
         }).then(function(userFound){
            if(userFound){
                bcrypt.compare(password, userFound.password, function(errBcrypt, resBcrypt){
                    if(resBcrypt){
                        return res.status(200).json({
                            'userid':userFound.id,
                            'token' :jwtUtils.generateTokenForUser(userFound)
                      });
                    }else{
                        return res.status(403).json({'error':'invalid password'});
                    }
                });
            }else{
                return res.status(401).json({'error':'user not found'})
            }

         }).catch(function(err){
            return res.status(500).json({'error':'unable to verify user'});
         });

    },
    
    getUserProfil : function(req, res){

        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);

        if(userId < 0){
            return res.status(400).json({'error': ' wrong token '});
        }

        models.User.findOne({
            attributes : ['id','email','useraname','bio'],
            where : {id : userId}
        }).then(function(user){
            if(user){
                return res.status(201).json(user);
            }else{
                return res.status(404).json({'error': 'user not exist'});
            }

        }).catch(function(err){
            return res.status(500).json({'error': 'cannot fetch user'});
        })
    },

    UpdateUserProfil : function(req,res){

        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);
        var bio = req.body.bio;

        asyncLib.waterfall([
            function(done){
                models.User.findOne({
                    attributes: ['id','bio'],
                    where : {id: userId}
                }).then(function(userFond){
                    done(null,userFond); 
                }).catch(function(err){
                    res.status(500).json({'error':'unable to verify user!!'});
                });
            },function(userFond,done){
                if(userFond){
                    userFond.update({
                        bio: (bio ? bio : userFound.bio)
                    }).then(function(userFond){
                        done(userFond);
                    }).catch(function(err){
                        res.status(500).json({'error':'cannot update user'});
                    });
                }else{
                    res.status(404).json({'error': 'user not found '});
                }
            },
        ],function(userFond){
                if(userFond){
                    return res.status(201).json(userFond);
                }else{
                    return res.status(500).json({'error':'cannot update user profil'});
                }
            });
    }
}