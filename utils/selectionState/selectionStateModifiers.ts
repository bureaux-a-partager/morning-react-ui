import { SelectionState } from 'morning-react-ui/types/dataTypes';

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

export {
  setAllTrue,
  setAllFalse,
  updateSelectionState,
  setAtTrueAndOthersAtFalse,
  removeLastElement,
  toggleSelectionStateAtIndex,
};
