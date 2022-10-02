import jsonwebtoken from 'jsonwebtoken';

const auth = async (req, res, next) => {
	try {
		const token = await req.headers.authorization.split(' ')[1];
		const decodedToken = await jsonwebtoken.verify(token, 'RANDOM-TOKEN');
		const user = await decodedToken;
		req.user = user;
		next();
	} catch (error) {
		console.log('auth endpoint error');
		res.status(401).json({
			error: new Error('Invalid request!'),
		});
	}
};

export default auth;
