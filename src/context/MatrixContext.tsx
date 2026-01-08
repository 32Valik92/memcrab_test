"use client";

import {createContext, Dispatch, ReactNode, useContext, useMemo, useReducer} from "react";
import {MatrixAction, MatrixState} from "@/types";
import {initialState, matrixReducer} from "@/reducer";


type MatrixContextValue = {
	state: MatrixState;
	dispatch: Dispatch<MatrixAction>;
};

const MatrixContext = createContext<MatrixContextValue | null>(null);

export function MatrixProvider({children}: { children: ReactNode }) {

	const [state, dispatch] = useReducer(matrixReducer, initialState);

	const value = useMemo(() => ({state, dispatch}), [state]);

	return (
		<MatrixContext.Provider value={value}>
			{children}
		</MatrixContext.Provider>
	);
}

export function useMatrix() {

	const ctx = useContext(MatrixContext);

	if (!ctx) {
		throw new Error("useMatrix must be used inside MatrixProvider");
	}

	return ctx;
}
