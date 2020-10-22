import commandsModule from './commandsModule.js';
import toolbarModule from './toolbarModule.js';
import panelModule from './panelModule.js';

import actions from './redux/actions';

export default {
  /**
   * Only required property. Should be a unique value across all extensions.
   */
  id: 'rapid-viewer',

  /**
   *
   *
   * @param {object} [configuration={}]
   * @param {object|array} [configuration.csToolsConfig] - Passed directly to `initCornerstoneTools`
   */
  // preRegistration({ servicesManager, commandsManager, configuration = {} }) {
  //   init({ servicesManager, commandsManager, configuration });
  // },
  getToolbarModule({ servicesManager }) {
    return toolbarModule;
  },
  getCommandsModule({ servicesManager }) {
    return commandsModule;
  },
  getPanelModule({ servicesManager, commandsManager }) {
    return panelModule(servicesManager, commandsManager);
  },
};

export { RAPIDICONS } from './elements';

export { HttpException, UserExpiredException } from './exception';

export {
  fetchLogin,
  fetchMetadata,
  fetchPluginCheck,
  fetchRadReportForm,
  fetchTokenInvalidate,
  fetchTokenIssue,
  fetchWorkItems,
  fetchWorkList,
  fetchWorkLists,
} from './fetch';

export { actions };
