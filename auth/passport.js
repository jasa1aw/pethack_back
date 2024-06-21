const passport = require("passport");
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const User = require("./User");

const jwtOptions = {
	jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
	secretOrKey: "nbZiLp5DVj", // Замените на свой секретный ключ
};

passport.use(
	new JWTStrategy(jwtOptions, async (jwtPayload, done) => {
		// Здесь вы можете выполнить проверку пользователя в базе данных или в другом источнике данных
		// и вызвать функцию done с аргументом, указывающим успешность аутентификации
		// done(null, user) - успешная аутентификация
		// done(null, false) - неуспешная аутентификация
		const user = await User.findByPk(jwtPayload.id);

		if (user) done(null, user);
		else done(null, false);
	}),
);

module.exports = {jwtOptions};