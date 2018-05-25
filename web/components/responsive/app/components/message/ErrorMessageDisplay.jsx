/**
 * Created by cshao on 12/24/16.
 */

'use strict';

import React from 'react';
import MessageDisplay from './MessageDisplay';

class ErrorMessageDisplay extends React.Component {
  render() {
    return (
      <MessageDisplay
        msgText={this.props.errorText}
        autoHideHandler={this.props.autoHideHandler}
        onRetry={this.props.onRetry}
        onAdd={this.props.onAdd}
        countDownHandler={this.props.countDownHandler}
        className="error-message-display"
      ></MessageDisplay>
    );
  }
}

export default ErrorMessageDisplay;