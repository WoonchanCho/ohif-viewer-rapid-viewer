import React from 'react';
import { Icon } from './../../elements/Icon';
// TODO: useTranslation
import { withTranslation } from '../../contextProviders';

function WorkListLoadingText({ t: translate }) {
  return (
    <div className="loading-text">
      {translate('Loading')}... <Icon name="circle-notch" animation="pulse" />
    </div>
  );
}

const connectedComponent = withTranslation('WorkListLoadingText')(
  WorkListLoadingText
);

export { connectedComponent as WorkListLoadingText };
