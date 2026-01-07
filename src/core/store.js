/**
 * Simple State Store
 * Maintains a single source of truth and notifies subscribers.
 */
export function createStore(initialState) {
    let state = { ...initialState };
    const listeners = [];

    return {
        getState: () => state,
        setState: (newState) => {
            state = { ...state, ...newState };
            listeners.forEach(listener => listener(state));
        },
        subscribe: (listener) => {
            listeners.push(listener);
            return () => {
                const index = listeners.indexOf(listener);
                if (index > -1) listeners.splice(index, 1);
            };
        }
    };
}
