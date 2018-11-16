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
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

export class PieCharts extends React.Component {
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
    const { data, titleText } = this.props;
    let myChart = echarts.init(this.refs.pieChart);
    let options = this.setPieOption(data, titleText);
    myChart.setOption(options);
    myChart.resize();
  };
  setPieOption = (data, titleText) => {
    // var yData = [];

    if (data.series !== undefined) {
      data.series.forEach((item, index) => {
        item.name = item.item.substring(0, item.item.length - 2);
        item.value = item.count.substring(0, item.count.length - 2);
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
        trigger: 'item',
        formatter: function(value) {
          return `${value.data.name} : ${value.data.count}`;
        },
      },
      legend: {
        // orient: 'vertical',
        // top: 'middle',
        bottom: 10,
        left: 'center',
        data: data.legend,
      },
      grid: {
        top: '16px',
        left: '16',
        right: '16',
        bottom: '16',
        containLabel: true,
      },
      series: [
        {
          type: 'pie',
          radius: '65%',
          center: ['50%', '55%'],
          selectedMode: 'single',
          data: data.series,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
      // series: [
      //     {
      //         type: 'pie',
      //         radius: '65%',
      //         center: ['50%', '50%'],
      //         selectedMode: 'single',
      //         data: [
      //             { value: 535, name: '荆州' },
      //             { value: 510, name: '兖州' },
      //             { value: 634, name: '益州' },
      //             { value: 735, name: '西凉' },
      //         ],
      //         itemStyle: {
      //             emphasis: {
      //                 shadowBlur: 10,
      //                 shadowOffsetX: 0,
      //                 shadowColor: 'rgba(0, 0, 0, 0.5)',
      //             },
      //         },
      //     },
      // ],
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
