import './record-edit.scss';

import React from 'react';
import { Badge, Button, Card, CardBody, CardTitle, Col, Collapse, Label, Row } from 'reactstrap';
import { TextFormat, Translate, translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { getProviderEntity, updateUserOwnedEntity } from 'app/entities/organization/organization.reducer';
import { IRootState } from 'app/shared/reducers';
import { AvField, AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { US_STATES } from 'app/shared/util/us-states';
import { getProviderTaxonomies } from 'app/entities/taxonomy/taxonomy.reducer';
import _ from 'lodash';
import AvSelect from '@availity/reactstrap-validation-select';
// @ts-ignore
import BuildingLogo from '../../../../static/images/building.svg';
// @ts-ignore
import PeopleLogo from '../../../../static/images/people.svg';
// @ts-ignore
import ServiceLogo from '../../../../static/images/service.svg';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { APP_DATE_FORMAT } from 'app/config/constants';

export interface IRecordEditViewProp extends StateProps, DispatchProps, RouteComponentProps<{id: string}> {}

export interface IRecordEditViewState {
  locations: object[];
  services: object[];
  openSections: string[];
  invalidSections: string[];
  openLocation: number;
  openService: number;
  invalidLocations: number[];
  invalidServices: number[];
  latestDailyUpdate: any;
}

const ORGANIZATION = 'organization';
const LOCATION = 'location';
const SERVICE = 'service';

const locationModel = {
  address1: '',
  address2: '',
  city: '',
  ca: 'CA',
  zipcode: ''
};

const serviceModel = {
  locationIndexes: []
};

export class RecordEdit extends React.Component<IRecordEditViewProp, IRecordEditViewState> {
  state: IRecordEditViewState = {
    locations: [{ ...locationModel }],
    services: [{ ...serviceModel }],
    openSections: [],
    invalidSections: [],
    invalidLocations: [],
    invalidServices: [],
    openLocation: -1,
    openService: -1,
    latestDailyUpdate: {}
  };

  componentDidMount() {
    this.props.getProviderTaxonomies();
    this.props.getProviderEntity(this.props.match.params.id);
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.updateSuccess !== this.props.updateSuccess && nextProps.updateSuccess) {
      this.props.history.push('/');
    }
  }

  componentDidUpdate(prevProps: Readonly<IRecordEditViewProp>, prevState: Readonly<IRecordEditViewState>) {
    if (prevProps.organization !== this.props.organization) {
      this.setState({
        locations: this.props.organization.locations || this.state.locations,
        services: this.props.organization.services || this.state.services,
        latestDailyUpdate: this.props.organization.dailyUpdates.find(du => du.expiry === null) || {}
      });
    }
  }

  toggle = section => () => this.setState({
    openSections: _.xor(this.state.openSections, [section])
  });

  saveRecord = (event, errors, values) => {
    const invalidSections = [];
    const invalidLocations = [];
    const invalidServices = [];
    const { openSections } = this.state;
    values.updatedAt = new Date();

    if (errors.length === 0) {
      const entity = {
        ...values
      };
      this.props.updateUserOwnedEntity(entity);
    } else {
      const indexRegexp = /(?<=\[).+?(?=])/;
      errors.forEach(err => {
        if (err.includes(LOCATION)) {
          invalidSections.indexOf(LOCATION) === -1 && invalidSections.push(LOCATION);
          openSections.indexOf(LOCATION) === -1 && openSections.push(LOCATION);
          const matches = indexRegexp.exec(err);
          if (matches) {
            invalidLocations.push(parseInt(matches[0], 10));
          }
        }
        if (err.includes(SERVICE)) {
          invalidSections.indexOf(SERVICE) === -1 && invalidSections.push(SERVICE);
          openSections.indexOf(SERVICE) === -1 && openSections.push(SERVICE);
          const matches = indexRegexp.exec(err);
          if (matches) {
            invalidServices.push(parseInt(matches[0][0], 10));
          }
        }
      });
      if (errors.some(err => !err.includes(LOCATION) && !err.includes(SERVICE) && err !== 'name')) {
        invalidSections.push(ORGANIZATION);
        openSections.indexOf(ORGANIZATION) === -1 && openSections.push(ORGANIZATION);
      }
    }
    this.setState({ invalidSections, invalidServices, invalidLocations, openSections });
  };

  addAnotherService = () => {
    const services = this.state.services.concat({ ...serviceModel });
    this.setState({
      services,
      openService: services.length - 1
    });
  };

  addAnotherLocation = () => {
    const locations = this.state.locations.concat({ ...locationModel });
    this.setState({
      locations,
      openLocation: locations.length - 1
    });
  };

  removeService = () => {
    const { services } = this.state;
    if (services.length > 1) {
      services.pop();
      this.setState({
        services
      });
    }
  };

  removeLocation = () => {
    const { locations, services } = this.state;
    if (locations.length > 1) {
      locations.pop();
      // filter out this location from services
      services.forEach(service => service['locationIndexes'] = service['locationIndexes'].filter(
        value => value !== locations.length));
      this.setState({
        locations,
        services
      });
    }
  };

  getLocations = () =>
    this.state.locations.map((location, i) => (
      { value: i, label: i + '. ' + [location['address1'], location['address2'], location['city']].filter(item => item).join(', ') }
    ));

  onLocationChange = (i, fieldName) => ({ target }) => {
    const locations = this.state.locations;
    locations[i][fieldName] = target.value;
    this.setState({
      locations
    });
  };

  onServiceChange = (i, fieldName, defaultValue = null) => event => {
    const services = this.state.services;
    let value = (event != null && event.target) ? event.target.value : event;
    if (value == null) {
      value = defaultValue;
    }
    services[i][fieldName] = value;
    this.setState({
      services
    });
  };

  openLocation = i => () => {
    this.setState({
      openLocation: i
    });
  }

  openService = i => () => {
    this.setState({
      openService: i
    });
  }

  render() {
    const { openSections, locations, services, openLocation, openService, latestDailyUpdate,
      invalidSections, invalidLocations, invalidServices } = this.state;
    const { updating, taxonomyOptions, organization } = this.props;
    return organization.id ? (
      <AvForm onSubmit={this.saveRecord} className="record-edit background" model={organization}>
        <div className="col-md-10 offset-md-1 col-lg-8 offset-lg-2">
          <AvField name="id" value={organization.id} className="d-none" />
          <Card className="section">
            <CardTitle>
              Updating Your Record
            </CardTitle>
            <CardBody>
              <AvField
                id="organization-name"
                type="text"
                name="name"
                validate={{
                  required: { value: true, errorMessage: translate('entity.validation.required') }
                }}
                placeholder={translate('record.name')}
              />
            </CardBody>
          </Card>
          <Card className="section">
            <CardTitle>
              <span>Any Daily Updates? (Last Updated:&nbsp;</span>
              {latestDailyUpdate.createdAt ? (
                <TextFormat value={latestDailyUpdate.createdAt} type="date" format={APP_DATE_FORMAT} blankOnInvalid />
              ) : (
                <Translate contentKey="recordCard.unknown" />
              )})
            </CardTitle>
            <CardBody>
              <AvInput
                id="daily-update"
                type="textarea"
                name="update"
                value={latestDailyUpdate.update}
              />
            </CardBody>
          </Card>
          <Card className="section expandable">
            <CardTitle onClick={this.toggle(ORGANIZATION)} className="clickable">
              <img src={PeopleLogo} height={25} alt="Organization" />
              Update Organization Details
              <FontAwesomeIcon icon={openSections.includes(ORGANIZATION) ? 'angle-up' : 'angle-down'} className="pull-right" size="lg"/>
            </CardTitle>
            <Collapse isOpen={openSections.includes(ORGANIZATION)}>
              <CardBody>
                <AvGroup>
                  <Label>{translate('record.description')}</Label>
                  <AvInput
                    id="organization-description"
                    type="textarea"
                    name="description"
                  />
                </AvGroup>
                <AvGroup>
                  <Label>{translate('record.url')}</Label>
                  <AvField
                    id="organization-url"
                    type="text"
                    name="url"
                  />
                </AvGroup>
                <AvGroup>
                  <Label>{translate('record.email')}</Label>
                  <AvField
                    id="organization-email"
                    type="text"
                    name="email"
                    validate={{
                      maxLength: { value: 50, errorMessage: translate('entity.validation.maxlength', { max: 50 }) }
                    }}
                  />
                </AvGroup>
              </CardBody>
            </Collapse>
          </Card>
          <Card className="section expandable">
            <CardTitle onClick={this.toggle(LOCATION)} className="clickable">
              <img src={BuildingLogo} height={25} alt="Location" />
              Location Details
              <Badge color="light" pill>{locations.length}</Badge>
              <FontAwesomeIcon icon={openSections.includes(LOCATION) ? 'angle-up' : 'angle-down'} className="pull-right" size="lg"/>
            </CardTitle>
            <Collapse isOpen={openSections.includes(LOCATION)}>
              <CardBody>
                {locations && locations.map((location, i) =>
                    <div key={'location-' + i} className={openLocation === -1 ? 'd-inline-block' : 'd-block'}>
                    <Card className={openLocation === -1 ? invalidLocations.includes(i) ? 'invalid clickable card-sm' : 'clickable card-sm' : 'd-none'}>
                      <CardBody onClick={this.openLocation(i)} className={'location d-flex flex-row'}>
                        <div className="card-left">
                          <FontAwesomeIcon icon="pencil-alt" />
                        </div>
                        <div className="card-right">
                          <div>
                            <div className="card-heading">
                              <FontAwesomeIcon icon={faCircle} className="edit" /> {location['city']}, {location['ca']}
                            </div>
                            <div>{location['address1']}</div>
                            <div>{location['address2']}</div>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                    <Card className={openLocation === i ? '' : 'd-none'}>
                      <Button onClick={this.openLocation(-1)} className="mb-2"><FontAwesomeIcon icon="arrow-left" /> Back to All Locations</Button>
                      <CardBody>
                        {location['id'] ? <AvField name={'locations[' + i + '].id'} value={location['id']} className="d-none" /> : ''}
                        <AvGroup>
                          <div className="flex">
                            <div className="required" />
                            <Label>{translate('record.location.address1')}</Label>
                          </div>
                          <AvInput
                            type="textarea"
                            name={'locations[' + i + '].address1'}
                            validate={{
                              required: { value: true, errorMessage: translate('entity.validation.required') }
                            }}
                            onChange={this.onLocationChange(i, 'address1')}
                          />
                        </AvGroup>
                        <AvGroup>
                          <Label>{translate('record.location.address2')}</Label>
                          <AvInput
                            type="textarea"
                            name={'locations[' + i + '].address2'}
                            onChange={this.onLocationChange(i, 'address2')}
                          />
                        </AvGroup>
                        <Row>
                          <Col md={7} className="flex mb-3">
                            <div className="required" />
                            <AvInput
                              type="text"
                              name={'locations[' + i + '].city'}
                              onChange={this.onLocationChange(i, 'city')}
                              placeholder={translate('record.location.city')}
                              validate={{
                                required: { value: true, errorMessage: translate('entity.validation.required') }
                              }}
                            />
                          </Col>
                          <Col md={2} className="flex mb-3">
                            <div className="required" />
                            <AvField
                              type="select"
                              name={'locations[' + i + '].ca'}
                              onChange={this.onLocationChange(i, 'ca')}
                              placeholder={translate('record.location.ca')}
                              value={locationModel['ca']}
                              validate={{
                                required: { value: true, errorMessage: translate('entity.validation.required') }
                              }}
                              style={{ 'minWidth': '5em' }}
                            >
                              {US_STATES.map(state => (
                                <option value={state} key={state}>
                                  {state}
                                </option>
                              ))}
                            </AvField>
                          </Col>
                          <Col md={3} className="flex mb-3">
                            <div className="required" />
                            <AvInput
                              type="text"
                              name={'locations[' + i + '].zipcode'}
                              onChange={this.onLocationChange(i, 'zipcode')}
                              placeholder={translate('record.location.zipcode')}
                              validate={{
                                required: { value: true, errorMessage: translate('entity.validation.required') }
                              }}
                            />
                          </Col>
                        </Row>
                        <Button onClick={this.openLocation(-1)} className="pull-right">Done</Button>
                      </CardBody>
                    </Card>
                </div>
                )}
                <div className={openLocation === -1 ? 'buttons list-buttons' : 'd-none'}>
                  {locations.length === 1 ? null :
                    <Button onClick={this.removeLocation}>
                      <Translate contentKey="record.remove"/>
                    </Button>
                  }
                  <Button onClick={this.addAnotherLocation} className="add-another">
                    + <Translate contentKey="record.addAnother" />
                  </Button>
                </div>
              </CardBody>
            </Collapse>
          </Card>
          <Card className="section expandable">
            <CardTitle onClick={this.toggle(SERVICE)} className="clickable">
              <img src={ServiceLogo} height={25} alt="Service" />
              Service Details
              <Badge color="light" pill>{services.length}</Badge>
              <FontAwesomeIcon icon={openSections.includes(SERVICE) ? 'angle-up' : 'angle-down'} className="pull-right" size="lg"/>
            </CardTitle>
            <Collapse isOpen={openSections.includes(SERVICE)}>
              <CardBody>
                {services && services.map((service, i) =>
                  <div key={'service-' + i} className={openService === -1 ? 'd-inline-block' : 'd-block'}>
                    <Card className={openService === -1 ? invalidServices.includes(i) ? 'invalid clickable card-sm' : 'clickable card-sm' : 'd-none'}>
                      <CardBody onClick={this.openService(i)} className={'service d-flex flex-row'}>
                        <div className="card-left">
                          <FontAwesomeIcon icon="pencil-alt" />
                        </div>
                        <div className="card-right">
                          <div>
                            <div className="card-heading">
                              <FontAwesomeIcon icon={faCircle} className="edit" /> {service['name']}
                            </div>
                            <div className="pills record-card">{taxonomyOptions.filter(to =>
                              service['taxonomyIds'] && service['taxonomyIds'].indexOf(to.value) !== -1).map(to => (
                              <div className="pill pill-sm" key={to.value}>
                                <span>{to.label}</span>
                              </div>
                            ))}
                            </div>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                    <Card className={openService === i ? '' : 'd-none'}>
                      <Button onClick={this.openService(-1)} className="mb-2"><FontAwesomeIcon icon="arrow-left" /> Back to All Services</Button>
                      <CardBody className="service">
                        {service['id'] ? <AvField name={'services[' + i + '].id'} value={service['id']} className="d-none" /> : ''}
                        <AvGroup>
                          <div className="flex">
                            <div className="required" />
                            <Label>{translate('record.service.name')}</Label>
                          </div>
                          <AvInput
                            type="text"
                            name={'services[' + i + '].name'}
                            validate={{
                              required: { value: true, errorMessage: translate('entity.validation.required') }
                            }}
                            onChange={this.onServiceChange(i, 'name')}
                          />
                        </AvGroup>
                        <AvGroup>
                          <div className="flex">
                            <div className="required" />
                            <Label>{translate('record.service.type')}</Label>
                          </div>
                          <AvSelect
                            name={'services[' + i + '].taxonomyIds'}
                            validate={{
                              required: { value: true, errorMessage: translate('entity.validation.required') }
                            }}
                            options={taxonomyOptions}
                            onChange={this.onServiceChange(i, 'taxonomyIds')}
                            // @ts-ignore
                            isMulti
                          />
                        </AvGroup>
                        <AvGroup>
                          <div className="flex">
                            <div className="required" />
                            <Label>{translate('record.service.description')}</Label>
                          </div>
                          <AvInput
                            type="textarea"
                            name={'services[' + i + '].description'}
                            validate={{
                              required: { value: true, errorMessage: translate('entity.validation.required') }
                            }}
                            onChange={this.onServiceChange(i, 'description')}
                          />
                        </AvGroup>
                        <AvGroup>
                          <Label>{translate('record.service.applicationProcess')}</Label>
                          <AvInput
                            type="textarea"
                            name={'services[' + i + '].applicationProcess'}
                            onChange={this.onServiceChange(i, 'applicationProcess')}
                          />
                        </AvGroup>
                        <AvGroup>
                          <Label>{translate('record.service.eligibilityCriteria')}</Label>
                          <AvInput
                            type="textarea"
                            name={'services[' + i + '].eligibilityCriteria'}
                            onChange={this.onServiceChange(i, 'eligibilityCriteria')}
                          />
                        </AvGroup>
                        <AvGroup>
                          <Label>{translate('record.service.locations')}</Label>
                          <AvSelect
                            name={'services[' + i + '].locationIndexes'}
                            value={(services.length > i) ? services[i]['locationIndexes'] : []}
                            onChange={this.onServiceChange(i, 'locationIndexes', [])}
                            options={this.getLocations()}
                            // @ts-ignore
                            isMulti
                          />
                        </AvGroup>
                        <Button onClick={this.openService(-1)} className="pull-right">Done</Button>
                      </CardBody>
                    </Card>
                  </div>
                )}
                <div className={openService === -1 ? 'buttons list-buttons' : 'd-none'}>
                  {services.length === 1 ? null :
                    <Button onClick={this.removeService}>
                      <Translate contentKey="record.remove"/>
                    </Button>
                  }
                  <Button onClick={this.addAnotherService} className="add-another">
                    + <Translate contentKey="record.addAnother" />
                  </Button>
                </div>
              </CardBody>
            </Collapse>
          </Card>
          <div className="buttons navigation-buttons">
            <Button onClick={() => this.props.history.goBack()} className="go-back">
              Discard Changes
            </Button>
            <div className="pull-right">
              <Button id="submit" type="submit" disabled={updating} color="primary">
                <FontAwesomeIcon icon="save" />
                &nbsp;
                <Translate contentKey="record.navigation.submit" />
              </Button>
            </div>
          </div>
        </div>
      </AvForm>
    ) : '';
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  locations: storeState.location.entities,
  updating: storeState.organization.updating,
  updateSuccess: storeState.organization.updateSuccess,
  organization: storeState.organization.providersEntity,
  taxonomyOptions: storeState.taxonomy.providerTaxonomies.map(
    taxonomy => ({ value: taxonomy.id, label: taxonomy.name }))
});

const mapDispatchToProps = {
  getProviderTaxonomies,
  updateUserOwnedEntity,
  getProviderEntity
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecordEdit);
