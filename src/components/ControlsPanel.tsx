"use client";

import React, {useMemo} from "react";
import {useForm, useWatch} from "react-hook-form";
import {useMatrix} from "@/context/MatrixContext";

type FormValues = {
	m: number;
	n: number;
	x: number;
};

export default function ControlsPanel() {
	const {state, dispatch} = useMatrix();

	const {
		register,
		handleSubmit,
		control,
		formState: {errors, isValid},
	} = useForm<FormValues>({
		mode: "onChange",
		defaultValues: {
			m: state.m,
			n: state.n,
			x: state.x,
		},
	});

	const formM = useWatch({control, name: "m"});
	const formN = useWatch({control, name: "n"});

	const maxXNearest = useMemo(() => {
		const totalCells =
			state.cells.length > 0
				? state.m * state.n
				: (Number.isFinite(formM) ? formM : 0) * (Number.isFinite(formN) ? formN : 0);

		return Math.max(0, totalCells - 1);
	}, [state.cells.length, state.m, state.n, formM, formN]);

	const onGenerate = (data: FormValues) => {
		dispatch({type: "GENERATE", payload: data});
	};

	const onApplyX = (data: FormValues) => {
		dispatch({type: "SET_X", payload: {x: data.x}});
	};

	return (
		<section className="rounded-[12px] border border-lightsilver  p-[16px]">
			<form className="flex flex-wrap items-start gap-[12px]" onSubmit={handleSubmit(onGenerate)}>
				<label className="flex min-w-[160px] flex-col gap-[6px]">
					<span className="text-[12px] leading-[16px] text-white">M (rows)</span>
					<input
						className="h-[36px] rounded-[8px] border border-lightsilver bg-transparent px-[12px] text-[14px] leading-[20px] text-white outline-none"
						type="number"
						inputMode="numeric"
						{...register("m", {
							valueAsNumber: true,
							required: "M required",
							validate: {
								int: (v) => Number.isInteger(v) || "M must be integer",
								min: (v) => v >= 0 || "M must be more ≥ 0",
								max: (v) => v <= 100 || "M must be less ≤ 100",
							},
						})}
					/>
					{errors.m && (
						<span className="text-[11px] leading-[14px] text-red">{errors.m.message}</span>
					)}
				</label>

				<label className="flex min-w-[160px] flex-col gap-[6px]">
					<span className="text-[12px] leading-[16px] text-white">N (cols)</span>
					<input
						className="h-[36px] rounded-[8px] border border-lightsilver bg-transparent px-[12px] text-[14px] leading-[20px] text-white outline-none"
						type="number"
						inputMode="numeric"
						{...register("n", {
							valueAsNumber: true,
							required: "N required",
							validate: {
								int: (v) => Number.isInteger(v) || "N must be integer",
								min: (v) => v >= 0 || "N must be more ≥ 0",
								max: (v) => v <= 100 || "N must be less ≤ 100",
							},
						})}
					/>
					{errors.n && (
						<span className="text-[11px] leading-[14px] text-red">{errors.n.message}</span>
					)}
				</label>

				<label className="flex min-w-[180px] flex-col gap-[6px]">
					<span className="text-[12px] leading-[16px] text-white">X (nearest)</span>
					<input
						className="h-[36px] rounded-[8px] border border-lightsilver bg-transparent px-[12px] text-[14px] leading-[20px] text-white outline-none"
						type="number"
						inputMode="numeric"
						{...register("x", {
							valueAsNumber: true,
							required: "X required",
							validate: {
								int: (v) => Number.isInteger(v) || "X must be integer",
								min: (v) => v >= 0 || "X must be more ≥ 0",
								max: (v) => v <= maxXNearest || `X must be less ≤ ${maxXNearest}`,
							},
						})}
					/>
					<span className="text-[11px] leading-[14px]">Max: {maxXNearest}</span>
					{errors.x && (
						<span className="text-[11px] leading-[14px] text-red">{errors.x.message}</span>
					)}
				</label>

				<div className="flex gap-[10px] mt-[22px]">
					<button
						type="submit"
						className="h-[36px] rounded-[8px] border border-lightsilver bg-bgdakrwhite px-[12px] text-[13px] leading-[18px] text-white hover:border-lightsilver2 disabled:opacity-50"
						disabled={!isValid}
					>
						Generate
					</button>

					<button
						type="button"
						className="h-[36px] rounded-[8px] border border-lightsilver bg-bgdakrwhite px-[12px] text-[13px] leading-[18px] text-white hover:border-lightsilver2 disabled:opacity-50"
						disabled={!isValid || state.cells.length === 0}
						onClick={handleSubmit(onApplyX)}
					>
						Apply X
					</button>
				</div>
			</form>

			<div className="mt-[12px] flex flex-wrap gap-[16px] text-[12px] leading-[16px]">
					Current: M={state.m}, N={state.n}, X={state.x}
			</div>
		</section>
	);
}
