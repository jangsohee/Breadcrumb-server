'use strict';

var crypto = require('crypto'),
    mongoose = require('../../components/mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId,
    ValidatorError = mongoose.Error.ValidatorError,
    CODE = require('../../components/protocol/CODE');

var UserSchema = new Schema({
    role: {
        type: String,
        required: CODE.USER.REQUIRED_ROLE
    },
    nickname: String,
    email: {
        type: String,
        trim: true
    },
    hashedPassword: String,
    salt: String,
    application: {
        type: ObjectId,
        ref: 'Application',
        required: CODE.USER.REQUIRED_APPLICATION
    },
    registered: {
        type: Date,
        required: CODE.USER.REQUIRED_REGISTERED
    },
    deleted: Date
});

/**
 * Virtuals
 */
UserSchema
    .virtual('password')
    .set(function (password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function () {
        return this._password;
    });

// Non-sensitive info we'll be putting in the token
UserSchema
    .virtual('token')
    .get(function () {
        return {
            '_id': this._id,
            'role': this.role,
            'application': this.application
        };
    });

/**
 * Validations
 */

// Validate empty email
UserSchema
    .path('email')
    .validate(function (email) {
        return email && email.length;
    }, CODE.USER.MISSING_EMAIL);

// Validate empty password
UserSchema
    .path('hashedPassword')
    .validate(function (hashedPassword) {
        return hashedPassword && hashedPassword.length;
    }, CODE.USER.MISSING_PASSWORD);

// Validate empty nickname
UserSchema
    .path('nickname')
    .validate(function (nickname) {
        return nickname && nickname.length;
    }, CODE.USER.MISSING_NICKNAME);

// Validate email match with regex
UserSchema
    .path('email')
    .validate(function (email, respond) {
        var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (regex.test(email)) return respond(true);
        else respond(false);
    }, CODE.USER.INVALID_EMAIL);

// Validate password is longer than standard
UserSchema
    .path('hashedPassword')
    .validate(function (hashedPassword, respond) {
        if (this.password.length < 4) return respond(false);
        else respond(true);
    }, CODE.USER.SHORT_PASSWORD);

// Validate email is not taken
UserSchema
    .path('email')
    .validate(function (email, respond) {
        checkEmail(this, email, function (err, pass) {
            if (err) throw err;
            return respond(pass);
        });
    }, CODE.USER.DUPLICATE_EMAIL);

var checkEmail = function (schema, email, callback) {
    schema.constructor
        .findOne({email: email})
        .exec(function (err, user) {
            if (err) return callback(err);
            if (user) {
                if (schema.id.toString() === user.id.toString()) return callback(null, true);
                else return callback(null, false);
            }
            else return callback(null, true);
        });
};

var validatePresenceOf = function (value) {
    return value && value.length;
};

/**
 * Pre-save hook
 */
UserSchema
    .pre('save', function (next) {
        if (!this.isNew) return next();
        if (!validatePresenceOf(this.email) || !validatePresenceOf(this.hashedPassword) || !validatePresenceOf(this.nickname))
            return next(new ValidatorError(CODE.COMMON.MISSING_CREDENTIALS));
        next();
    });

/**
 * Methods
 */
UserSchema.methods = {
    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} plainText
     * @return {Boolean}
     * @api public
     */
    authenticate: function (plainText) {
        return this.encryptPassword(plainText) === this.hashedPassword;
    },

    /**
     * Make salt
     *
     * @return {String}
     * @api public
     */
    makeSalt: function () {
        return crypto.randomBytes(16).toString('base64');
    },

    /**
     * Encrypt password
     *
     * @param {String} password
     * @return {String}
     * @api public
     */
    encryptPassword: function (password) {
        if (!password || !this.salt) return '';

        var cipher = crypto.createCipher('aes-256-cbc', password);
        var salt = new Buffer(this.salt, 'base64');
        var crypted = cipher.update(salt, 'utf8', 'hex');
        crypted += cipher.final('hex');

        return crypted;
    }
};

module.exports = mongoose.model('User', UserSchema);
