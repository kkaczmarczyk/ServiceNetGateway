import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import {
  Translate,
  translate,
  ICrudGetAllAction,
  TextFormat,
  JhiPagination,
  getPaginationItemsNumber,
  getSortState,
  IPaginationBaseState
} from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PageSizeSelector from '../page-size-selector';
import { IRootState } from 'app/shared/reducers';
import { getEntities, updateEntity } from './physical-address.reducer';
import { ITEMS_PER_PAGE_ENTITY, MAX_BUTTONS, FIRST_PAGE } from 'app/shared/util/pagination.constants';
import { IPhysicalAddress } from 'app/shared/model/physical-address.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import _ from 'lodash';
import queryString from 'query-string';

export interface IPhysicalAddressProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export interface IPhysicalAddressState extends IPaginationBaseState {
  dropdownOpenTop: boolean;
  dropdownOpenBottom: boolean;
  itemsPerPage: number;
}

export class PhysicalAddress extends React.Component<IPhysicalAddressProps, IPhysicalAddressState> {
  constructor(props) {
    super(props);

    this.toggleTop = this.toggleTop.bind(this);
    this.toggleBottom = this.toggleBottom.bind(this);
    this.select = this.select.bind(this);
    JhiPagination.bind(this);
    PageSizeSelector.bind(this);
    this.state = {
      dropdownOpenTop: false,
      dropdownOpenBottom: false,
      itemsPerPage: ITEMS_PER_PAGE_ENTITY,
      ...getSortState(this.props.location, ITEMS_PER_PAGE_ENTITY)
    };
  }

  componentDidMount() {
    if (!_.isEqual(this.props.location.search, '')) {
      const fetchPageData = queryString.parse(this.props.location.search);
      this.setCustomState(fetchPageData.page, fetchPageData.itemsPerPage, fetchPageData.sort);
    } else {
      this.getEntities();
    }
  }

  componentDidUpdate(prevProps) {
    if (!(this.props.location === prevProps.location) && !(this.props.location.search === '')) {
      const fetchPageData = queryString.parse(this.props.location.search);
      this.setCustomState(fetchPageData.page, fetchPageData.itemsPerPage, fetchPageData.sort);
    }
    if (!(this.props.location === prevProps.location) && this.props.location.search === '') {
      this.setCustomState(FIRST_PAGE, ITEMS_PER_PAGE_ENTITY, this.state.sort);
    }
  }

  setCustomState(page, items, sort) {
    this.setState({
      activePage: Number(page),
      itemsPerPage: Number(items),
      ...getSortState(this.props.location, items)
    });
    this.props.getEntities(Number(page) - 1, Number(items), `${sort}`);
  }

  sort = prop => () => {
    this.setState(
      {
        order: this.state.order === 'asc' ? 'desc' : 'asc',
        sort: prop
      },
      () => this.updatePage()
    );
  };

  handlePagination = activePage => this.setState({ activePage }, () => this.updatePage());

  getEntities = () => {
    const { activePage, itemsPerPage, sort, order } = this.state;
    this.props.getEntities(activePage - 1, itemsPerPage, `${sort},${order}`);
  };

  toggleTop() {
    this.setState({ dropdownOpenTop: !this.state.dropdownOpenTop });
  }

  toggleBottom() {
    this.setState({ dropdownOpenBottom: !this.state.dropdownOpenBottom });
  }

  select = prop => () => {
    this.setState(
      {
        itemsPerPage: prop,
        activePage: FIRST_PAGE
      },
      () => this.updatePage()
    );
  };

  updatePage() {
    this.getEntities();
    window.scrollTo(0, 0);
    const { activePage, sort, order, itemsPerPage } = this.state;
    this.props.history.push({
      pathname: `${this.props.location.pathname}`,
      search: `?page=${activePage}&sort=${sort},${order}&itemsPerPage=${itemsPerPage}`
    });
  }

