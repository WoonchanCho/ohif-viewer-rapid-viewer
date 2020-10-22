import React from 'react';
import ConnectedRapidWorkItemsPanel from './components/ConnectedRapidWorkItemsPanel';
import ConnectedRapidRadReportPanel from './components/ConnectedRapidRadReportPanel';

const PanelModule = (servicesManager, commandsManager) => {
  const { UINotificationService } = servicesManager.services;

  const ExtendedConnectedRapidWorkItemsPanel = () => (
    <ConnectedRapidWorkItemsPanel />
  );

  const ExtendedConnectedRadReportTable = () => (
    <ConnectedRapidRadReportPanel
      onSaveComplete={message => {
        if (UINotificationService) {
          UINotificationService.show(message);
        }
      }}
    />
  );

  return {
    menuOptions: [
      {
        icon: 'list',
        label: 'Work Items',
        from: 'left',
        target: 'rapid-work-items-panel',
      },
      {
        icon: 'list',
        label: 'RadReport',
        from: 'right',
        target: 'rapid-report-panel',
      },
    ],
    components: [
      {
        id: 'rapid-work-items-panel',
        component: ExtendedConnectedRapidWorkItemsPanel,
      },
      {
        id: 'rapid-report-panel',
        component: ExtendedConnectedRadReportTable,
      },
    ],
    defaultContext: ['VIEWER'],
  };
};

export default PanelModule;
