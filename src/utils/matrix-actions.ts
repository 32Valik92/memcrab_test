import {Cell} from "@/types";

export function random3Digit(): number {
	return Math.floor(100 + Math.random() * 900);
}

export function createMatrix(
	m: number,
	n: number,
	startId: number
): { matrix: Cell[][]; nextId: number } {
	let id = startId;
	const matrix: Cell[][] = [];

	for (let rowIndex = 0; rowIndex < m; rowIndex++) {
		const row: Cell[] = [];

		for (let colIndex = 0; colIndex < n; colIndex++) {
			row.push({ id, amount: random3Digit() });
			id += 1;
		}

		matrix.push(row);
	}

	return { matrix, nextId: id };
}

export function createRow(
	n: number,
	startId: number
): { row: Cell[]; nextId: number } {
	let id = startId;
	const row: Cell[] = [];

	for (let colIndex = 0; colIndex < n; colIndex++) {
		row.push({ id, amount: random3Digit() });
		id += 1;
	}

	return { row, nextId: id };
}
