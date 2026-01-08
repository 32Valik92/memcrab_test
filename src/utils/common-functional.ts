import {Cell, CellId} from "@/types";

export function getSum(values: number[]): number {
	return values.reduce((total, value) => total + value, 0);
}

export function getAvg(values: number[]): number {
	if (values.length === 0) return NaN;
	return getSum(values) / values.length;
}

export function getRowSums(cells: Cell[][]): number[] {
	return cells.map((row) => {
		const rowAmountsArr = row.map((cell) => cell.amount);
		return getSum(rowAmountsArr);
	});
}

export function getRowAverages(cells: Cell[][]): number[] {
	return cells.map((row) => {
		const rowAmountsArr = row.map((cell) => cell.amount);
		return getAvg(rowAmountsArr);
	});
}

export function getColumnValues(cells: Cell[][], colIndex: number): number[] {
	return cells.map(row => row[colIndex].amount);
}

export function getColumnAverages(cells: Cell[][], numberOfColumns: number): number[] {
	const result: number[] = [];
	for (let colIndex = 0; colIndex < numberOfColumns; colIndex++) {
		result.push(getAvg(getColumnValues(cells, colIndex)));
	}
	return result;
}

export function calculatePercentile(values: number[]): number {
	const percentile = 0.6;
	const totalCount = values.length;

	if (totalCount === 0) return NaN;
	if (totalCount === 1) return values[0];

	const sortedValues = [...values].sort((a, b) => a - b);

	const exactIndex = percentile * (totalCount - 1);
	const lowerIndex = Math.floor(exactIndex);
	const interpolationRatio = exactIndex - lowerIndex;

	const lowerValue = sortedValues[lowerIndex];
	const upperValue = sortedValues[lowerIndex + 1];

	return lowerValue + interpolationRatio * (upperValue - lowerValue);
}

export function getColumnsP60(cells: Cell[][], numberOfColumns: number): number[] {
	const result: number[] = [];
	for (let colIndex = 0; colIndex < numberOfColumns; colIndex++) {
		result.push(calculatePercentile(getColumnValues(cells, colIndex)));
	}
	return result;
}

export function findCellById(cells: Cell[][], id: CellId): Cell | null {
	for (const row of cells) {
		for (const cell of row) {
			if (cell.id === id) return cell;
		}
	}
	return null;
}

export function findNearestIds(
	cells: Cell[][],
	hoveredId: CellId,
	count: number
): Set<CellId> {
	const hoveredCell = findCellById(cells, hoveredId);

	if (!hoveredCell || count === 0) {
		return new Set<CellId>();
	}

	const hoveredValue = hoveredCell.amount;

	const candidates: { id: CellId; distance: number; }[] = [];

	for (const row of cells) {
		for (const cell of row) {
			if (cell.id === hoveredId) continue;

			candidates.push({
				id: cell.id,
				distance: Math.abs(cell.amount - hoveredValue),
			});
		}
	}

	candidates.sort((a, b) => {
		if (a.distance !== b.distance) {
			return a.distance - b.distance;
		}
		return a.id - b.id;
	});

	const nearestIds = new Set<CellId>();

	for (let index = 0; index < count; index++) {
		nearestIds.add(candidates[index].id);
	}

	return nearestIds;
}


export function getRowMax(row: Cell[]): number {
	const amounts = row.map(cell => cell.amount);
	return Math.max(...amounts);
}

export function formatPercent(value: number): string {
	return `${value.toFixed(1)}%`;
}

export function formatOneDecimal(value: number): string {
	return value.toFixed(1);
}