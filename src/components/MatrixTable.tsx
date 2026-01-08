"use client";

import React, {useMemo} from "react";
import {
	findNearestIds, formatOneDecimal,
	formatPercent,
	getColumnAverages,
	getColumnsP60,
	getRowAverages,
	getRowMax,
	getRowSums
} from "@/utils";
import {useMatrix} from "@/context/MatrixContext";

export default function MatrixTable() {
	const {state, dispatch} = useMatrix();
	const {cells, n, x, hoveredCellId, hoveredRowIndexForSum} = state;

	const rowSums = useMemo(() => getRowSums(cells), [cells]);
	const rowAverages = useMemo(() => getRowAverages(cells), [cells]);

	const columnP60 = useMemo(() => (getColumnsP60(cells, n)), [cells, n]);
	const columnAverages = useMemo(() => (getColumnAverages(cells, n)), [cells, n]);

	const nearestIds = useMemo(() => {
		if (!hoveredCellId) return new Set<number>();
		return findNearestIds(cells, hoveredCellId, x);
	}, [cells, hoveredCellId, x]);


	if (state.m === 0 || state.n === 0) {
		return (
			<section className="rounded-[12px] border border-lightsilver  p-[16px]">
				<div className="text-[14px] leading-[20px]">
					Set M and N &gt; 0
				</div>
			</section>
		);
	}

	return (
		<section className="rounded-[12px] border border-lightsilver  p-[16px]">
			<div className="overflow-auto rounded-[10px] border border-lightsilver">
				<table className="w-full min-w-[860px] border-collapse">
					<thead className="sticky top-0 bg-bgdarkblue backdrop-blur-[8px]">
					<tr className="text-left text-[12px] leading-[16px]">
						{Array.from({length: n}).map((_, colIndex) => (
							<th
								key={colIndex}
								className="border-b border-lightsilver px-[12px] py-[10px] font-medium"
							>
								Col {colIndex + 1}
							</th>
						))}
						<th className="border-b border-lightsilver px-[12px] py-[10px] font-medium w-[120px]">Sum</th>
						<th className="border-b border-lightsilver px-[12px] py-[10px] font-medium w-[120px]">Avg</th>
						<th className="border-b border-lightsilver px-[12px] py-[10px] font-medium w-[120px]">Actions</th>
					</tr>
					</thead>

					<tbody>
					{cells.map((row, rowIndex) => {
						const sumForRow = rowSums[rowIndex];
						const avgForRow = rowAverages[rowIndex];

						const isSumHoveredForThisRow = hoveredRowIndexForSum === rowIndex;

						const maxInRow = isSumHoveredForThisRow ? getRowMax(row) : 0;

						return (
							<tr key={rowIndex} className="text-white">
								{row.map((cell) => {
									const isNearest = nearestIds.has(cell.id);
									const isHoveredCell = hoveredCellId === cell.id;

									const percentOfSum = cell.amount / sumForRow * 100;
									const heatRatio = cell.amount / maxInRow;

									return (
										<td
											key={cell.id}
											className={[
												"relative h-[44px] min-w-[90px] cursor-pointer border-b border-lightsilver",
												isNearest ? "bg-bghoverblue" : "",
												isHoveredCell ? "outline-[1px] outline-white -outline-offset-1" : "",
											].join(" ")}
											onClick={() => dispatch({type: "INCREMENT_CELL", payload: {id: cell.id}})}
											onMouseEnter={() => dispatch({type: "HOVER_CELL", payload: {id: cell.id}})}
											onMouseLeave={() => dispatch({type: "HOVER_CELL", payload: {id: null}})}
										>
											{isSumHoveredForThisRow ? (
												<>
													<div
														className="absolute left-0 top-0 bottom-0 bg-bghoverblue"
														style={{width: `${Math.round(heatRatio * 100)}%`}}
													/>
													<span className="relative z-10 inline-block px-[12px] py-[12px] text-[14px] leading-[20px]">
                              {formatPercent(percentOfSum)}
                            </span>
												</>
											) : (
												<span className="inline-block px-[12px] py-[12px] text-[14px] leading-[20px]">
                            {cell.amount}
                          </span>
											)}
										</td>
									);
								})}

								<td
									className="border-b border-lightsilver bg-bgdakrwhite px-[12px] py-[10px] text-[14px] leading-[20px]"
									onMouseEnter={() => dispatch({type: "HOVER_ROW_SUM", payload: {rowIndex}})}
									onMouseLeave={() => dispatch({type: "HOVER_ROW_SUM", payload: {rowIndex: null}})}
								>
									{sumForRow}
								</td>

								<td
									className="border-b border-lightsilver bg-bgdakrwhite px-[12px] py-[10px] text-[14px] leading-[20px]">
									{formatOneDecimal(avgForRow)}
								</td>

								<td className="border-b border-lightsilver bg-bgdakrwhite px-[8px] py-[8px]">
									<button
										className="h-[32px] w-full rounded-[8px] border border-red-400/30 bg-red-500/10 text-[12px] leading-[16px] text-white hover:border-red-400/60"
										onClick={() => dispatch({type: "REMOVE_ROW", payload: {rowIndex}})}
									>
										Remove
									</button>
								</td>
							</tr>
						);
					})}
					</tbody>

					<tfoot>
					<tr className="text-[12px] leading-[16px]">
						{columnP60.map((value, colIndex) => (
							<td key={colIndex} className="border-b border-lightsilver bg-bgdakrwhite px-[12px] py-[10px]">
								{formatOneDecimal(value)}
							</td>
						))}
						<td className="border-b border-lightsilver bg-bgdakrwhite px-[12px] py-[10px]" colSpan={3}>
							60th percentile
						</td>
					</tr>

					<tr className="text-[12px] leading-[16px]">
						{columnAverages.map((value, colIndex) => (
							<td key={colIndex} className="border-b border-lightsilver bg-bgdakrwhite px-[12px] py-[10px]">
								{formatOneDecimal(value)}
							</td>
						))}
						<td className="border-b border-lightsilver bg-bgdakrwhite px-[12px] py-[10px]" colSpan={3}>
							Average
						</td>
					</tr>
					</tfoot>
				</table>
			</div>

			<div className="mt-[12px] flex justify-end">
				<button
					className="h-[36px] rounded-[8px] border border-lightsilver bg-bgdakrwhite px-[12px] text-[13px] leading-[18px] text-white hover:border-lightsilver2 disabled:opacity-50"
					onClick={() => dispatch({type: "ADD_ROW"})}
					disabled={state.m >= 100 || state.n === 0}
				>
					Add row
				</button>
			</div>
		</section>
	);
}
