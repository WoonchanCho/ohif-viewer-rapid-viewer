import {
  moveToPrevWorkItem,
  moveToNextWorkItem,
} from '@ohif/extension-rapid-viewer/src/redux/actions';

// "actions" doesn't really mean anything
// these are basically ambigous sets of implementation(s)
const actions = {};

const definitions = {
  rapidViewerMoveToPrevItem: {
    commandFn: () => {
      window.store.dispatch(moveToPrevWorkItem());
    },
    storeContexts: [],
    options: {},
  },
  rapidViewerMoveToNextItem: {
    commandFn: () => {
      window.store.dispatch(moveToNextWorkItem());
    },
    storeContexts: [],
    options: { words: 'Just kidding! Goodbye!' },
  },
};

export default {
  actions,
  definitions,
  defaultContext: 'VIEWER',
};
