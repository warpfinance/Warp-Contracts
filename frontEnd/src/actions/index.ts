import { bindActionCreators } from "redux";
import { useDispatch } from "react-redux";
import { useMemo } from "react";

/* eslint-disable react-hooks/exhaustive-deps */
export function useActions(actions: any, deps?: any): any {
	const dispatch = useDispatch();
	return useMemo(
		() => {
			if (Array.isArray(actions)) {
				return actions.map(a => bindActionCreators(a, dispatch));
			}
			return bindActionCreators(actions, dispatch);
		},
		deps ? [dispatch, ...deps] : deps
	);
}
/* eslint-enable react-hooks/exhaustive-deps */
