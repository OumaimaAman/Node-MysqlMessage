//importations
var models = require('../models');
var asyncLib = require('async');
var jwtUtils = require('../utils/jwt.utils');



module.exports = {

    createMessage : function(req,res){
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);

        var title = req.body.title;
        var content = req.body.content;

        if(title == null || content == null){
            return res.status(400).json({'error' : 'missing parameters'});
        }

        if(title.length <= 2 || content.length <= 4){
            return res.status(400).json({'error': 'invalid parametres '});
        }

        asyncLib.waterfall([
            function(done){
                models.User.findOne({
                    where : {'id': userId}
                }).then(function(userFound){
                    done(null,userFound);
                }).catch(function(err){
                    return res.status(500).json({'error': 'unable to verify user'});
                })
            },
            function(userFound,done){
                if(userFound){
                    models.Message.create({
                        title: title,
                        content: content,
                        likes: 0,
                        UserId: userFound.id
                    }).then(function(newMessage){
                        done(newMessage)
                    });
                }else{
                    return res.status(404).json({'error': 'user not found'});
                }
            }
        ], function(newMessage){

            if(newMessage){
                return res.status(201).json(newMessage);
            }else{
                return res.status(500).json({'error': 'cannot post message'});
            }
        })
    },

    ListMessage : function(req,res){
        var fields  = req.query.fields;
        var limit   = parseInt(req.query.limit);
        var offset  = parseInt(req.query.offset);
        var order   = req.query.order;

        models.Message.findAll({
            order: [(order != null) ? order.split(':') : ['title', 'ASC']],
            attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
            limit: (!isNaN(limit)) ? limit : null,
            offset: (!isNaN(offset)) ? offset : null,
            include: [{
              model: models.User,
              attributes: [ 'useraname' ]
            }]
        }).then(function(messages){
            if(messages){
                return res.status(201).json(messages);
            }else{
                return res.status(404).json({'error': 'no message found'});
            }
        }).catch(function(err){
            return res.status(500).json({'error':'invalid fields!!!'});
        });
    }
}