// const jwt = require("jsonwebtoken");
// const secretKey = "nbZiLp5DVj";

// const authenticate = (req, res, next) => {
// 	const accessToken = req.headers["authorization"];
// 	const refreshToken = req.cookies["refreshToken"];

// 	if (!accessToken && !refreshToken) {
// 		return res.status(401).send("Access Denied. No token provided.");
// 	}
// 	try {
// 		const decoded = jwt.verify(accessToken, secretKey);
// 		req.user = decoded.user;
// 		next();
// 	} catch (error) {
// 		if (!refreshToken) {
// 			return res
// 				.status(401)
// 				.send("Access Denied. No refresh token provided.");
// 		}
// 		try {
// 			const decoded = jwt.verify(refreshToken, secretKey);
// 			const accessToken = jwt.sign({ user: decoded.user }, secretKey, {expiresIn: "1h",});
// 			res.cookie("refreshToken", refreshToken, {
// 				httpOnly: true,
// 				sameSite: "strict",
// 			}).header("Authorization", accessToken).send(decoded.user);
// 		} catch (error) {
// 			return res.status(400).send("Invalid Token.");
// 		}
// 	}
// };

const jwt = require("jsonwebtoken");
function verifyToken(req, res, next) {
	const token = req.header("Authorization");
	if (!token) return res.status(401).json({ error: "Access denied" });
	try {
		const decoded = jwt.verify(token, "nbZiLp5DVj");
		req.id = decoded.id;
		next();
	} catch (error) {
		res.status(401).json({ error: "Invalid token" });
	}
}

module.exports = verifyToken;
