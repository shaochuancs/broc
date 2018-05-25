/**
 * Created by cshao on 11/19/16.
 */

'use strict';

import React from 'react';

class MessageDisplay extends React.Component {
  componentDidMount() {
    let messageWrapper = $('.message-display-wrapper');
    messageWrapper.fadeIn(600);

    if (this.props.autoHideHandler) {
      setTimeout(function() {
        messageWrapper.fadeOut(600);
      }, 2600);
      setTimeout(function() {
        this.props.autoHideHandler();
      }.bind(this), 3200);
    }

    if (this.props.countDownHandler) {
      setTimeout(function() {
        this.props.countDownHandler();
      }.bind(this), 3000);
    }
  }
  render() {
    let messageDisplayClassName = 'inline-block message-display';
    if (this.props.className) {
      messageDisplayClassName = messageDisplayClassName + ' ' + this.props.className;
    }
    return (
      <div className="message-display-wrapper">
        <div className={messageDisplayClassName}>
          <div>
            <span className="error-text">{this.props.msgText}</span>&nbsp;
            {
              this.props.onRetry
                ?
                <a href="javascript:;" onClick={this.props.onRetry}>重试</a>
                :
                null
            }
            {
              this.props.onAdd
                ?
                <a href="javascript:;" onClick={this.props.onAdd}>添加</a>
                :
                null
            }
          </div>
          {
            this.props.countDownHandler
              ?
              <div className="count-down-text">
                <span>3秒后自动跳转</span>
              </div>
              :
              null
          }
        </div>
      </div>
    );
  }
}

export default MessageDisplay;
