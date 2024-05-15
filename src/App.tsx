import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";

const chat = `subscription MySubscription {
  chat
}`;

const invokeModel = `mutation MyMutation {
  invokeModel
}`;

Amplify.configure({
	API: {
		GraphQL: {
			endpoint: "your-graphql-endpoint",
			region: "ap-southeast-1",
			defaultAuthMode: "lambda",
		},
	},
});

function App() {
	const [data, setData] = useState("");

	const client = generateClient();

	const handleClick = async () => {
		try {
			console.log("Calling Lambda Function...");

			await client.graphql({ query: chat, authToken: "test" }).subscribe({
				next: ({ data }) => setData((prevData) => prevData + data.chat),
			});

			const response = await client.graphql({
				query: invokeModel,
				authToken: "test",
			});

			console.log(response);
		} catch (error) {
			console.error("Failed to fetch data:", error);
		}
	};

	return (
		<>
			<div>
				<a href="https://vitejs.dev" target="_blank">
					<img src={viteLogo} className="logo" alt="Vite logo" />
				</a>
				<a href="https://react.dev" target="_blank">
					<img src={reactLogo} className="logo react" alt="React logo" />
				</a>
			</div>
			<h1>Vite + React</h1>
			<div className="card">
				<button onClick={handleClick}>Invoke AppSync API</button>
				<p>{data}</p>
			</div>
		</>
	);
}

export default App;
