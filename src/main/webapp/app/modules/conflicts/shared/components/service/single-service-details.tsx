import React from 'react';
import { Col, Row } from 'reactstrap';
import '../../shared-record-view.scss';
import { TextFormat, Translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { IActivityRecord } from 'app/shared/model/activity-record.model';
import { OpeningHoursDetails } from '../opening-hours-details';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AdditionalDetails } from '../additional-details';
import { IServiceRecord } from 'app/shared/model/service-record.model';
import { EligibilityDetails } from './eligibility-details';
import { FundingDetails } from './funding-details';
import { RequiredDocumentsDetails } from './required-documents-details';
import { ServiceTaxonomiesDetails } from './service-taxonomies-details';
import { PaymentsAcceptedDetails } from './payments-accepted-details';
import { LanguagesDetails } from '../languages-details';
import { HolidaySchedulesDetails } from '../holiday-schedules-details';
import { ContactsDetails } from '../contact/contacts-details';
import { PhonesDetails } from '../phone/phones-details';
import { getTextField } from 'app/shared/util/single-record-view-utils';
import { APP_DATE_FORMAT } from 'app/config/constants';

export interface ISingleServiceDetailsProp extends StateProps, DispatchProps {
  activity: IActivityRecord;
  record: IServiceRecord;
  servicesCount: string;
  changeRecord: any;
  isOnlyOne: boolean;
  columnSize: number;
  showClipboard: boolean;
  isAreaOpen: boolean;
}

export interface ISingleServiceDetailsState {
  isAreaOpen: boolean;
}

export class SingleServiceDetails extends React.Component<ISingleServiceDetailsProp, ISingleServiceDetailsState> {
  state: ISingleServiceDetailsState = {
    isAreaOpen: this.props.isAreaOpen
  };

  toggleAreaOpen = () => {
    this.setState({
      isAreaOpen: !this.state.isAreaOpen
    });
  };

  changeRecord = offset => () => {
    this.setState({ isAreaOpen: true });
    this.props.changeRecord(offset);
  };

  render() {
    const { record, isOnlyOne, columnSize } = this.props;
    const customHeader = (
      <h4 className="title">
        <div className="collapseBtn" onClick={this.toggleAreaOpen}>
          <div className="collapseIcon">
            <FontAwesomeIcon size="xs" icon={this.state.isAreaOpen ? 'angle-up' : 'angle-down'} />
          </div>
          <Translate contentKey="singleRecordView.details.titleServices" /> <span className="text-blue">{this.props.servicesCount}</span>
        </div>
        {isOnlyOne ? null : (
          <span>
            <span role="button" onClick={this.changeRecord(-1)}>
              <FontAwesomeIcon className="text-blue" icon="chevron-left" /> <Translate contentKey="singleRecordView.details.prev" />
            </span>
            <span role="button" onClick={this.changeRecord(1)}>
              <Translate contentKey="singleRecordView.details.next" /> <FontAwesomeIcon className="text-blue" icon="chevron-right" />
            </span>
          </span>
        )}
      </h4>
    );

    const itemHeader = (
      <div>
        <h5>
          <Translate contentKey="multiRecordView.lastCompleteReview" />
          <TextFormat value={record.service.lastVerifiedOn} type="date" format={APP_DATE_FORMAT} blankOnInvalid />
        </h5>
        <h5>
          <Translate contentKey="multiRecordView.lastUpdated" />
          <TextFormat value={record.service.updatedAt} type="date" format={APP_DATE_FORMAT} blankOnInvalid />
        </h5>
      </div>
    );

    const additionalFields = [
      <EligibilityDetails key="eligibility-details" {...this.props} eligibility={record.eligibility} />,
      <FundingDetails key="funding-details" {...this.props} funding={record.funding} />,
      <RequiredDocumentsDetails key="required-documents-details" {...this.props} docs={record.docs} />,
      <PaymentsAcceptedDetails key="payments-accepted-details" {...this.props} payments={record.paymentsAccepteds} />,
      <ServiceTaxonomiesDetails key="service-taxonomies-details" {...this.props} taxonomies={record.taxonomies} />,
      <OpeningHoursDetails key="opening-hours-details" {...this.props} hours={record.regularScheduleOpeningHours} />,
      <LanguagesDetails key="languages-details" {...this.props} langs={record.langs} />,
      <HolidaySchedulesDetails key="holiday-schedules-details" {...this.props} schedules={record.holidaySchedules} />,
      <ContactsDetails key="contacts-details" {...this.props} contacts={record.contacts} />,
      <PhonesDetails key="phones-details" {...this.props} phones={record.phones} />
    ];

    const fields = [
      getTextField(record.service, 'name'),
      getTextField(record.service, 'alternateName'),
      {
        type: 'textarea',
        fieldName: 'description',
        defaultValue: record.service.description
      },
      getTextField(record.service, 'url'),
      getTextField(record.service, 'email'),
      getTextField(record.service, 'status'),
      {
        type: 'textarea',
        fieldName: 'interpretationServices',
        defaultValue: record.service.interpretationServices
      },
      {
        type: 'textarea',
        fieldName: 'applicationProcess',
        defaultValue: record.service.applicationProcess
      },
      {
        type: 'textarea',
        fieldName: 'waitTime',
        defaultValue: record.service.waitTime
      },
      {
        type: 'textarea',
        fieldName: 'fees',
        defaultValue: record.service.fees
      },
      {
        type: 'textarea',
        fieldName: 'accreditations',
        defaultValue: record.service.accreditations
      },
      {
        type: 'textarea',
        fieldName: 'licenses',
        defaultValue: record.service.licenses
      },
      getTextField(record, 'type')
    ];
    return (
      <Row>
        <Col sm={columnSize}>
          <hr />
          <AdditionalDetails
            {...this.props}
            fields={fields}
            entityClass={'Service'}
            customHeader={customHeader}
            additionalFields={additionalFields}
            itemHeader={itemHeader}
            toggleAvailable
            isCustomToggle
            customToggleValue={this.state.isAreaOpen}
          />
        </Col>
      </Row>
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
)(SingleServiceDetails);
