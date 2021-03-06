import React from 'react';
import '../../shared-record-view.scss';
import { connect } from 'react-redux';
import { IActivityRecord } from 'app/shared/model/activity-record.model';
import { AdditionalDetails } from '../additional-details';
import { IRequiredDocument } from 'app/shared/model/required-document.model';
import { Translate } from 'react-jhipster';
import { Badge } from 'reactstrap';
import { getTextAreaField } from 'app/shared/util/single-record-view-utils';

export interface IRequiredDocumentsDetailsProp extends StateProps, DispatchProps {
  activity: IActivityRecord;
  docs: IRequiredDocument[];
  showClipboard: boolean;
}

export class RequiredDocumentsDetails extends React.Component<IRequiredDocumentsDetailsProp> {
  render() {
    const { docs } = this.props;
    const fields = docs.map(document => getTextAreaField(document, 'document'));

    return fields.length > 0 ? (
      <AdditionalDetails
        {...this.props}
        fields={fields}
        entityClass={'RequiredDocument'}
        customHeader={false}
        additionalFields={false}
        toggleAvailable
        isCustomToggle={false}
        customToggleValue={false}
      />
    ) : null;
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RequiredDocumentsDetails);
