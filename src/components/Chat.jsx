import React, { useState, useEffect, useRef } from "react";
import socket from "./Socket";
import "../App.css";

const Chat = ({ nickName }) => {
	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState([]);

	useEffect(() => {
		socket.emit("connecting", nickName);
	}, [nickName]);

	useEffect(() => {
		socket.on("messages", (message) => {
			setMessages([...messages, message]);
		});

		return () => {
			socket.off();
		};
	}, [messages]);

	const divRef = useRef(null);
	useEffect(() => {
		divRef.current.scrollIntoView({ behavior: "smooth" });
	});

	const submit = (e) => {
		e.preventDefault();
		socket.emit("message", nickName, message);
		setMessage("");
	};

	return (
		<div>
			<div className='chat'>
				{messages.map((e, i) => (
					<div key={i}>
						<div>{e.nickName}</div>
						<div>{e.message}</div>
					</div>
				))}
				<div ref={divRef}></div>
			</div>
			<form onSubmit={submit}>
				<label htmlFor=''>Escriba su mensaje</label>
				<textarea
					name=''
					id=''
					cols='30'
					rows='10'
					value={message}
					onChange={(e) => setMessage(e.target.value)}
				></textarea>
				<button>Enviar</button>
			</form>
		</div>
	);
};

export default Chat;
