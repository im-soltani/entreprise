/* eslint-disable react/no-array-index-key */
import React, { PureComponent } from "react";
import { Card, CardBody, Col } from "reactstrap";
import PropTypes from "prop-types";
import Icon from "../../../shared/components/Icon";
import { Link } from "react-router-dom";

class StatisticsCard extends PureComponent {
  static propTypes = {
    label: PropTypes.string,
    value: PropTypes.number,
    icon: PropTypes.string,
    link: PropTypes.string,
    to: PropTypes.string,
    labelClassName: PropTypes.string,
    iconContainerClassName: PropTypes.string,
    iconClassName: PropTypes.string,
    valueClassName: PropTypes.string
  };

  static defaultProps = {
    labelClassName: "",
    iconClassName: "",
    valueClassName: "",
    link: null,
    to: null
  };

  render() {
    const {
      label,
      value,
      icon,
      to,
      link,
      iconClassName,
      labelClassName,
      valueClassName
    } = this.props;
    return (
      <Col md={12} xl={3} lg={6} xs={12}>
        <Card style={{ paddingBottom: 0 }}>
          {link ? (
            <CardBody className="dashboard__card-widget nono_pad">
              <Link className="filesLink" to={link}>
                <div className="statistics-card__container">
                  <div
                    className="round font-size-medium mt-sm-3 btn btn-primary btn-block btn_of"
                    style={{ width: "90%", fontWeight: 600 }}>
                    {label}
                  </div>
                </div>
              </Link>
            </CardBody>
          ) : (
            <CardBody className="dashboard__card-widget">
              {to ? (
                <React.Fragment>
                  <Link to={to} className="statistics-card__container">
                    <div
                      className={`statistics-card__value ${valueClassName}`.trim()}>
                      {value}
                    </div>
                    <div
                      className={`statistics-card__label ${labelClassName}`.trim()}>
                      {label}
                    </div>
                  </Link>
                  <Link
                    to={to}
                    className={
                      "statistics-card__icon-container icon-container"
                    }>
                    <Icon
                      name={icon}
                      className={`statistics-card__icon ${iconClassName}`.trim()}
                    />
                  </Link>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <div className="statistics-card__container">
                    <div
                      className={`statistics-card__value ${valueClassName}`.trim()}>
                      {value}
                    </div>
                    <div
                      className={`statistics-card__label ${labelClassName}`.trim()}>
                      {label}
                    </div>
                  </div>
                  <div
                    className={
                      "statistics-card__icon-container icon-container"
                    }>
                    <Icon
                      name={icon}
                      className={`statistics-card__icon ${iconClassName}`.trim()}
                    />
                  </div>
                </React.Fragment>
              )}
              <div className="wall"></div>
            </CardBody>
          )}
        </Card>
      </Col>
    );
  }
}

export default StatisticsCard;
