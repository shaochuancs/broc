/**
 * Created by cshao on 12/24/16.
 */

'use strict';

import React from 'react';
import MessageDisplay from './MessageDisplay';

class SuccessMessageDisplay extends React.Component {
  render() {
    return (
      <MessageDisplay
        msgText={this.props.msgText}
        autoHideHandler={this.props.autoHideHandler}
        className="success-message-display"
      ></MessageDisplay>
    );
  }
}

export default SuccessMessageDisplay;