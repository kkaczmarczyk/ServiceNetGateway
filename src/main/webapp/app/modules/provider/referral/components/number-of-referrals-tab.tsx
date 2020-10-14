import React from 'react';
import { Row } from 'reactstrap';
import { Translate } from 'react-jhipster';

const NumberOfReferralsTab = () => (
  <Row className="col-12 col-md-8 offset-md-2 my-5 h-100 content-container">
    <div className="w-100">
      <div className="content-title">
        <Translate contentKey="referral.title.numberOfReferrals" />
      </div>
    </div>
  </Row>
);

export default NumberOfReferralsTab;