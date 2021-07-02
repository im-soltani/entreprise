import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import Panel from "../../../shared/components/Panel";
import * as moment from "moment";
import "moment/locale/es-us";
import PropTypes from "prop-types";
import { graphql } from "react-apollo";
import { GET_APPLICATIONS_STATS } from "../../../handler/queries";

class BounceRateArea extends React.PureComponent {
  static propTypes = {
    getApplicationsStatByWeekEnterprise: PropTypes.array,
    refetch: PropTypes.func
  };

  static defaultProps = {
    getApplicationsStatByWeekEnterprise: []
  };
  render() {
    const data = [
      {
        name: moment()
          .add(-6, "days")
          .format("DD/MM/YYYY"),
        nombre: this.props.getApplicationsStatByWeekEnterprise[6]
      },
      {
        name: moment()
          .add(-5, "days")
          .format("DD/MM/YYYY"),
        nombre: this.props.getApplicationsStatByWeekEnterprise[5]
      },
      {
        name: moment()
          .add(-4, "days")
          .format("DD/MM/YYYY"),
        nombre: this.props.getApplicationsStatByWeekEnterprise[4]
      },

      {
        name: moment()
          .add(-3, "days")
          .format("DD/MM/YYYY"),
        nombre: this.props.getApplicationsStatByWeekEnterprise[3]
      },
      {
        name: moment()
          .add(-2, "days")
          .format("DD/MM/YYYY"),
        nombre: this.props.getApplicationsStatByWeekEnterprise[2]
      },
      {
        name: moment()
          .add(-1, "days")
          .format("DD/MM/YYYY"),
        nombre: this.props.getApplicationsStatByWeekEnterprise[1]
      },
      {
        name: moment().format("DD/MM/YYYY"),
        nombre: this.props.getApplicationsStatByWeekEnterprise[0]
      }
    ];

    return (
      <Panel
        xl={12}
        lg={12}
        md={12}
        title="Candidatures par semaine"
        refetch={this.props.refetch}
      >
        <ResponsiveContainer height={300} className="dashboard__area">
          <AreaChart
            data={data}
            margin={{
              top: 0,
              right: 0,
              left: -15,
              bottom: 0
            }}
          >
            <XAxis dataKey="name" tickLine={false} />
            <YAxis tickLine={false} />
            <CartesianGrid vertical={false} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="nombre"
              stroke="#295ebe"
              fill="#e4b31d"
              fillOpacity={0.2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Panel>
    );
  }
}
export default graphql(GET_APPLICATIONS_STATS, {
  options: () => ({
    fetchPolicy: "cache-and-network"
  }),
  props: ({ data: { getApplicationsStatByWeekEnterprise, refetch } }) => ({
    getApplicationsStatByWeekEnterprise,
    refetch
  })
})(BounceRateArea);
