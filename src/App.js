import React, { useState, useEffect } from "react";
import Chat from "./components/Chat";
import socket from "./components/Socket";

import "./App.css";
import {
	Widget,
	addResponseMessage,
	/*addLinkSnippet,
	addUserMessage,*/
	setQuickButtons,
} from "react-chat-widget";

import "react-chat-widget/lib/styles.css";
const buttons = [
	{ label: "first", value: "Hola" },
	{ label: "second", value: "Adios" },
];

function App() {
	const [nickName, setNickName] = useState("");
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [message, setMessage] = useState("");
	//const [messages, setMessages] = useState([]);
	//const [incoming, setIncoming] = useState("");

	useEffect(() => {
		addResponseMessage("Bienvenido to this awesome chat!");
		setQuickButtons(buttons);
	}, []);

	useEffect(() => {
		socket.on("messages", ({ nickName, message }) => {
			console.log(nickName, message);
			socket.emit("message", nickName, message);
			//setMessages([...messages, message]);

			if (message) {
				addResponseMessage(message);
			}
		});

		return () => {
			socket.off();
		};
	}, [message]);

	/* 	useEffect(() => {
		socket.on("messages", (message) => {
			console.log("message incoming", message);
			setIncoming(message.message);
			addResponseMessage(message.message);
			//setMessages([...messages, message]);
		});

		return () => {
			socket.off();
		};
	}, [incoming]); */

	const register = (e) => {
		e.preventDefault();
		if (nickName !== "") {
			setIsLoggedIn(true);
			console.log("loggeado", nickName);
		}
	};

	const addUserMessage = (message) => {
		console.log(message);
	};

	const handleNewUserMessage = (newMessage) => {
		console.log(`New message incoming! ${newMessage}`);
		setMessage(newMessage);
		// Now send the message throught the backend API
		//e.preventDefault();
		socket.emit("message", nickName, newMessage);
	};

	const handleQuickButtonClicked = (data) => {
		setQuickButtons(buttons.filter((button) => button.value !== data));
		socket.emit("message", nickName, data);
	};

	return (
		<div className='App'>
			{!isLoggedIn && (
				<form onSubmit={register}>
					<label htmlFor=''>Introduzca su nombre</label>
					<input
						value={nickName}
						onChange={(e) => setNickName(e.target.value)}
					/>
					<button>Unirme al chat</button>
				</form>
			)}
			{isLoggedIn && <Chat nickName={nickName} />}
			<Widget
				addUserMessage={addUserMessage}
				handleNewUserMessage={handleNewUserMessage}
				handleQuickButtonClicked={handleQuickButtonClicked}
				profileAvatar={"text"}
				title={`Polls ${nickName}`}
				subtitle='Polls Demo'
			/>
		</div>
	);
}

export default App;
