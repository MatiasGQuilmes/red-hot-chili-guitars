const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const db = require('../database/models')


module.exports = () => {
    return(
        passport.use(
            new GoogleStrategy({
                clientID: '1028356646034-f3dee33cd1n8251ok4hm46ula5hvos6b.apps.googleusercontent.com',
                clientSecret: 'dfle2bhSlq_q96syt-gtxSoo',
                callbackURL: "http://localhost:3060/users/auth/google/callback"
            },
           
            function(accessToken, refreshToken,profile, done) {
                db.Users.findOrCreate({
                    where: {
                        social_id: profile.id
                    },
                    defaults:{
                        id: profile.id,
                        name: profile.userName,
                        password: null,
                        rol: 0,
                        social_id: profile.id,
                        social_provider: 'google'
                    }
                }) 
               
                .then(user =>{
                    return done(null, user)
                })
                .catch(error=>{
                    console.log(error)
                })
            }
            )
        )
    )
}

