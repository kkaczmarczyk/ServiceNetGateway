import React from 'react';
import { Switch } from 'react-router-dom';

// tslint:disable-next-line:no-unused-variable
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import SystemAccount from './system-account';
import DocumentUpload from './document-upload';
import Organization from './organization';
import Service from './service';
import Program from './program';
import ServiceAtLocation from './service-at-location';
import Location from './location';
import PhysicalAddress from './physical-address';
import PostalAddress from './postal-address';
import Phone from './phone';
import Contact from './contact';
import RegularSchedule from './regular-schedule';
import HolidaySchedule from './holiday-schedule';
import Funding from './funding';
import Eligibility from './eligibility';
import ServiceArea from './service-area';
import RequiredDocument from './required-document';
import PaymentAccepted from './payment-accepted';
import Language from './language';
import AccessibilityForDisabilities from './accessibility-for-disabilities';
import ServiceTaxonomy from './service-taxonomy';
import Taxonomy from './taxonomy';
import OrganizationMatch from './organization-match';
import Metadata from './metadata';
import OpeningHours from './opening-hours';
import Conflict from './conflict';
import DataImportReport from './data-import-report';
import FieldExclusion from './field-exclusion';
import ExclusionsConfig from './exclusions-config';
import GeocodingResult from './geocoding-result';
import Beds from './beds';
import Shelter from './shelter';
import Option from './option';
import LocationExclusion from './location-exclusion';
import OrganizationError from './organization-error';
import MatchSimilarity from './match-similarity';
import ActivityFilter from './activity-filter';
import TaxonomyGroup from './taxonomy-group';
import FieldsDisplaySettings from './fields-display-settings';
import LocationFieldsValue from './location-fields-value';
import OrganizationFieldsValue from './organization-fields-value';
import PhysicalAddressFieldsValue from './physical-address-fields-value';
import PostalAddressFieldsValue from './postal-address-fields-value';
import ServiceFieldsValue from './service-fields-value';
import ServiceTaxonomiesDetailsFieldsValue from './service-taxonomies-details-fields-value';
import ContactDetailsFieldsValue from './contact-details-fields-value';
import RequestLogger from './request-logger';
import DailyUpdate from './daily-update';
import Silo from './silo';
import UserGroup from './user-group';
import Beneficiary from './beneficiary';
import Referral from './referral';
/* jhipster-needle-add-route-import - JHipster will add routes here */

