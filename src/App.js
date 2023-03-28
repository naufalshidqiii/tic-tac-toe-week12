import * as React from "react";
import { configureStore, createSlice } from "@reduxjs/toolkit";
import { Provider, useDispatch, useSelector } from "react-redux";
import { Text, Box, Flex, Grid, Button } from "@chakra-ui/react";

const ticTacToe = createSlice({
	name: "ticTacToe",
	initialState: {
		squares: Array(9).fill(null),
		currentMove: 0,
		winner: null,
		nextValue: "X",
		status: "Next player: X",
	},
	reducers: {
		selectSquare(state, action) {
			if (!state.winner && !state.squares[action.payload]) {
				const newSquares = [...state.squares];
				newSquares[action.payload] = calculateNextValue(state.squares);
				const winner = calculateWinner(newSquares);
				const nextValue = calculateNextValue(newSquares);
				const status = calculateStatus(winner, newSquares, nextValue);

				return {
					squares: newSquares,
					winner,
					nextValue,
					status,
				};
			}
		},
		restart() {
			const newSquares = Array(9).fill(null);
			const winner = calculateWinner(newSquares);
			const nextValue = calculateNextValue(newSquares);
			const status = calculateStatus(winner, newSquares, nextValue);

			return {
				squares: newSquares,
				winner,
				nextValue,
				status,
			};
		},
	},
});

//Redux Actions
export const { selectSquare, restart } = ticTacToe.actions;

//Redux Store
const store = configureStore({
	reducer: ticTacToe.reducer,
});

//React Components
function Board() {
	const { status, squares } = useSelector((state) => state);
	const dispatch = useDispatch();
	function handleSelectSquare(i) {
		dispatch(selectSquare(i));
	}

	function renderSquare(i) {
		return (
			<Button
				margin="2"
				height="100px"
				width="100px"
				variant="outline"
				color="gray.50"
				className="square"
				onClick={() => handleSelectSquare(i)}
			>
				{squares[i]}
			</Button>
		);
	}

	return (
		<Box>
			<Text fontSize="40px">{status}</Text>
			<Box>
				{renderSquare(0)}
				{renderSquare(1)}
				{renderSquare(2)}
			</Box>
			<Box>
				{renderSquare(3)}
				{renderSquare(4)}
				{renderSquare(5)}
			</Box>
			<Box>
				{renderSquare(6)}
				{renderSquare(7)}
				{renderSquare(8)}
			</Box>
		</Box>
	);
}

function Game() {
	const dispatch = useDispatch();
	function handleRestart() {
		dispatch(restart());
	}

	return (
		<Box align="center" bg="gray">
			<Text fontSize="50px" fontWeight="semibold">
				Tic-Tac-Toe
			</Text>
			<Box>
				<Board />
			</Box>
			<Button height="50px" width="100px" mt="10px" onClick={handleRestart}>
				<Text fontSize="20px" fontWeight="semibold">
					Restart
				</Text>
			</Button>
		</Box>
	);
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
	return winner
		? `Winner: ${winner}`
		: squares.every(Boolean)
		? `Scratch: Cat's game`
		: `Next player: ${nextValue}`;
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
	return squares.filter(Boolean).length % 2 === 0 ? "X" : "O";
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return squares[a];
		}
	}
	return null;
}

export default function App() {
	return (
		<Provider store={store}>
			<Game />
		</Provider>
	);
}
