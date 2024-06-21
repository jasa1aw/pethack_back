const sendEmail = require("../utils/sendMail");
const AuthCode = require("./AuthCode");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const secretKey = "nbZiLp5DVj";
const User = require("./User");

const signUp = async (req, res) => {
	try {
		if (
			req.body.email.length > 0 &&
			req.body.username.length > 0 &&
			req.body.password.length > 0 &&
			req.body.rePassword.length > 0
		) {
			const findUser = await User.findOne({
				where: { email: req.body.email },
			});
			if (findUser) {
				res.status(401).send({ message: "such a user already exist" });
			} else if (req.body.password !== req.body.rePassword) {
				res.status(400).send({ message: "Passwords do not match" });
			} else {
				bcrypt.genSalt(10, (err, salt) => {
					bcrypt.hash(req.body.password, salt, function (err, hash) {
						const user = User.create({
							email: req.body.email,
							username: req.body.username,
							password: hash,
						});
					});
				});
				const genCode = () => {
					let verifyCode = "";
					for (let i = 0; i < 4; i++) {
						const ch = Math.floor(Math.random() * 10);
						verifyCode += ch;
					}
					return verifyCode;
				};
				const verificationCode = genCode();
				AuthCode.create({
					email: req.body.email,
					code: verificationCode,
					valid_till: Date.now() + 120000,
				});
				sendEmail(req.body.email, verificationCode);
				res.status(200).end();
			}
		} else {
			res.status(401).send({ message: "fill in the blanks" });
		}
	} catch (error) {
		res.status(500).send(error);
	}
};

const confirmEmail = async (req, res) => {
	const { email, code } = req.body;
	try {
		const authCode = await AuthCode.findOne({
			where: { email: email, code: code.toString() },
		});

		if (!authCode) {
			res.status(400).send({ error: "code" });
		} else if (new Date(authCode.valid_till).getTime() < Date.now()) {
			res.status(401).send({ error: "code is invalid" });
		} else if (authCode.code !== code) {
			res.status(402).send({ error: "code is invalid" });
		} else {
			await AuthCode.destroy({ where: { email: email } });
			let user = await User.findOne({ where: { email: email } });
			if (!user) {
				user = await User.create({
					email: email,
				});
			}
			const accessToken = jwt.sign(
				{
					id: user.id,
					email: user.email,
					username: user.username,
				},
				secretKey,
				{ expiresIn: 24 * 60 * 60 * 365 },
			);
			const refreshToken = jwt.sign(
				{
					id: user.id,
					email: user.email,
					username: user.username,
				},
				secretKey,
				{ expiresIn: 24 * 60 * 60 * 365 },
			);
			// res.status(200).send(`access_token: ${accessToken}, refreshToken: ${refreshToken}`);
			// res.cookie("refreshToken", refreshToken, {
			// 	httpOnly: true,
			// 	sameSite: "strict",
			// }).header("Authorization", accessToken);
			// res.status(200).send(`access: ${accessToken}, refresh: ${refreshToken}`);
			// res.status(200).json({
			// 	accessToken: accessToken,
			// 	refreshToken: refreshToken
			// });
			// const token = jwt.sign({
			// 		id: user.id,
			// 		email: user.email,
			// 		username: user.username,
			// 	}, secretKey,
			// 	{
			// 	    // продолжительность токена
			// 	    expiresIn: 24 * 60 * 60
			// 	});
			// 	res.status(200).send(`access_token: ${token}`);
		}
	} catch (error) {
		console.error(error);
		res.status(500).send(error);
	}
};
//
const signIn = async (req, res) => {
	try {
		if (
			!req.body.username ||
			req.body.username.length === 0 ||
			!req.body.password ||
			req.body.password.length === 0
		) {
			res.status(401).send({ message: "Bad Credentials" });
		} else {
			const user = await User.findOne({
				where: { username: req.body.username },
			});
			if (!user) {
				return res
					.status(401)
					.send({ message: "User with that email is not exists" });
			}
			console.log(req.body.password, user.password);
			const isMatch = await bcrypt.compare(
				req.body.password,
				user.password,
			);
			if (isMatch) {
				const accessToken = jwt.sign(
					{
						id: user.id,
						email: user.email,
						username: user.username,
					},
					secretKey,
					{ expiresIn: 3000 },
				);
				const refreshToken = jwt.sign(
					{
						id: user.id,
						email: user.email,
						username: user.username,
					},
					secretKey,
					{ expiresIn: "1d" },
				);
				res.status(200).json({
					accessToken: accessToken,
					refreshToken: refreshToken
				});
			} else {
				res.status(401).send({ message: "Password is incorrect" });
			}
		}
	} catch (error) {
		console.error("Error:", error);
		res.status(500).send(error);
	}
};

const reSendVerifyCode = async (req, res) => {
	try {
		const user = await User.findOne({ where: { email: req.body.email } });
		if (!user) {
			res.status(404).send({ message: "User not found" });
		} else {
			const genCode = () => {
				let verifyCode = "";
				for (let i = 0; i < 4; i++) {
					const ch = Math.floor(Math.random() * 10);
					verifyCode += ch;
				}
				return verifyCode;
			};
			const verificationCode = genCode();
			await AuthCode.create({
				email: req.body.email,
				code: verificationCode,
				valid_till: Date.now() + 120000,
			});
			sendEmail(req.body.email, verificationCode);
			res.status(200).end();
		}
	} catch (error) {
		console.error("Error resending verification code:", error);
		res.status(500).send(error);
	}
};

const refreshToken = async (req, res) => {
	try {
		const decoded = jwt.verify(refreshToken, secretKey);
		const accessToken = jwt.sign(
			{
				id: decoded.user.id,
				email: decoded.user.email,
				username: decoded.user.username,
			},
			secretKey,
			{ expiresIn: "1h" },
		);
		// res.header("Authorization", accessToken).send(decoded.user);
		res.status(200).send(
			`access: ${accessToken}, refresh: ${refreshToken}`,
		);
	} catch (error) {
		return res.status(400).send("Invalid refresh token.");
	}
};
// const user = await User.findOne({
//     where: { username: req.body.username },
// });
// if (!user) {
//     return res.status(400).send({ message: "User with that email is not exists" });
// }

// const refreshToken = req.cookies["refreshToken"];
// if (!refreshToken) {
// 	return res.status(401).send("Access Denied. No refresh token provided.");
// }

module.exports = {
	signUp,
	signIn,
	confirmEmail,
	reSendVerifyCode,
	refreshToken,
};
