'use strict';

import React from 'react';

import RequestInviteModal from './RequestInviteModal';

class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  showRequestModal() {
    RequestInviteModal.show();
  }

  render() {
    return (
      <div className="home-wrapper">
        <div className="header-wrapper">
          <div className="container">
            <span>BROCCOLI & CO.</span>
          </div>
        </div>
        <div className="content-wrapper text-center">
          <div className="container">
            <h3 className="slogan">
              <span>A better way</span><br/>
              <span>to enjoy everyday.</span>
            </h3>
            <p className="description">Be the first to know when we launch.</p>
            <button className="btn btn-clear" onClick={() => this.showRequestModal()}>Request an invite</button>
          </div>
        </div>
        <div className="footer-wrapper">
          <div className="container text-center">
            <div>Made with &#9829; in Melbourne.</div>
            <div>&#169; 2016 Broccoli & Co. All rights reserved.</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
