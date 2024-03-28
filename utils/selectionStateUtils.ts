import { SelectionState, TriState } from '@/components/inputs/types';

const atLeastOneTrue = (selectionState: SelectionState): boolean => {
  return Object.values(selectionState).some((value) => value === true);
};

const allTrue = (selectionState: SelectionState): boolean => {
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

const setAtTrueAndOthersAtFalse = (
  selectionState: SelectionState,
  keyToUpdate: string,
): SelectionState => {
  const updatedState: SelectionState = { ...selectionState };
  Object.keys(updatedState).forEach((key) => {
    updatedState[key] = false;
  });

  updatedState[keyToUpdate] = true;
  return updatedState;
};

const selectionStateToString = (selectionState: SelectionState): string => {
  const stringRepresentation = Object.entries(selectionState)
    .filter(([, value]) => value)
    .map(([key]) => key)
    .join(', ');

  return stringRepresentation.length > 0 ? `${stringRepresentation},` : '';
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

const removeElementFromSelectionState = (
  selectionState: SelectionState,
  keyToRemove: string,
): SelectionState => {
  const updatedSelectionState = { ...selectionState };
  delete updatedSelectionState[keyToRemove];
  return updatedSelectionState;
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
  return { start: startIndex, end: endIndex };
};

export {
  atLeastOneTrue,
  allTrue,
  setAllTrue,
  setAllFalse,
  getSelectionStatus,
  updateSelectionState,
  selectionStateToString,
  removeLastElement,
  getCurrentElementFromCursorPosition,
  removeElementFromSelectionState,
  getElementPositionInSelectionState,
  setAtTrueAndOthersAtFalse,
};
