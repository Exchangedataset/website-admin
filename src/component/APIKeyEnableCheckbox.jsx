import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'semantic-ui-react';

import AttentionModal from './AttentionModal';
import { postSetAPIKeyEnabled } from '../ajax';

class APIKeyEnableCheckbox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enabled: props.enabled,
      setting: false,
      modalOpen: false,
      error: null,
    };
    this.setAPIKeyEnabled = this.setAPIKeyEnabled.bind(this);
  }

  setAPIKeyEnabled() {
    const { apikey, onChange } = this.props;
    const { enabled } = this.state;
    this.setState({ setting: true });
    // toggle enabled
    postSetAPIKeyEnabled(apikey, !enabled).then(() => {
      this.setState({ enabled: !enabled, modalOpen: false });
      onChange();
    }).catch((e) => {
      this.setState({ error: e.toString() });
    }).finally(() => {
      this.setState({ setting: false });
    });
  }


  render() {
    const { apikey } = this.props;
    const {
      enabled, setting, modalOpen, error,
    } = this.state;
    return (
      <div>
        <AttentionModal
          open={modalOpen}
          waiting={setting}
          error={error}
          onCancel={() => this.setState({ modalOpen: false })}
          onOK={this.setAPIKeyEnabled}
        >
          <p>
            You are tring to
            {' '}
            <span style={{ fontWeight: 'bold' }}>
              {enabled ? 'disable' : 'enable'}
            </span>
            {' '}
            API-key shown below:
          </p>
          <p>{apikey}</p>
          {
            enabled ? (
              <p>Disabling API-key will IMMEDIATELY make this API-key unusable for everyone.</p>
            ) : ''
          }
          <p>Do you want to proceed?</p>
        </AttentionModal>
        <Checkbox
          toggle
          checked={enabled}
          disabled={setting}
          onChange={() => {
            this.setState({ modalOpen: true });
          }}
        />
      </div>
    );
  }
}

APIKeyEnableCheckbox.propTypes = {
  apikey: PropTypes.string.isRequired,
  enabled: PropTypes.bool.isRequired,
  onChange: PropTypes.func,
};

APIKeyEnableCheckbox.defaultProps = {
  onChange: () => {},
};

export default APIKeyEnableCheckbox;
