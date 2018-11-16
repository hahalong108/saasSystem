import React, { Component } from 'react';
import {
  Tabs,
  Form,
  Icon,
  Modal,
  Radio,
  Input,
  Popconfirm,
  message,
  Button,
  Row,
  Col,
  Table,
  Select,
} from 'antd';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { CompanyCollection } from '../../components/Manage/CompanyCollection';
import styles from './Manage.less';
import '../../common.less';
import { permissionGrade, getTags } from '../../common.js';
import TitleItem from '../../components/common/TitleItem.js';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import $ from 'jquery';
import { productState } from '../../common';
import check from '../../components/Authorized/CheckPermissions';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const text = '是否确定删除节点与子节点?';
// var val = "";
// var flag = false;
@connect(({ manage, loading }) => ({
  manage,
  submitting: loading.effects['manage/companyTree'],
}))
@Form.create()
export default class ManageCompany extends Component {
  constructor(props) {
    super(props);
    this.state = {
      companyData: [],
      parentId: '',
      selectRecord: [],
      permission_ids: [],
      selected: false,
    };
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'manage/companyTree',
    });
  }

  componentWillReceiveProps(nextProps) {
    $('form').on('click', e => {
      const val = this.state.parentId;
      if (val === e.target.value) {
        this.setState({
          parentId: '',
        });
      }
    });
    const next = nextProps.manage;
    var data = [];
    if (!!next.companyData && next.returnType === 'companyTree' && next.resultCode === 1000) {
      this.dealTreeNode(next.companyData.treeNode);
      data = next.companyData.treeNode.children;
      this.setState({
        companyData: data,
        selectRecord: [],
      });
    }
    if (next.returnType === 'deleteCompany' && next.resultCode === 1000) {
      next.returnType = '';

      message.success(`删除成功！`);
      this.setState({
        parentId: '',
        selectRecord: [],
        permission_ids: [],
      });
      this.props.dispatch({
        type: 'manage/companyTree',
      });
    }
    if (next.returnType === 'deleteCompany' && next.resultCode !== 1000) {
      next.returnType = '';
      message.error(next.desc);
    }
    if (next.resultCode === 1000 && next.returnType === 'createCompany') {
      this.setState({ parentId: '' });
    }
    if (next.resultCode === 1000 && next.returnType === 'updateCompany') {
      this.setState({ parentId: '' });
    }
  }

  //获取节点所有的子节点id
  getChildId = (node, deleteIds) => {
    deleteIds.push(node.key);
    if (node.children !== null) {
      for (var i = 0; i < node.children.length; i++) {
        this.getChildId(node.children[i], deleteIds);
      }
    }
  };

  //将最底层children置为null
  dealTreeNode = node => {
    if (node.leaf) {
      node.children = null;
    } else {
      for (var i = 0; i < node.children.length; i++) {
        this.dealTreeNode(node.children[i]);
      }
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'manage/selectPermissionName',
          payload: {
            values,
          },
        });
      }
    });
  };
  deleteBtn = () => {
    this.props.dispatch({
      type: 'manage/deleteCompany',
      payload: {
        groupId: this.state.permission_ids[0],
        subGroupIds: this.state.permission_ids.slice(1, this.state.permission_ids.length - 1),
        groupType: this.state.selectRecord.groupType,
      },
    });
  };
  errMsg = () => {
    message.error('请选择删除节点');
  };
  test = () => {
    this.setState({
      parentId: '',
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 14,
      },
    };

    // 标记tag   图标icon
    const columns = [
      {
        title: '公司/部门名称',
        dataIndex: 'title',
        key: 'title',
      },
    ];

    // rowSelection objects indicates the need for row selection
    const rowSelection = {
      onSelect: (record, selected, selectedRows) => {
        var deleteIds = [];
        this.getChildId(record, deleteIds);
        this.setState({
          parentId: record.key,
          selectRecord: record,
          permission_ids: deleteIds,
          selected: selected,
        });
      },
      type: 'radio',
      selectedRowKeys: this.state.parentId,
    };
    return (
      <PageHeaderLayout>
        <div className={styles.container}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark>
            <Row style={{ width: '100%' }}>
              <Col>
                <FormItem>
                  <TitleItem title="公司/部门管理" />
                  {getTags().indexOf('group-add') != -1 && (
                    <CompanyCollection
                      parentId={this.state.parentId}
                      selectRecord={this.state.selectRecord}
                      tag_btn="新增"
                    />
                  )}
                  {getTags().indexOf('group-delete') != -1 && (
                    <Popconfirm
                      placement="bottomRight"
                      title={text}
                      onConfirm={this.state.permission_id === '' ? this.errMsg : this.deleteBtn}
                      okText="确定"
                      cancelText="取消"
                    >
                      <Button className={styles.btn}>删除</Button>
                    </Popconfirm>
                  )}
                  {getTags().indexOf('group-update') != -1 && (
                    <CompanyCollection
                      parentId={this.state.parentId}
                      selectRecord={this.state.selectRecord}
                      tag_btn="修改"
                    />
                  )}

                </FormItem>
              </Col>
            </Row>
            <Table
              columns={columns}
              rowSelection={rowSelection}
              dataSource={this.state.companyData}
              pagination={false}
              bordered={true}
              childrenColumnName="children"
              rowKey={record => record.key}
              loading={this.props.submitting}
            />
          </Form>
        </div>
      </PageHeaderLayout>
    );
  }
}
