import { SelectionState, TriState } from 'morning-react-ui/types/dataTypes';

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

const mergeAndValidateStates = (
  initialState: SelectionState | undefined,
  newState: SelectionState | undefined,
): SelectionState => {
  const validatedState: SelectionState = initialState
    ? { ...initialState }
    : {};
  if (!newState) {
    return validatedState;
  }

  const keysForUpdate: string[] = [];
  Object.keys(newState).forEach((key) => {
    if (newState[key] === false || newState[key] === undefined) {
      delete validatedState[key];
    } else if (newState[key] && !(key in validatedState)) {
      keysForUpdate.push(key);
    }
  });

  keysForUpdate.forEach((key) => {
    validatedState[key] = true;
  });
  return validatedState;
};

const getCurrentElementFromCursorPosition = (
  selectionState: SelectionState | undefined,
  cursorPosition: number | null,
): string | null => {
  if (!(selectionState && cursorPosition)) {
    return null;
  }
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
  return { start: startIndex, end: endIndex };
};

export {
  atLeastOneTrue,
  isAllTrue,
  getSelectionStatus,
  mergeAndValidateStates,
  getCurrentElementFromCursorPosition,
  getElementPositionInSelectionState,
};
