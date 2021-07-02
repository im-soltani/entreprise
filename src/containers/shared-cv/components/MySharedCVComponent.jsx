import React, { Component } from "react";
import {
  ReactiveBase,
  SingleList,
  DataController,
  ReactiveList,
  MultiList,
  SelectedFilters,
  DataSearch,
  ToggleButton,
} from "toolynk-reactivesearch";
import { Row, Col, Container } from "reactstrap";
import * as moment from "moment";
import CandidatItem from "../../candidat/components/CandidatItem";
import CollapseFilter from "../../../shared/components/CollapseFilter";
import FallbackSpinner from "../../../shared/components/FallbackSpinner";
import { experienceConst, etudeConst } from "../../../handler/utils/constants";
import Icon from "../../../shared/components/Icon";
import PropTypes from "prop-types";

class MyCVComponent extends Component {
  static propTypes = {
    type: PropTypes.string,
  };
  constructor(props) {
    super(props);
    this.state = {
      select: false,
      sort: "",
    };
  }

  onResultStats = (results, time) => (
    <div
      style={{
        justifyContent: "flex-end",
        marginLeft: "1%",
        marginTop: "1%",
        fontFamily: "Montserrat",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        marginTop: "10px",
      }}>
      <span style={{ fontSize: "14px" }}>
        {results} candidat(s) trouvé(s) en {time}
        ms
      </span>
    </div>
  );

