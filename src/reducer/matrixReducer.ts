import {MatrixAction, MatrixState} from "@/types";
import {createMatrix, createRow} from "@/utils";

export const initialState: MatrixState = {
	m: 0,
	n: 0,
	x: 0,
	cells: [],
	nextId: 1,
	hoveredCellId: null,
	hoveredRowIndexForSum: null,
};

export function matrixReducer(state: MatrixState, action: MatrixAction): MatrixState {
	switch (action.type) {
		case "GENERATE": {
			const { m, n, x } = action.payload;

			const { matrix, nextId } = createMatrix(m, n, 1);

			return {
				...state,
				m,
				n,
				x,
				cells: matrix,
				nextId,
				hoveredCellId: null,
				hoveredRowIndexForSum: null,
			};
		}

		case "SET_X":
			return { ...state, x: action.payload.x };

		case "INCREMENT_CELL": {
			const id = action.payload.id;
			const cells = state.cells.map((row) =>
				row.map((cell) => (cell.id === id ? { ...cell, amount: cell.amount + 1 } : cell))
			);
			return { ...state, cells };
		}

		case "HOVER_CELL":
			return { ...state, hoveredCellId: action.payload.id };

		case "HOVER_ROW_SUM":
			return { ...state, hoveredRowIndexForSum: action.payload.rowIndex };

		case "REMOVE_ROW": {
			const rowIndex = action.payload.rowIndex;
			if (rowIndex < 0 || rowIndex >= state.cells.length) return state;

			const cells = state.cells.filter((_, i) => i !== rowIndex);
			const m = cells.length;

			let hoveredRowIndexForSum = state.hoveredRowIndexForSum;
			if (hoveredRowIndexForSum !== null) {
				if (hoveredRowIndexForSum === rowIndex) hoveredRowIndexForSum = null;
				else if (hoveredRowIndexForSum > rowIndex) hoveredRowIndexForSum -= 1;
			}

			return { ...state, cells, m, hoveredRowIndexForSum };
		}

		case "ADD_ROW": {
			const { row, nextId } = createRow(state.n, state.nextId);
			const cells = [...state.cells, row];
			const m = cells.length;

			return { ...state, cells, nextId, m };
		}

		default:
			return state;
	}
}
