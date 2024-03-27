import { SelectionState, TriState } from '@/components/inputs/types';

const atLeastOneTrue = (selectionState: SelectionState): boolean => {
  return Object.values(selectionState).some((value) => value === true);
};

const isAllTrue = (selectionState: SelectionState): boolean => {
  return Object.values(selectionState).every((value) => value === true);
};

const getSelectionStatus = (selectionState: SelectionState): TriState => {
  const values = Object.values(selectionState);
  if (values.every((value) => value === true)) {
    return TriState.true;
  } else if (values.every((value) => value === false)) {
    return TriState.false;
  } else {
    return TriState.indeterminate;
  }
};

const setAllTrue = (selectionState: SelectionState): SelectionState => {
  const updatedState: SelectionState = { ...selectionState };
  Object.keys(updatedState).forEach((key) => {
    updatedState[key] = true;
  });
  return updatedState;
};

const setAllFalse = (selectionState: SelectionState): SelectionState => {
  const updatedState: SelectionState = { ...selectionState };
  Object.keys(updatedState).forEach((key) => {
    updatedState[key] = false;
  });
  return updatedState;
};

const updateSelectionState = (
  currentState: SelectionState,
  keyToUpdate: string,
  newValue: boolean,
): SelectionState => {
  const updatedState: SelectionState = { ...currentState };
  updatedState[keyToUpdate] = newValue;
  return updatedState;
};

const selectionStateTrueToString = (
  selectionState: SelectionState | undefined,
): string => {
  if (selectionState === undefined) return '';
  const stringRepresentation = Object.entries(selectionState)
    .filter(([, value]) => value)
    .map(([key]) => key)
    .join(', ');

  return stringRepresentation.length > 0 ? `${stringRepresentation}, ` : '';
};

const stateToValidatedState = (
  state1: SelectionState | undefined,
  state2: SelectionState | undefined,
): SelectionState => {
  const updatedState: SelectionState = state1 ? { ...state1 } : {};
  if (!state2) return updatedState;

  const keysToAdd: string[] = [];

  Object.keys(state2).forEach((key) => {
    if (state2[key] === false || state2[key] === undefined) {
      delete updatedState[key];
    } else if (state2[key] && !(key in updatedState)) {
      keysToAdd.push(key);
    }
  });

  keysToAdd.forEach((key) => {
    updatedState[key] = true;
  });

  return updatedState;
};

const toggleSelectionStateAtIndex = (
  state: SelectionState,
  position: number | null,
): SelectionState => {
  const keys = Object.keys(state);
  if (position === null || position < 0 || position >= keys.length) {
    return state;
  }

  const keyToToggle = keys[position];
  return {
    ...state,
    [keyToToggle]: !state[keyToToggle],
  };
};

const removeLastElement = (
  selectionStateToRemove: SelectionState,
): SelectionState => {
  const keys = Object.keys(selectionStateToRemove);
  const lastKey = keys[keys.length - 1];
  if (lastKey) {
    const { [lastKey]: _, ...remainingSelectionState } = selectionStateToRemove;
    return remainingSelectionState;
  }
  return selectionStateToRemove;
};

const getCurrentElementFromCursorPosition = (
  selectionState: SelectionState,
  cursorPosition: number,
): string | null => {
  let cumulativeLength = 0;
  const activeKeys = Object.entries(selectionState)
    .filter(([, value]) => value)
    .map(([key]) => key);

  for (const key of activeKeys) {
    const nextCumulativeLength = cumulativeLength + key.length + 2;

    if (cursorPosition <= nextCumulativeLength) {
      return key;
    }
    cumulativeLength = nextCumulativeLength;
  }
  return null;
};

const getElementPositionInSelectionState = (
  selectionState: SelectionState,
  element: string,
): { start: number; end: number } | null => {
  const stringRepresentation = Object.entries(selectionState)
    .filter(([, value]) => value)
    .map(([key]) => `${key}, `)
    .join('');
  const startIndex = stringRepresentation.indexOf(`${element}, `);
  if (startIndex === -1) {
    return null;
  }
  const endIndex = startIndex + element.length + 2;
  console.log(startIndex, endIndex);
  return { start: startIndex, end: endIndex };
};

export {
  atLeastOneTrue,
  isAllTrue,
  stateToValidatedState,
  setAllTrue,
  setAllFalse,
  getSelectionStatus,
  updateSelectionState,
  selectionStateTrueToString,
  removeLastElement,
  getCurrentElementFromCursorPosition,
  getElementPositionInSelectionState,
  toggleSelectionStateAtIndex,
};
