import React, { Component } from 'react';
import {
  Tabs,
  Form,
  Icon,
  Modal,
  Radio,
  Divider,
  Pagination,
  Input,
  message,
  Button,
  Row,
  Col,
  Table,
  Select,
} from 'antd';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

export class LineCharts extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.initPieChart();
  }
  componentDidUpdate() {
    this.initPieChart();
  }
  initPieChart = () => {
    const { data, titleText, areaStyle, pieces } = this.props;
    let myChart = echarts.init(this.refs.pieChart);
    let options = this.setPieOption(data, titleText, areaStyle, pieces);
    myChart.setOption(options);
    myChart.resize();
  };
  setPieOption = (data, titleText, areaStyle, pieces) => {
    var yData = [];
    if (data.yValue !== undefined) {
      data.yValue.forEach((item, index) => {
        item.type = 'line';
        item.data = item.value;
        if (areaStyle) {
          console.log(1);
          item.areaStyle = { normal: {} };
        }
        yData.push(item);
        return yData;
      });
    }
    return {
      title: {
        text: titleText,
        top: 16,
        bottom: 16,
        left: 16,
        textStyle: {
          fontSize: 12,
          color: 'rgba(0,0,0,.65)',
        },
      },
      tooltip: {
        trigger: 'axis',
        formatter: function(value) {
          var arr = '';
          value.forEach(item => {
            arr += `${item.marker}${item.seriesName} : ${item.value} ${pieces}</br>`;
          });
          return arr;
        },
      },
      legend: {
        data: data.legend,
      },
      grid: {
        left: '16px',
        right: '16px',
        bottom: '16px',
        containLabel: true,
      },
      toolbox: {
        feature: {
          saveAsImage: {},
        },
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data.xValue,
      },
      yAxis: {
        type: 'value',
      },
      series: yData,
      color: [
        '#4CA5DD',
        '#4ABCD7',
        '#67BEA9',
        '#53B972',
        '#CBCE16',
        '#DDB704',
        '#F5A623',
        '#F56523',
        '#DA4315',
      ],
      backgroundColor: '#fff',
    };
  };

  render() {
    return <div ref="pieChart" style={{ width: '100%', height: 300 }} />;
  }
}
