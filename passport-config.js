const { authenticate } = require('passport')
const bcrypt = require('bcrypt')

const LocalStrategy = require('passport-local').Strategy

async function initialize(passport, getUserByUsername, getUserByID){
    const authenticateUser = async (username, password, done) => {
        const user = getUserByUsername(username)
        if(user == null){
            return done(null, false, {message: 'No User of that Username'})
        }

        try{
            if(await bcrypt.compare(password, user.password)){
                return done(null, user)
            }
            else{
                return done(null, false, {message: 'Password Incorrect'})
            }
        }
        catch(e){
            return done(e)
        }
    }
    passport.use(new LocalStrategy({usernameField: 'username'}, authenticateUser))
    passport.serializeUser((user, done) => done(user.id))
    passport.deserializeUser((id, done) => {
        return done(null, getUserByID(id))
    })
}

module.exports = initialize