import React from "react";
import PropTypes from "prop-types";
import {
  FormGroup,
  Input,
  Row,
  Col,
  InputGroup,
  InputGroupAddon
} from "reactstrap";
import SearchIcon from "mdi-react/SearchIcon";
import { sortFormationsConst, sortstudyConst, sortOffersConst } from "../../../handler/utils/constants";
import Select from "../../../shared/components/Select";

class HeaderlisteFormations extends React.Component {
  static propTypes = {
    getStatus: PropTypes.func,
    onChangeSearch: PropTypes.func,
    getSort: PropTypes.func,
    getSort2: PropTypes.func,
    getSort3: PropTypes.func,
    status: PropTypes.string,
    field: PropTypes.string,
    field1: PropTypes.string,
    field2: PropTypes.string,
    direction: PropTypes.number,
    direction2: PropTypes.number,
    direction3: PropTypes.number,

    search: PropTypes.string
  };

  static defaultProps = {
    status: "PUBLISHED",
    field: "name",
    field1: "all",
    field2: "all",
    search: ""
  };
  constructor(props) {
    super(props);

    this.state = {
      status: props.status ? props.status : "PUBLISHED",
      field: props.field ? props.field : "name",
      field1: props.field1 ? props.field1 : "all",
      field2: props.field2 ? props.field2 : "all",
      direction: props.direction ? props.direction : 1,
      direction2: props.direction2 ? props.direction2 : 1,
      direction3: props.direction3 ? props.direction3 : 1,
      search: props.search ? props.search : ""
    };
  }

  onChange = e => {
    if (e.target) this.props.getStatus(e.target.id);
  };
  onChangeSearch = e => {
    this.setState({ search: e.target.value });
    this.props.onChangeSearch(e.target.value);
  };
  onSelect = (value, name) => {
    this.setState({ [name]: value });
    let array = value.split(";");
    this.props.getSort(array[0], parseInt(array[1]));
  };
  onSelect2 = (value, name) => {
    this.setState({ [name]: value });
    let array = value.split(";");
    this.props.getSort2(array[0], parseInt(array[1]));
  };
  onSelect3 = (value, name) => {
    this.setState({ [name]: value });
    let array = value.split(";");
    this.props.getSort3(array[0], parseInt(array[1]));
  };
  onSelectStatus = (value, name) => {
    this.setState({ [name]: value });
    this.props.getStatus(value);
  };

  render() {
    return (
      <div>
        <FormGroup tag="fieldset">
          <Row>
            <Col
              sm={3}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: 8
              }}>
              <InputGroup>
                <InputGroupAddon
                  addonType="prepend"
                  style={{
                    backgroundColor: "#e8e8e8",
                    width: "3em",
                    borderRadius: "24px 0px 0px 24px",
                    border: "1px solid #ced4da"
                  }}>
                  <SearchIcon
                    style={{
                      margin: "auto",
                      borderRadius: "24px 0px 0px 24px",
                      color: "#6b6b6b",
                      fontSize: "1.3em"
                    }}
                  />
                </InputGroupAddon>
                <Input
                  className="Profil-group__input"
                  placeholder="Rechercher..."
                  type="text"
                  value={this.state.search}
                  onChange={this.onChangeSearch}
                />
              </InputGroup>
            </Col>
            <Col
              sm={3}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: 8
              }} >
              <Select
                className="Profil-group__input"
                onSelect={this.onSelect}
                name={"direction"}
                optionLabel={"trier par"}
                items={sortOffersConst}
              />
            </Col>
            <Col
              sm={3}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: 8
              }} >
              <Select
                className="Profil-group__input"
                onSelect={this.onSelect2}
                name={"direction2"}
                optionLabel={"filter par"}
                items={sortstudyConst}
              />
            </Col>

            <Col
              sm={3}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: 8
              }}>
              <Select
                className="Profil-group__input"
                onSelect={this.onSelect3}
                name={"direction3"}
                optionLabel={"filter par"}
                items={sortFormationsConst}
              />
            </Col>
          </Row>
        </FormGroup>
      </div>
    );
  }
}

export default HeaderlisteFormations;