  handleChange = (e) => {
    this.setState({ select: e.target.value });
  };
  render() {
    return (
      <Container id="app">
        <ReactiveBase
          app="boostmyjob"
          url="https://elastic.toolynk-lab.com"
          type="candidats">
          <Row className="MyCV-row__top">
            <Col
              md={3}
              lg={3}
              xl={3}
              style={{ marginRight: 0, paddingRight: 0 }}>
              <DataSearch
                componentId="SearchSensor"
                dataField={
                  [
                    "first_name",
                    "last_name",
                    "cv_eng_data",
                    "cv_data",
                    "contract",
                  ]
                  /* this.state.select === "name"
                    ? ["first_name", "last_name"]
                    : this.state.select === "in_cv"
                    ? ["cv_data"]
                    : ["cv_eng_data"] */
                }
                placeholder="Rechercher"
                queryFormat="or"
                fuzziness={1}
                fieldWeights={[1, 3, 5]}
                onSuggestion={(suggestion) => ({
                  label: (
                    <div>
                      <span
                        style={{
                          fontWeight: "500",
                          textTransform: "uppercase",
                          color: "rgba(41, 94, 190, 1)",
                          fontFamily: "Montserrat",
                        }}>
                        {suggestion._source.last_name}
                      </span>
                      <span
                        style={{
                          fontWeight: "500",
                          marginLeft: 2,
                          textTransform: "uppercase",
                          color: "rgba(41, 94, 190, 1)",
                          fontFamily: "Montserrat",
                        }}>
                        {suggestion._source.first_name}
                      </span>
                      {suggestion._source.jobs &&
                        suggestion._source.jobs.length > 0 && (
                          <span
                            style={{
                              fontWeight: "400",
                              marginLeft: 2,
                              textTransform: "capitalize",
                              fontFamily: "Montserrat",
                            }}>
                            <Icon className="MyCV-icon" name="candidat-brief" />{" "}
                            {suggestion._source.jobs}
                          </span>
                        )}
                      {suggestion._source.experience &&
                        suggestion._source.experience.length > 0 && (
                          <span
                            style={{
                              fontWeight: "400",
                              marginLeft: 2,
                              textTransform: "capitalize",
                              fontFamily: "Montserrat",
                            }}>
                            <Icon className="MyCV-icon" name="candidat-test" />
                            {
                              experienceConst.filter(
                                (etude) =>
                                  etude.value === suggestion._source.experience
                              )[0].label
                            }
                          </span>
                        )}
                      {suggestion._source.disponibility && (
                        <span
                          style={{
                            fontWeight: "400",
                            marginLeft: 2,
                            textTransform: "capitalize",
                            fontFamily: "Montserrat",
                          }}>
                          <Icon className="MyCV-icon" name="candidat-time" />
                          {moment(suggestion._source.disponibility).diff(
                            moment(),
                            "days"
                          ) > 0
                            ? " Dans " +
                              moment(suggestion._source.disponibility).diff(
                                moment(),
                                "days"
                              ) +
                              " jours"
                            : " Immédiate"}
                        </span>
                      )}
                    </div>
                  ),
                  value: suggestion._source.first_name,
                })}
                renderNoSuggestion={() => <div>Aucun résultat trouvé</div>}
                react={{
                  and: [
                    "MeetupTops",
                    "CompetenceSensor",
                    "jobSensor",
                    "citySensor",
                    "etudeSensor",
                    "experienceSensor",
                    "shareSensor",
                    "contractSensor",
                  ],
                }}
                showFilter={true}
                filterLabel="Recherche"
                URLParams={false}
              />
            </Col>
            <Col md={8} lg={8} xl={8} style={{ marginLeft: 0, paddingLeft: 0 }}>
              <ToggleButton
                componentId="MeetupTops"
                showSearch={false}
                showFilter={true}
                multiSelect={false}
                filterLabel={"CV"}
                dataField={[
                  "entreprises.id",
                  "entreprises.mycv",
                  "entreprises.isFavoris",
                ]}
                customQuery={(value, props) => {
                  if (props && value && value.length > 0) {
                    if (value[0].value === "CV coup de coeur") {
                      return {
                        query: {
                          bool: {
                            must: {
                              match_all: {},
                            },
                            filter: [
                              {
                                term: {
                                  "entreprises.mycv": true,
                                },
                              },
                              {
                                term: {
                                  "entreprises.id": localStorage.getItem("id"),
                                },
                              },
                              {
                                term: {
                                  "entreprises.isFavoris": true,
                                },
                              },
                            ],
                          },
                        },
                      };
                    } else if (value[0].value === "Mes CV") {
                      return {
                        query: {
                          bool: {
                            must: {
                              match_all: {},
                            },
                            filter: [
                              {
                                term: {
                                  "entreprises.mycv": true,
                                },
                              },
                              {
                                term: {
                                  "entreprises.id": localStorage.getItem("id"),
                                },
                              },
                            ],
                          },
                        },
                      };
                    } else if (value[0].value === "CV du réseau") {
                      return {
                        match: { shared: true },
                      };
                    }
                  }
                }}
                data={[
                  {
                    label: "CV du réseau",
                    value: "CV du réseau",
                  },
                  {
                    label: "Mes CV",
                    value: "Mes CV",
                  },
                  {
                    label: "CV coup de coeur",
                    value: "CV coup de coeur",
                  },
                ]}
                react={{
                  and: [
                    "SearchSensor",
                    "shareSensor",
                    "DataCmp",
                    "CompetenceSensor",
                    "jobSensor",
                    "citySensor",
                    "etudeSensor",
                    "experienceSensor",
                    "contractSensor",
                  ],
                }}
              />
              {/* <Input
                className="MyCV-search__select"
                value={this.state.select}
                type="select"
                name={"select"}
                onChange={e => this.handleChange(e)}
              >
                <option value={false} key={1}>
                  DANS TOUS MES CV
                </option>
                <option
                  style={{ textTransform: "uppercase" }}
                  value={true}
                  key={2}
                >
                  DANS MES FAVORIS
                </option>
              </Input>*/}
            </Col>
          </Row>
          <Row>
            <Col md={12} lg={4} xl={3} className="MyCV-col__left">
              <CollapseFilter
                label={"FILTRES"}
                icon={true}
                isOpen={true}
                className="MyCV-button__filter-name">
                <DataController
                  componentId="DataCmp"
                  dataField={["entreprises.id", "entreprises.mycv", "shared"]}
                  customQuery={() => ({
                    query: {
                      bool: {
                        should: [
                          {
                            term: { shared: true },
                          },
                          {
                            bool: {
                              must: [
                                {
                                  term: {
                                    "entreprises.id": localStorage.getItem(
                                      "id"
                                    ),
                                  },
                                },
                                { term: { "entreprises.mycv": true } },
                              ],
                            },
                          },
                          {
                            bool: {
                              must: [
                                {
                                  term: {
                                    "entreprises.mycv": true,
                                  },
                                },
                                {
                                  term: {
                                    "entreprises.id": localStorage.getItem(
                                      "id"
                                    ),
                                  },
                                },
                                {
                                  term: {
                                    "entreprises.isFavoris": true,
                                  },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                  })}
                  size={999999999}
                />
                <CollapseFilter isOpen={true} label={"Métier"}>
                  <MultiList
                    componentId="jobSensor"
                    placeholder="Rechercher"
                    queryFormat="or"
                    selectAllLabel="Tous"
                    filterLabel="Métiers"
                    dataField="jobs.keyword"
                    renderListItem={(label, count) => (
                      <div>
                        <span className="MyCV-label__filter">{label}</span>
                        <span className="MyCV-label__count">({count})</span>
                      </div>
                    )}
                    react={{
                      and: [
                        "MeetupTops",
                        "SearchSensor",
                        "DataCmp",
                        "shareSensor",
                        "CompetenceSensor",
                        "citySensor",
                        "etudeSensor",
                        "experienceSensor",
                        "contractSensor",
                      ],
                    }}
                  />
                </CollapseFilter>
                <CollapseFilter isOpen={true} label={"Expérience"}>
                  <SingleList
                    showSearch={false}
                    componentId="experienceSensor"
                    filterLabel="Expérience"
                    selectAllLabel="Toutes"
                    dataField="experience.keyword"
                    renderListItem={(label, count) => (
                      <div>
                        <span className="MyCV-label__filter">{label}</span>
                        <span className="MyCV-label__count">({count})</span>
                      </div>
                    )}
                    react={{
                      and: [
                        "MeetupTops",
                        "SearchSensor",
                        "shareSensor",
                        "DataCmp",
                        "competenceSensor",
                        "jobSensor",
                        "citySensor",
                        "etudeSensor",
                        "contractSensor",
                      ],
                    }}
                    // eslint-disable-next-line react/jsx-no-duplicate-props
                    renderListItem={(a, count) => (
                      <div>
                        <span className="MyCV-label__filter">
                          {
                            experienceConst.filter(
                              (etude) => etude.value === a
                            )[0].label
                          }
                        </span>
                        <span className="MyCV-label__count">({count})</span>
                      </div>
                    )}
                  />
                </CollapseFilter>
                <CollapseFilter isOpen={true} label={"Compétences"}>
                  <MultiList
                    componentId="CompetenceSensor"
                    placeholder="Rechercher"
                    queryFormat="or"
                    selectAllLabel="Toutes"
                    filterLabel="Compétences"
                    dataField="competences.keyword"
                    renderListItem={(label, count) => (
                      <div>
                        <span className="MyCV-label__filter">{label}</span>
                        <span className="MyCV-label__count">({count})</span>
                      </div>
                    )}
                    react={{
                      and: [
                        "MeetupTops",
                        "SearchSensor",
                        "shareSensor",
                        "DataCmp",
                        "jobSensor",
                        "citySensor",
                        "etudeSensor",
                        "experienceSensor",
                        "contractSensor",
                      ],
                    }}
                  />
                </CollapseFilter>
                <CollapseFilter label={"Partage"}>
                  <SingleList
                    componentId="shareSensor"
                    showSearch={false}
                    filterLabel="Partage"
                    selectAllLabel="Tous"
                    style={{ fontFamily: "Montserrat" }}
                    dataField="sharedby.keyword"
                    /*                     // eslint-disable-next-line react/jsx-no-bind
                    onQueryChange={function(prevQuery, nextQuery) {
                      // use the query with other js code
                      console.log("prevQuery", prevQuery);
                      console.log("nextQuery", nextQuery);
                      nextQuery.query = {
                        bool: {
                          should: [
                            {
                              term: { shared: true },
                            },
                            {
                              bool: {
                                must: [
                                  {
                                    term: {
                                      "entreprises.id": localStorage.getItem(
                                        "id"
                                      ),
                                    },
                                  },
                                  { term: { "entreprises.mycv": true } },
                                ],
                              },
                            },
                          ],
                        },
                      };
                      return nextQuery;
                    }} */

                    renderListItem={(label, count) => (
                      <div>
                        <span className="MyCV-label__filter">{label}</span>
                        <span className="MyCV-label__count">({count})</span>
                      </div>
                    )}
                    react={{
                      and: [
                        "SearchSensor",
                        "DataCmp",
                        "MeetupTops",
                        "CompetenceSensor",
                        "jobSensor",
                        "citySensor",
                        "etudeSensor",
                        "experienceSensor",
                        "DataSensor",
                      ],
                    }}
                  />
                </CollapseFilter>
                {/*  <CollapseFilter label={"Favoris"}>
                  <SingleDataList
                    componentId="MeetupTops"
                    showSearch={false}
                    dataField="entreprises.isFavoris"
                    data={[
                      {
                        label: "Mes favoris",
                        value: true
                      },
                      {
                        label: "Tous mes cv",
                        value: false
                      }
                    ]}
                    react={{
                      and: [
                        "SearchSensor","shareSensor","DataCmp",
                        "CompetenceSensor",
                        "jobSensor",
                        "citySensor",
                        "etudeSensor",
                        "experienceSensor",
                        
                        "contractSensor"
                      ]
                    }}
                  />
                </CollapseFilter> */}

                <CollapseFilter label={"Contrat"}>
                  <SingleList
                    componentId="contractSensor"
                    showSearch={false}
                    filterLabel="Contrat"
                    selectAllLabel="Tous"
                    dataField="contract.keyword"
                    renderListItem={(label, count) => (
                      <div>
                        <span className="MyCV-label__filter">{label}</span>
                        <span className="MyCV-label__count">({count})</span>
                      </div>
                    )}
                    react={{
                      and: [
                        "MeetupTops",
                        "SearchSensor",
                        "shareSensor",
                        "DataCmp",
                        "CompetenceSensor",
                        "jobSensor",
                        "citySensor",
                        "etudeSensor",
                        "experienceSensor",
                      ],
                    }}
                  />
                </CollapseFilter>
                <CollapseFilter label={"Niveau d'étude"}>
                  <SingleList
                    componentId="etudeSensor"
                    showSearch={false}
                    filterLabel="étude"
                    selectAllLabel="Tous"
                    dataField="etude.keyword"
                    renderListItem={(label, count) => (
                      <div>
                        <span className="MyCV-label__filter">
                          {
                            etudeConst.filter(
                              (etude) => etude.value === label
                            )[0].label
                          }
                        </span>
                        <span className="MyCV-label__count">({count})</span>
                      </div>
                    )}
                    react={{
                      and: [
                        "MeetupTops",
                        "SearchSensor",
                        "shareSensor",
                        "DataCmp",
                        "CompetenceSensor",
                        "jobSensor",
                        "citySensor",
                        "experienceSensor",
                        "contractSensor",
                      ],
                    }}
                  />
                </CollapseFilter>
                <CollapseFilter label={"Localisation"}>
                  <SingleList
                    componentId="citySensor"
                    placeholder="Ville"
                    filterLabel="Ville"
                    selectAllLabel="Toutes"
                    dataField="city.keyword"
                    renderListItem={(label, count) => (
                      <div>
                        <span className="MyCV-label__filter">{label}</span>
                        <span className="MyCV-label__count">({count})</span>
                      </div>
                    )}
                    react={{
                      and: [
                        "MeetupTops",
                        "SearchSensor",
                        "shareSensor",
                        "DataCmp",
                        "competenceSensor",
                        "jobSensor",
                        "experienceSensor",
                        "etudeSensor",
                        "contractSensor",
                      ],
                    }}
                  />
                </CollapseFilter>
              </CollapseFilter>
            </Col>

            <Col md={12} lg={8} xl={9}>
              <SelectedFilters showClearAll={true} clearAllLabel="Effacer" />
              <ReactiveList
                componentId="SearchResult"
                dataField="first_name.keyword"
                className="result-list-container"
                onResultStats={this.onResultStats}
                pagination
                size={8}
                sortOptions={[
                  {
                    label: "LES PLUS RéCENTS",
                    dataField: "createdAt",
                    sortBy: "desc",
                  },
                  {
                    label: "DISPONIBILITé",
                    dataField: "disponibility",
                    sortBy: "asc",
                  },
                ]}
                onNoResults="Aucun candidat n'a été trouvé"
                loader={<FallbackSpinner />}
                onError={(err) => console.log(err)}
                onData={(data) => this.onData(data)}
                react={{
                  and: [
                    "MeetupTops",
                    "SearchSensor",
                    "shareSensor",
                    "DataCmp",
                    "CompetenceSensor",
                    "jobSensor",
                    "citySensor",
                    "etudeSensor",
                    "experienceSensor",
                    "contractSensor",
                  ],
                }}
              />
            </Col>
          </Row>
        </ReactiveBase>
      </Container>
    );
  }

  onData = (data) => (
    <CandidatItem candidat={data} key={data._id} shared={false} />
  );
}
export default MyCVComponent;
