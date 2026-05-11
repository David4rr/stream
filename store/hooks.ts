/**
 * Typed Redux Hooks - Optimized
 *
 * Custom hooks dengan memoization untuk performa lebih baik.
 * Menggunakan reselect-style memoization untuk derived data.
 */

import { useCallback, useMemo } from "react";
import { useDispatch, useSelector, useStore, shallowEqual } from "react-redux";
import type { AppDispatch, RootState } from "./index";
import type { UnknownAction } from "@reduxjs/toolkit";

// ============================================================================
// Basic Typed Hooks
// ============================================================================

/**
 * Typed dispatch hook
 * @example
 * const dispatch = useAppDispatch();
 * dispatch(someAction());
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * Typed selector hook dengan shallow equality check default
 * @example
 * const user = useAppSelector(state => state.auth.user);
 */
export const useAppSelector = <TSelected>(
  selector: (state: RootState) => TSelected,
  equalityFn = shallowEqual
): TSelected => useSelector(selector, equalityFn);

/**
 * Typed store hook
 * @example
 * const store = useAppStore();
 */
export const useAppStore = () => useStore<RootState>();

// ============================================================================
// Optimized Selector Hooks dengan Memoization
// ============================================================================

/**
 * Hook untuk mengambil multiple values dari state dengan memoization
 * Menggunakan shallowEqual untuk mencegah re-render yang tidak perlu
 *
 * @example
 * const { user, isLoading } = useAuthState();
 */
export function useAuthState() {
  return useAppSelector(
    (state) => ({
      user: state.auth.user,
      status: state.auth.status,
      error: state.auth.error,
      isAuthenticated: state.auth.user !== null,
      isLoading: state.auth.status === "loading",
    }),
    shallowEqual
  );
}

/**
 * Hook untuk membuat selector yang memoized
 * Berguna untuk derived state yang kompleks
 *
 * @example
 * const selectActiveUsers = useMemoSelector(
 *   useCallback(state => state.users.filter(u => u.active), [])
 * );
 */
export function useMemoSelector<TSelected>(
  selector: (state: RootState) => TSelected
): TSelected {
  return useAppSelector(selector, shallowEqual);
}

// ============================================================================
// Action Creator Hooks dengan Callback Memoization
// ============================================================================

/**
 * Hook untuk membuat action dispatcher yang memoized
 * @example
 * const logout = useAction(logoutAction);
 * logout(); // dispatch(logoutAction())
 */
export function useAction<T extends (...args: unknown[]) => UnknownAction>(
  actionCreator: T
): (...args: Parameters<T>) => void {
  const dispatch = useAppDispatch();
  return useCallback(
    (...args: Parameters<T>) => {
      const action = actionCreator(...args);
      void dispatch(action as UnknownAction);
    },
    [dispatch, actionCreator]
  );
}

/**
 * Hook untuk membuat multiple action dispatchers yang memoized
 * @example
 * const { login, logout } = useActions({ login: loginAction, logout: logoutAction });
 */
export function useActions<T extends Record<string, (...args: unknown[]) => UnknownAction>>(
  actionCreators: T
): { [K in keyof T]: (...args: Parameters<T[K]>) => void } {
  const dispatch = useAppDispatch();

  return useMemo(() => {
    const boundActions = {} as { [K in keyof T]: (...args: Parameters<T[K]>) => void };
    for (const key in actionCreators) {
      boundActions[key] = (...args: Parameters<T[keyof T]>) => {
        const action = actionCreators[key](...args);
        void dispatch(action);
      };
    }
    return boundActions;
  }, [dispatch, actionCreators]);
}