const Routes = ({ match }) => (
  <div>
    <Switch>
      {/* prettier-ignore */}
      <ErrorBoundaryRoute path={`${match.url}/system-account`} component={SystemAccount} />
      <ErrorBoundaryRoute path={`${match.url}/document-upload`} component={DocumentUpload} />
      <ErrorBoundaryRoute path={`${match.url}/organization`} component={Organization} />
      <ErrorBoundaryRoute path={`${match.url}/service`} component={Service} />
      <ErrorBoundaryRoute path={`${match.url}/program`} component={Program} />
      <ErrorBoundaryRoute path={`${match.url}/service-at-location`} component={ServiceAtLocation} />
      <ErrorBoundaryRoute path={`${match.url}/location`} component={Location} />
      <ErrorBoundaryRoute path={`${match.url}/physical-address`} component={PhysicalAddress} />
      <ErrorBoundaryRoute path={`${match.url}/postal-address`} component={PostalAddress} />
      <ErrorBoundaryRoute path={`${match.url}/phone`} component={Phone} />
      <ErrorBoundaryRoute path={`${match.url}/contact`} component={Contact} />
      <ErrorBoundaryRoute path={`${match.url}/regular-schedule`} component={RegularSchedule} />
      <ErrorBoundaryRoute path={`${match.url}/holiday-schedule`} component={HolidaySchedule} />
      <ErrorBoundaryRoute path={`${match.url}/funding`} component={Funding} />
      <ErrorBoundaryRoute path={`${match.url}/eligibility`} component={Eligibility} />
      <ErrorBoundaryRoute path={`${match.url}/service-area`} component={ServiceArea} />
      <ErrorBoundaryRoute path={`${match.url}/required-document`} component={RequiredDocument} />
      <ErrorBoundaryRoute path={`${match.url}/payment-accepted`} component={PaymentAccepted} />
      <ErrorBoundaryRoute path={`${match.url}/language`} component={Language} />
      <ErrorBoundaryRoute path={`${match.url}/accessibility-for-disabilities`} component={AccessibilityForDisabilities} />
      <ErrorBoundaryRoute path={`${match.url}/service-taxonomy`} component={ServiceTaxonomy} />
      <ErrorBoundaryRoute path={`${match.url}/taxonomy`} component={Taxonomy} />
      <ErrorBoundaryRoute path={`${match.url}/organization-match`} component={OrganizationMatch} />
      <ErrorBoundaryRoute path={`${match.url}/metadata`} component={Metadata} />
      <ErrorBoundaryRoute path={`${match.url}/opening-hours`} component={OpeningHours} />
      <ErrorBoundaryRoute path={`${match.url}/conflict`} component={Conflict} />
      <ErrorBoundaryRoute path={`${match.url}/data-import-report`} component={DataImportReport} />
      <ErrorBoundaryRoute path={`${match.url}/field-exclusion`} component={FieldExclusion} />
      <ErrorBoundaryRoute path={`${match.url}/exclusions-config`} component={ExclusionsConfig} />
      <ErrorBoundaryRoute path={`${match.url}/geocoding-result`} component={GeocodingResult} />
      <ErrorBoundaryRoute path={`${match.url}/beds`} component={Beds} />
      <ErrorBoundaryRoute path={`${match.url}/shelter`} component={Shelter} />
      <ErrorBoundaryRoute path={`${match.url}/option`} component={Option} />
      <ErrorBoundaryRoute path={`${match.url}/location-exclusion`} component={LocationExclusion} />
      <ErrorBoundaryRoute path={`${match.url}/organization-error`} component={OrganizationError} />
      <ErrorBoundaryRoute path={`${match.url}/match-similarity`} component={MatchSimilarity} />
      <ErrorBoundaryRoute path={`${match.url}/activity-filter`} component={ActivityFilter} />
      <ErrorBoundaryRoute path={`${match.url}/taxonomy-group`} component={TaxonomyGroup} />
      <ErrorBoundaryRoute path={`${match.url}/fields-display-settings`} component={FieldsDisplaySettings} />
      <ErrorBoundaryRoute path={`${match.url}/location-fields-value`} component={LocationFieldsValue} />
      <ErrorBoundaryRoute path={`${match.url}/organization-fields-value`} component={OrganizationFieldsValue} />
      <ErrorBoundaryRoute path={`${match.url}/physical-address-fields-value`} component={PhysicalAddressFieldsValue} />
      <ErrorBoundaryRoute path={`${match.url}/postal-address-fields-value`} component={PostalAddressFieldsValue} />
      <ErrorBoundaryRoute path={`${match.url}/service-fields-value`} component={ServiceFieldsValue} />
      <ErrorBoundaryRoute path={`${match.url}/service-taxonomies-details-fields-value`} component={ServiceTaxonomiesDetailsFieldsValue} />
      <ErrorBoundaryRoute path={`${match.url}/contact-details-fields-value`} component={ContactDetailsFieldsValue} />
      <ErrorBoundaryRoute path={`${match.url}/request-logger`} component={RequestLogger} />
      <ErrorBoundaryRoute path={`${match.url}/daily-update`} component={DailyUpdate} />
      <ErrorBoundaryRoute path={`${match.url}/silo`} component={Silo} />
      <ErrorBoundaryRoute path={`${match.url}/user-group`} component={UserGroup} />
      <ErrorBoundaryRoute path={`${match.url}/beneficiary`} component={Beneficiary} />
      <ErrorBoundaryRoute path={`${match.url}/referral`} component={Referral} />
      {/* jhipster-needle-add-route-path - JHipster will routes here */}
    </Switch>
  </div>
);

export default Routes;