  render() {
    const { physicalAddressList, match, totalItems } = this.props;
    return (
      <div>
        <h2 id="physical-address-heading">
          <Translate contentKey="serviceNetApp.physicalAddress.home.title">Physical Addresses</Translate>
          <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="serviceNetApp.physicalAddress.home.createLabel">Create new Physical Address</Translate>
          </Link>
        </h2>
        <Row className="justify-content-center">
          <PageSizeSelector
            dropdownOpen={this.state.dropdownOpenTop}
            toggleSelect={this.toggleTop}
            itemsPerPage={this.state.itemsPerPage}
            selectFunc={this.select}
          />
          <JhiPagination
            items={getPaginationItemsNumber(totalItems, this.state.itemsPerPage)}
            activePage={this.state.activePage}
            onSelect={this.handlePagination}
            maxButtons={MAX_BUTTONS}
          />
        </Row>
        <div className="table-responsive">
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={this.sort('id')}>
                  <Translate contentKey="global.field.id">ID</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={this.sort('attention')}>
                  <Translate contentKey="serviceNetApp.physicalAddress.attention">Attention</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={this.sort('address1')}>
                  <Translate contentKey="serviceNetApp.physicalAddress.address1">Address 1</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={this.sort('address2')}>
                  <Translate contentKey="serviceNetApp.physicalAddress.address2">Address 2</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={this.sort('city')}>
                  <Translate contentKey="serviceNetApp.physicalAddress.city">City</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={this.sort('region')}>
                  <Translate contentKey="serviceNetApp.physicalAddress.region">Region</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={this.sort('stateProvince')}>
                  <Translate contentKey="serviceNetApp.physicalAddress.stateProvince">State Province</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={this.sort('postalCode')}>
                  <Translate contentKey="serviceNetApp.physicalAddress.postalCode">Postal Code</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={this.sort('country')}>
                  <Translate contentKey="serviceNetApp.physicalAddress.country">Country</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={this.sort('location.name')}>
                  <Translate contentKey="serviceNetApp.physicalAddress.location">Location</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {physicalAddressList.map((physicalAddress, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${physicalAddress.id}`} color="link" size="sm">
                      {physicalAddress.id}
                    </Button>
                  </td>
                  <td>{physicalAddress.attention}</td>
                  <td>{physicalAddress.address1}</td>
                  <td>{physicalAddress.address2}</td>
                  <td>{physicalAddress.city}</td>
                  <td>{physicalAddress.region}</td>
                  <td>{physicalAddress.stateProvince}</td>
                  <td>{physicalAddress.postalCode}</td>
                  <td>{physicalAddress.country}</td>
                  <td>
                    {physicalAddress.locationName ? (
                      <Link to={`location/${physicalAddress.locationId}`}>{physicalAddress.locationName}</Link>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${physicalAddress.id}`} color="info" size="sm">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${physicalAddress.id}/edit`} color="primary" size="sm">
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${physicalAddress.id}/delete`} color="danger" size="sm">
                        <FontAwesomeIcon icon="trash" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.delete">Delete</Translate>
                        </span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        <Row className="justify-content-center">
          <PageSizeSelector
            dropdownOpen={this.state.dropdownOpenBottom}
            toggleSelect={this.toggleBottom}
            itemsPerPage={this.state.itemsPerPage}
            selectFunc={this.select}
          />
          <JhiPagination
            items={getPaginationItemsNumber(totalItems, this.state.itemsPerPage)}
            activePage={this.state.activePage}
            onSelect={this.handlePagination}
            maxButtons={MAX_BUTTONS}
          />
        </Row>
      </div>
    );
  }
}

const mapStateToProps = ({ physicalAddress }: IRootState) => ({
  physicalAddressList: physicalAddress.entities,
  totalItems: physicalAddress.totalItems
});

const mapDispatchToProps = {
  getEntities,
  updateEntity
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PhysicalAddress);
