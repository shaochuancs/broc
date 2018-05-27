/**
 * Created by cshao on 28/05/2018.
 */

'use strict';

import React from 'react';

import ReactModalDecorator from './utils/ReactModalDecorator';
import utils from './utils/utils';

class RequestInviteModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fullName: '',
      email: '',
      reEmail: '',
      requestInviteError: '',
      fullNameError: '',
      emailError: '',
      reEmailerror: ''
    };
    this.xhrs = [];
  }

  componentWillUnmount() {
    utils.abortAllXHRs(this.xhrs);
  }

  handleChange(e, key) {
    let errorKey = key+'Error';
    this.setState({
      [key]: e.target.value,
      [errorKey]: ''
    });
  }

  sendRequest(e) {
    e.preventDefault();

    let name = this.state.fullName.trim();
    if (!name) {
      this.setState({
        fullNameError: 'Please input full name'
      });
      return;
    }
    let validateNameReport = utils.validateInput(name, utils.VALIDATE_TYPE.NAME, 'full name');
    if (!validateNameReport.result) {
      this.setState({fullNameError: validateNameReport.message});
      return;
    }

    let email = this.state.email.trim();
    if (!email) {
      this.setState({
        emailError: 'Please input email'
      });
      return;
    }
    let validateEmailReport = utils.validateInput(email, utils.VALIDATE_TYPE.EMAIL, 'email');
    if (!validateEmailReport.result) {
      this.setState({emailError: validateEmailReport.message});
      return;
    }

    let reEmail = this.state.reEmail.trim();
    if (!reEmail) {
      this.setState({
        reEmailError: 'Please confirm email'
      });
      return;
    } else if (reEmail !== email) {
      this.setState({
        reEmailError: 'Please confirm with identical email'
      });
      return;
    }

    alert('OK!');
  }

  render() {
    let error = this.state.fullNameError || this.state.emailError || this.state.reEmailError || this.state.requestInviteError;
    return (
      <div className="modal request-invite-modal-container fade" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4 className="modal-title">Request an invite</h4>
            </div>
            <div className="modal-body">
              <div>
                <form onSubmit={(e) => this.sendRequest(e)}>
                  <input type="text" placeholder="Full name" className="form-control" value={this.state.fullName} onChange={(e) => this.handleChange(e, 'fullName')}></input>
                  <input type="text" placeholder="Email" className="form-control" value={this.state.email} onChange={(e) => this.handleChange(e, 'email')}></input>
                  <input type="text" placeholder="Confirm email" className="form-control" value={this.state.reEmail} onChange={(e) => this.handleChange(e, 'reEmail')}></input>
                  <button type="submit" className="btn btn-primary full-width btn-submit">Send</button>
                </form>
              </div>
              {
                error
                  ?
                  <div className="err-msg text-center margin-top-normal"><span className="glyphicon glyphicon-remove"></span> {error}</div>
                  :
                  null
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ReactModalDecorator.decorateModal(RequestInviteModal, 'request-invite-modal');

export default RequestInviteModal;