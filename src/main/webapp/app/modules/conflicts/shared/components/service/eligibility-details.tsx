import React from 'react';
import '../../shared-record-view.scss';
import { connect } from 'react-redux';
import { IActivityRecord } from 'app/shared/model/activity-record.model';
import { AdditionalDetails } from '../additional-details';
import { IEligibility } from 'app/shared/model/eligibility.model';
import { getTextAreaField } from 'app/shared/util/single-record-view-utils';

export interface IEligibilityDetailsProp extends StateProps, DispatchProps {
  activity: IActivityRecord;
  eligibility: IEligibility;
  showClipboard: boolean;
}

export class EligibilityDetails extends React.Component<IEligibilityDetailsProp> {
  render() {
    const eligibility = this.props.eligibility ? this.props.eligibility : {};
    const fields = [getTextAreaField(eligibility, 'eligibility')];

    return (
      <AdditionalDetails
        {...this.props}
        fields={fields}
        entityClass={'Eligibility'}
        customHeader={false}
        additionalFields={false}
        toggleAvailable
        isCustomToggle={false}
        customToggleValue={false}
      />
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EligibilityDetails);
