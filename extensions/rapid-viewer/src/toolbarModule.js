import CurrentWorkItemToolbarComponent from '@ohif/extension-rapid-viewer/src/components/CurrentWorkItemToolbarComponent';

const TOOLBAR_BUTTON_TYPES = {
  COMMAND: 'command',
  SET_TOOL_ACTIVE: 'setToolActive',
  BUILT_IN: 'builtIn',
};

const definitions = [
  {
    id: 'prevWork',
    label: 'Prev',
    icon: 'rapid-prev',
    type: TOOLBAR_BUTTON_TYPES.COMMAND,
    commandName: 'rapidViewerMoveToPrevItem',
  },
  {
    id: 'currentWorkItem',
    label: 'CurrentWorkItem',
    icon: '',
    CustomComponent: CurrentWorkItemToolbarComponent,
  },
  {
    id: 'nextWork',
    label: 'Next',
    icon: 'rapid-next',
    type: TOOLBAR_BUTTON_TYPES.COMMAND,
    commandName: 'rapidViewerMoveToNextItem',
  },
];

export default {
  definitions,
  defaultContext: 'ACTIVE_VIEWPORT::CORNERSTONE',
};
