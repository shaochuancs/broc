'use strict';

import React from 'react';

import utils from '../utils/utils';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {email: '', password: '', emailError: null, passwordError: null};
    this.isSubmitting = false;
  }
  componentDidMount() {
    setTimeout(function() {
      let loginSignupField = $('input.login-signup-field');
      if ($('input.login-signup-field:-webkit-autofill').length > 0) {
        loginSignupField.addClass('autofilled');
        loginSignupField.on('blur', function() {
          let field = $(this);
          if (!field.val()) {
            field.removeClass('autofilled');
          }
        });
      }
    }, 100);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.loginError) {
      this.isSubmitting = false;
      $(this.refs.submitButton).removeClass('disabled');

      if (nextProps.loginError.message !== this.state.loginErrorMessage) {
        this.setState({ loginErrorMessage: nextProps.loginError.message });
      }
    }
  }
  handleEmailChange(e) {
    this.setState({email: e.target.value, emailError: null, loginErrorMessage: null});
  }
  handlePasswordChange(e) {
    this.setState({password: e.target.value, passwordError: null, loginErrorMessage: null});
  }
  handleSubmit(e) {
    e.preventDefault();
    if (this.isSubmitting) {
      return;
    }

    let email = this.state.email.trim();
    let password = this.state.password.trim();

    if (!email) {
      this.setState({emailError: '请输入邮箱'});
      return;
    }
    let validateEmailReport = utils.validateInput(email, utils.VALIDATE_TYPE.EMAIL);
    if (!validateEmailReport.result) {
      this.setState({emailError: validateEmailReport.message});
      return;
    }

    if (!password) {
      this.setState({passwordError: '请输入密码'});
      return;
    }
    let validatePasswordReport = utils.validateInput(password, utils.VALIDATE_TYPE.PASSWORD);
    if (!validatePasswordReport.result) {
      this.setState({passwordError: validatePasswordReport.message});
      return;
    }

    if (this.state.signupErrorMessage) {
      this.setState({
        signupErrorMessage: null
      });
    }

    this.isSubmitting = true;
    $(this.refs.submitButton).addClass('disabled');

    this.props.login({
      email: email,
      password: password
    });
  }
  render() {
    let error = this.state.emailError || this.state.passwordError || this.state.loginErrorMessage;
    return (
      <div className="login-signup-wrapper">
        <div className="center-form-wrapper">
          <div className="login-signup-form-container login-signup-center-container text-center">
            <form noValidate="noValidate" className="inline-block full-width" onSubmit={(e) => this.handleSubmit(e)}>
              <img src="/static/images/common/uniboard_logo.png" width={70} />
              <h5 className="form-title">登录Uniboard</h5>
              <div className="form-item">
                <input className="login-signup-field" type="text" name="email" value={this.state.email} required onChange={(e) => this.handleEmailChange(e)} />
                <span className="bar"></span>
                <label>邮箱</label>
              </div>
              <div className="form-item">
                <input className="login-signup-field" type="password" name="password" value={this.state.password} required onChange={(e) => this.handlePasswordChange(e)} />
                <span className="bar"></span>
                <label>密码</label>
              </div>
              {
                error
                  ?
                  <div className="err-msg"><span className="glyphicon glyphicon-remove"></span> {error}</div>
                  :
                  null
              }

              <input ref="submitButton" type="submit" className="btn btn-primary btn-wide full-width form-submit" value="登录" />
            </form>
          </div>
          <div className="login-signup-center-container login-signup-link-container clearfix">
            <span className="pull-right">没有账号？<Link to="/app/sign-up">立即注册</Link></span>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
