import io from "socket.io-client";

let socket = io("//localhost:5000", {
	allowRequest: (req, callback) => {
		const noOriginHeader = req.headers.origin === undefined;
		callback(null, noOriginHeader);
	},
});

export default socket;
