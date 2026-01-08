export type CellId = number;
export type CellValue = number;

export type Cell = {
	id: CellId;
	amount: CellValue;
};

export type MatrixState = {
	m: number;
	n: number;
	x: number;

	cells: Cell[][];

	nextId: number;
	hoveredCellId: CellId | null;

	hoveredRowIndexForSum: number | null;
};

export type GeneratePayload = { m: number; n: number; x: number };

export type MatrixAction =
	| { type: "GENERATE"; payload: GeneratePayload }
	| { type: "SET_X"; payload: { x: number } }
	| { type: "INCREMENT_CELL"; payload: { id: CellId } }
	| { type: "HOVER_CELL"; payload: { id: CellId | null } }
	| { type: "HOVER_ROW_SUM"; payload: { rowIndex: number | null } }
	| { type: "REMOVE_ROW"; payload: { rowIndex: number } }
	| { type: "ADD_ROW" };
