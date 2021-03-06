var bcrypt = require ('bcrypt');
var _ = require ('underscore');
var Promise = require('es6-promise').Promise;
module.exports = function (sequelize, DataTypes) {
	var user = sequelize.define ('user',{
		email : {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate : {
				isEmail: true
			}
		},
		salt: {
			type : DataTypes.STRING
		},
		password_hash : {
			type: DataTypes.STRING
		},
		password: {
			type: DataTypes.VIRTUAL,
			allowNull: false,
			validate: {
				len: [7,100]
			},
			set: function(value) {
				var salt = bcrypt.genSaltSync(10);
				var hashed_password = bcrypt.hashSync(value,salt);

				this.setDataValue('password',value);
				this.setDataValue('salt', salt);
				this.setDataValue('password_hash',hashed_password);
			}
		}
	},
	{
		hooks: {
			beforeValidate: function(user,options){
				if (typeof user.email === 'string' ){
					user.email = user.email.toLowerCase();
				}
			}
		},
		classMethods: {
			authenticate: function(body){
				return new Promise(function(resolve, reject){

					if (typeof body.email !== 'string' || typeof body.password !== 'string'){
						res.status(400).send();
					}

					user.findOne({
						where: {
							email: body.email,
						}
					}).then(function(user){
						if(!user || !bcrypt.compareSync(body.password,user.get('password_hash'))) {
							reject();
						}
						resolve(user);
					},function(e){
						reject();
					});
				});
			}
		},
		instanceMethods: {
			toPublicJSON: function(){
				var json = this.toJSON();
				return _.pick(json,'id','email','createdAt','updatedAt');
			}	
		}
	});
	return user;
};