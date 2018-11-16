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
import { AuthorityCollection } from '../../components/Manage/AuthorityCollection';
import styles from './Manage.less';
import '../../common.less';
import { permissionGrade, getTags } from '../../common.js';
import TitleItem from '../../components/common/TitleItem.js';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const text = '是否确定删除节点与子节点?';

@connect(({ manage, loading }) => ({
  manage,
  submitting: loading.effects['manage/initRoleTree'],
}))
@Form.create()
export default class ManageAuthority extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authorityData: [],
      parentId: '-1',
      permission_ids: [],
    };
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'manage/initRoleTree',
    });
  }

  componentWillReceiveProps(nextProps) {
    const next = nextProps.manage;
    const data = [];
    if (!!next.authorityData) {
      this.dealTreeNode(next.authorityData.treeNode);
      data.push(next.authorityData.treeNode);
      if (next.returnType === 'selectPermission' && next.resultCode === 1000) {
        this.setState({
          authorityData: data,
        });
      }
    }
    if (next.returnType === 'deletePermission' && next.resultCode === 1000) {
      next.resultCode = '0';
      message.success(next.desc);
      this.setState({
        parentId: '',
        permission_ids: [],
      });
      this.props.dispatch({
        type: 'manage/initRoleTree',
      });
    }
    if (
      next.returnType === 'deletePermission' &&
      next.resultCode !== 1000 &&
      isNaN(next.resultCode)
    ) {
      next.resultCode = '0';
      message.error(next.desc);
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
    if (this.state.parentId === '-1') {
      message.error('根节点不允许删除!');
      return false;
    }

    this.props.dispatch({
      type: 'manage/deletePermission',
      payload: this.state.permission_ids,
    });
  };
  errMsg = () => {
    message.error('请选择删除节点');
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
        title: '权限名称',
        dataIndex: 'title',
        key: 'title',
        render:(text, record, index,) =>{
          const wid = ((record.treeLevel-1)*20 + 25 ).toString()+'px';
          const a = `calc(100% - ${wid})`;
          return<span style={{width:a,wordWrap: 'break-word',display: 'inline-block',verticalAlign: 'top'}}>{text}</span>
        },
        width:'500px',
      },
      {
        title: '权限标签',
        dataIndex: 'tag',
        key: 'tag',
        align: 'center',
      },
      {
        title: '类型',
        dataIndex: 'grade',
        key: 'grade',
        align: 'center',
        render: (text, record, index) => permissionGrade[text],
      },
      {
        title: '跳转地址',
        dataIndex: 'href',
        key: 'href',
        align: 'center',
      },
      {
        title: '图标',
        dataIndex: 'icon',
        key: 'icon',
        align: 'center',
        render: text =>
          text && text.substr(0, 1) == '-' ? (
            <i type={text} className={`icon iconfont icon${text}`} />
          ) : (
            <Icon type={text} />
          ),
        // <Icon type={text}/>,
      },
    ];

    // rowSelection objects indicates the need for row selection
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      onSelect: (record, selected, selectedRows) => {
        // console.log(record, selected, selectedRows);
        var deleteIds = [];
        this.getChildId(record, deleteIds);
        this.setState({
          parentId: record.key,
          permission_ids: deleteIds,
        });
      },
      // onSelectAll: (selected, selectedRows, changeRows) => {
      //   console.log(selected, selectedRows, changeRows);
      // },
      type: 'radio',
      selectedRowKeys: this.state.parentId,
    };
    return (
      <PageHeaderLayout>
        <div className={styles.container}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark>
            <Row style={{ width: '100%' }}>
              <Col>
                {/*<FormItem {...formItemLayout} label="用户名" style={{ width: 300, float: 'left' }} >*/}
                {/*{getFieldDecorator('userName', {*/}
                {/*rules: [*/}
                {/*{*/}
                {/*required: true,*/}
                {/*message: '请输入用户名！',*/}
                {/*},*/}
                {/*],*/}
                {/*})(*/}
                {/*<Input placeholder="用户名" className={styles.antInputText} />*/}
                {/*)}*/}
                {/*</FormItem>*/}
                {/*<FormItem style={{ float: 'right' }}>*/}
                {/*/!* <Button type="primary" htmlType="submit" className={styles.btn}>查询</Button> *!/*/}
                {/*<Button icon="search" className={styles.btn} htmlType="submit">查询</Button>*/}
                {/*</FormItem>*/}
              </Col>
            </Row>
            <Row style={{ width: '100%' }}>
              <Col>
                <FormItem>
                  <TitleItem title="权限管理" />
                  {getTags().indexOf('permission-add') != -1 && (
                    <AuthorityCollection parentId={this.state.parentId} tag_btn="新增" />
                  )}
                  {getTags().indexOf('permission-delete') != -1 && (
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
                  {getTags().indexOf('permission-update') != -1 && (
                    <AuthorityCollection parentId={this.state.parentId} tag_btn="修改" />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Table
              columns={columns}
              rowSelection={rowSelection}
              dataSource={this.state.authorityData}
              pagination={false}
              bordered
              childrenColumnName="children"
              loading={this.props.submitting}
            />
          </Form>
        </div>
      </PageHeaderLayout>
    );
  }
}
