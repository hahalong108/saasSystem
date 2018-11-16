import React, { Component } from 'react';
import {
  Tabs,
  Form,
  Icon,
  Input,
  Button,
  Row,
  Col,
  Table,
  Select,
  Modal,
  Pagination,
  Divider,
  Cascader,
  Popconfirm,
  message,
} from 'antd';
import styles from './Manage.less';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import CreateNewUserModal from './CreateNewUserModal.js';
import UpdateUserModal from './UpdateUserModal.js';
import SetRoleForUser from './SetRoleForUser.js';
import jqy from 'jquery';
import { pageSize, userStateConst, userTypeConst, getTags } from '../../common.js';
import TitleItem from '../../components/common/TitleItem.js';
import '../../common.less';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const Option = Select.Option;

@connect(({ manage, loading }) => ({
  manage,
  submitting: loading.effects['manage/submit'],
}))
@Form.create()
export default class ManageUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [], //用戶信息列表
      list: [], //companyId列表
      page: {},
      selectedRowKeys: [],
      loading: false,
      deleteUserId: [],
      visible: false,
      userName: '',
      userType: { key: '0' },
      companyId: { key: '0' },
      state: { key: '0' },
      current: '',
      count: 0,
      editVisible: false,
      addRoleOfUserId: '',
      setRoleVisible: false,
      allRoles: [],
      treeData: [],
      rolesList: [],
      userMassage: {},
      updataOfUserId: '',
      leafIdOfCreate: '',
      leafIdOfUpdate: '',
      pageSize: pageSize,

      departmentId: '',
      clickTag: false,
      selectId: false,
      userPhone: '',
      userMail: '',
      treeDatas: [],
    };
  }
  componentWillMount() {
    this.props.dispatch({
      type: 'manage/getCompanyId',
    });
    this.props.dispatch({
      type: 'manage/submit',
      payload: {
        searchParams: {
          userName: this.state.userName,
          userType: this.state.userType.key,
          companyId: this.state.companyId.key,
          state: this.state.state.key,
          userPhone: this.state.userPhone,
          userMail: this.state.userMail,
        },
        page: {
          size: this.state.pageSize,
          curpage: 1,
        },
      },
    });
    this.props.dispatch({
      type: 'manage/getRole',
    });
  }
  componentDidMount() {}
  componentWillReceiveProps(nextProps) {
    const next = nextProps.manage;
    if (next.returnType === 'pageSearch' && next.resultCode == 1000) {
      this.setState({
        data: next.data,
        page: next.page,
      });
    }
    if (next.returnType === 'companyList' && next.resultCode == 1000) {
      this.setState({
        list: next.list,
      });
    }
    if (next.returnType === 'rolesList' && next.resultCode == 1000) {
      this.setState({
        rolesList: next.rolesList,
      });
    }
    if (next.returnType === 'getTree' && next.resultCode == 1000) {
      next.returnType = '';
      this.setState({
        treeData: next.treeData,
      });
    }
    if (next.returnType === 'deleteUsers' && next.resultCode == 1000) {
      next.returnType = '';
      message.success('用户删除成功！');
      // var currentPage = jqy.trim(jqy(".ant-pagination-item-active a").text());
      const { userName, userType, companyId, state } = this.state;
      this.props.dispatch({
        type: 'manage/submit',
        payload: {
          searchParams: {
            userName: userName,
            userType: userType.key,
            companyId: companyId.key,
            state: state.key,
            userPhone: this.state.userPhone,
            userMail: this.state.userMail,
          },
          page: {
            size: this.state.pageSize,
            // curpage: currentPage,
            curpage: 1,
          },
        },
      });
    }
    if (next.returnType === 'createUsers' && next.resultCode == 1000) {
      next.returnType = '';
      message.success('用户添加成功！');
      this.setState({
        userName: '',
        userType: { key: 0 },
        companyId: { key: 0 },
        state: { key: 0 },
        userPhone: '',
        userMail: '',
      });
      this.props.dispatch({
        type: 'manage/submit',
        payload: {
          searchParams: {
            userName: '',
            userType: 0,
            companyId: 0,
            state: 0,
            userPhone: '',
            userMail: '',
          },
          page: {
            size: this.state.pageSize,
            curpage: 1,
          },
        },
      });
    }
    if (next.returnType === 'updateUsers' && next.resultCode == 1000) {
      next.returnType = '';
      message.success('用户信息修改成功！');
      var currentPage = jqy.trim(jqy('.ant-pagination-item-active a').text());
      if (currentPage == '' || currentPage == undefined) {
        currentPage = 1;
      }
      const { userName, userType, companyId, state } = this.state;
      this.props.dispatch({
        type: 'manage/submit',
        payload: {
          searchParams: {
            userName: userName,
            userType: userType.key,
            companyId: companyId.key,
            state: state.key,
            userPhone: this.state.userPhone,
            userMail: this.state.userMail,
          },
          page: {
            size: this.state.pageSize,
            curpage: currentPage,
          },
        },
      });
    }
    if (next.returnType === 'userMassage' && next.resultCode == 1000) {
      next.returnType = '';
      this.setState({
        userMassage: next.userMassageData,
      });
      if (!!next.userMassageData.companyId) {
        this.props.dispatch({
          type: 'manage/getTree',
          payload: {
            companyId: next.userMassageData.companyId,
          },
        });
      }
    }
    if (next.returnType === 'setRole' && next.resultCode == 1000) {
      next.returnType = '';
      message.success('角色修改成功！');
      var currentPage = jqy.trim(jqy('.ant-pagination-item-active a').text());
      if (currentPage == '' || currentPage == undefined) {
        currentPage = 1;
      }
      const { userName, userType, companyId, state } = this.state;
      this.props.dispatch({
        type: 'manage/submit',
        payload: {
          searchParams: {
            userName: userName,
            userType: userType.key,
            companyId: companyId.key,
            state: state.key,
            userPhone: this.state.userPhone,
            userMail: this.state.userMail,
          },
          page: {
            size: this.state.pageSize,
            curpage: currentPage,
          },
        },
      });
    }
    if (next.returnType === 'resetPassword' && next.resultCode == 1000) {
      next.returnType = '';
      message.success('重置密码成功！');
      var currentPage = jqy.trim(jqy('.ant-pagination-item-active a').text());
      const { userName, userType, companyId, state } = this.state;
      this.props.dispatch({
        type: 'manage/submit',
        payload: {
          searchParams: {
            userName: userName,
            userType: userType.key,
            companyId: companyId.key,
            state: state.key,
            userPhone: this.state.userPhone,
            userMail: this.state.userMail,
          },
          page: {
            size: this.state.pageSize,
            curpage: currentPage,
          },
        },
      });
    }
    if (next.returnType === 'getRole' && next.resultCode == 1000) {
      this.setState({
        allRoles: next.roleDatas,
      });
    }
  }
  // 新增用户 start
  showModal = () => {
    this.setState({ visible: true, leafIdOfCreate: '', treeDatas: [] });
    const form = this.formRef.props.form;
    form.resetFields();
  };
  handleCancel = () => {
    this.setState({ visible: false });
  };
  handleCreate = e => {
    e.preventDefault();
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      } else {
        this.formRef.props.dispatch({
          type: 'manage/createUsers',
          payload: {
            companyId: values.companyId && values.companyId.key ? values.companyId.key : '',
            departmentId: this.state.leafIdOfCreate,
            userMail: values.userEmail,
            userName: values.userName,
            userPhone: values.userPhone,
            userType: values.userType,
          },
        });
      }
      form.resetFields();
      this.setState({ visible: false });
    });
  };
  saveFormRef = formRef => {
    this.formRef = formRef;
  };
  getLeafIdOfCreate = value => {
    this.setState({
      leafIdOfCreate: value,
    });
  };
  // 新增用户 end
  // 修改用户 start
  editUsers = (record, index) => {
    this.setState({
      editVisible: true,
      updataOfUserId: record.userId,
      departmentId: record.departmentId,
      clickTag: false,
      selectId: false,
      treeData: [],
    });

    this.props.dispatch({
      type: 'manage/userMassage',
      payload: {
        userId: record.userId,
      },
    });
    const form = this.editFormRef.props.form;
    form.resetFields();
  };
  editCancel = () => {
    this.setState({
      editVisible: false,
      departmentId: '',
      clickTag: false,
      selectId: false,
    });

    const form = this.editFormRef.props.form;
    form.resetFields();
  };
  editCreate = e => {
    e.preventDefault();
    const form = this.editFormRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      } else {
        this.editFormRef.props.dispatch({
          type: 'manage/updateUsers',
          payload: {
            userId: this.state.updataOfUserId,
            // departmentId: this.state.leafIdOfUpdate,
            departmentId:
              !!this.state.clickTag && !this.state.selectId
                ? ''
                : !this.state.clickTag && !this.state.selectId
                  ? this.state.departmentId
                  : this.state.leafIdOfUpdate,
            userName: values.editUserName,
            userPhone: values.editUserPhone,
            userType: values.editUserType.key,
            state: values.editState.key,
            companyId: values.editCompanyId.key,
          },
        });
      }
      form.resetFields();
      this.setState({
        editVisible: false,
        departmentId: '',
        clickTag: false,
        selectId: false,
      });
    });
  };
  saveEditFormRef = editFormRef => {
    this.editFormRef = editFormRef;
  };
  getLeafIdOfUpdate = (value, tag, mark) => {
    this.setState({
      leafIdOfUpdate: value,
      clickTag: tag,
      selectId: mark,
    });
  };

  // 修改用户 end

  // 给用户添加角色 start
  setRole = record => {
    this.setState({
      setRoleVisible: true,
      addRoleOfUserId: record.userId,
    });
    this.props.dispatch({
      type: 'manage/haveRoles',
      payload: {
        userId: record.userId,
      },
    });
  };
  setRoleCancel = () => {
    this.setState({ setRoleVisible: false });
    const form = this.setRoleFormRef.props.form;
    form.resetFields();
  };
  setRoleComfirm = e => {
    e.preventDefault();
    const form = this.setRoleFormRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      } else {
        this.setRoleFormRef.props.dispatch({
          type: 'manage/setRole',
          payload: {
            userId: this.state.addRoleOfUserId,
            ...values,
          },
        });
      }
      form.resetFields();
      this.setState({ setRoleVisible: false });
    });
  };
  saveSetRoleFormRef = setRoleFormRef => {
    this.setRoleFormRef = setRoleFormRef;
  };
  // 给用户添加角色 end

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields({ force: true }, (err, values) => {
      // var currentPage = jqy.trim(jqy(".ant-pagination-item-active a").text());
      if (!err) {
        this.setState({
          userName: values.userName,
          userType: { key: values.userType.key },
          companyId: { key: values.companyId.key },
          state: { key: values.state.key },
          userPhone: values.userPhone,
          userMail: values.userMail,
        });
        this.props.dispatch({
          type: 'manage/submit',
          payload: {
            searchParams: {
              userName: values.userName,
              userType: values.userType.key,
              companyId: values.companyId.key,
              state: values.state.key,
              userPhone: values.userPhone,
              userMail: values.userMail,
            },
            page: {
              size: this.state.pageSize,
              // curpage: currentPage,
              curpage: 1,
            },
          },
        });
      }
    });
  };
  delete = () => {
    this.setState({ loading: true });
    const deleteUserId = this.state.selectedRowKeys;
    this.props.dispatch({
      type: 'manage/deleteUsers',
      payload: deleteUserId,
    });
    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
        loading: false,
        deleteUserId: deleteUserId,
      });
    }, 1000);
  };
  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  onChange = page => {
    const { userName, userType, companyId, state } = this.state;
    this.props.dispatch({
      type: 'manage/submit',
      payload: {
        searchParams: {
          userName: userName,
          userType: userType.key,
          companyId: companyId.key,
          state: state.key,
          userPhone: this.state.userPhone,
          userMail: this.state.userMail,
        },
        page: {
          size: this.state.pageSize,
          curpage: page,
        },
      },
    });
  };
  pageSizeChange = value => {
    this.setState({
      pageSize: value,
    });
    const { userName, userType, companyId, state } = this.state;
    this.props.dispatch({
      type: 'manage/submit',
      payload: {
        searchParams: {
          userName: userName,
          userType: userType.key,
          companyId: companyId.key,
          state: state.key,
          userPhone: this.state.userPhone,
          userMail: this.state.userMail,
        },
        page: {
          size: value,
          curpage: 1,
        },
      },
    });
  };
  confirm = record => {
    this.props.dispatch({
      type: 'manage/resetPassword',
      payload: {
        userId: record.userId,
      },
    });
  };
  handleChangeState = value => {
    // this.setState({
    //   state: value,
    // });
  };
  handleChangeUserType = value => {
    // this.setState({
    //   userType: value,
    // });
  };
  handleChangeCompanyId = value => {
    // this.setState({
    //   companyId: value,
    // });
  };
  setTreeDataBlank = () => {
    this.setState({
      treeData: [],
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading, selectedRowKeys, count } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    const companyIdList = this.state.list.map((companyIdItem, index) => (
      <Option value={companyIdItem.companyId} key={companyIdItem.companyId}>
        {companyIdItem.companyName}
      </Option>
    ));
    const formItemLayout = {
      labelCol: {
        span: 7,
      },
      wrapperCol: {
        span: 17,
      },
    };
    const columns = [
      {
        title: '编号',
        dataIndex: 'rowId',
        align: 'center',
        render: (text, record, index) => index + 1,
      },
      {
        title: '用户名',
        dataIndex: 'userName',
        align: 'center',
      },
      {
        title: '手机号',
        dataIndex: 'userPhone',
        align: 'center',
      },
      {
        title: '用户邮箱',
        dataIndex: 'userMail',
        align: 'center',
      },
      {
        title: '用户类型',
        dataIndex: 'userType',
        align: 'center',
        render: (text, record, index) => userTypeConst[text],
      },
      {
        title: '单位名称',
        dataIndex: 'companyName',
        align: 'center',
      },
      {
        title: '所属部门',
        dataIndex: 'departmentName',
        align: 'center',
      },
      {
        title: '用户状态',
        dataIndex: 'state',
        align: 'center',
        render: (text, record, index) => userStateConst[text],
      },
      {
        title: '操作',
        dataIndex: 'done',
        align: 'center',
        render: (text, record, index) => (
          <span>
            {getTags().indexOf('user-update') != -1 && (
              <a
                href="javascript:;"
                title="修改用户信息"
                onClick={() => {
                  this.editUsers(record);
                }}
              >
                <Icon type="form" />
              </a>
            )}
            {getTags().indexOf('user-update') != -1 &&
              (getTags().indexOf('user-reset-password') != -1 ||
                getTags().indexOf('user-role2user') != -1) && <Divider type="vertical" />}
            {getTags().indexOf('user-reset-password') != -1 && (
              <Popconfirm
                title="是否重置密码?"
                onConfirm={() => {
                  this.confirm(record);
                }}
                onCancel={() => {
                  this.cancel();
                }}
                okText="确定"
                cancelText="取消"
              >
                <a href="javascript:;" title="重置密码">
                  <Icon type="tool" />
                </a>
              </Popconfirm>
            )}
            {getTags().indexOf('user-update') != -1 &&
              getTags().indexOf('user-reset-password') != -1 &&
              getTags().indexOf('user-role2user') != -1 && <Divider type="vertical" />}
            {getTags().indexOf('user-role2user') != -1 && (
              <a
                href="javascript:;"
                title="分配角色"
                onClick={() => {
                  this.setRole(record);
                }}
              >
                <Icon type="team" />
              </a>
            )}
          </span>
        ),
      },
    ];
    return (
      <PageHeaderLayout>
        <div className={styles.container}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark>
            <Row style={{ width: '100%' }}>
              <Col>
                <FormItem {...formItemLayout} label="用户名" style={{ width: 280, float: 'left' }}>
                  {getFieldDecorator('userName', {
                    initialValue: `${this.state.userName}`,
                  })(<Input placeholder="用户名" className={styles.antInputText} />)}
                </FormItem>
              </Col>
              <Col>
                <FormItem {...formItemLayout} label="手机号" style={{ width: 280, float: 'left' }}>
                  {getFieldDecorator('userPhone', {
                    initialValue: `${this.state.userPhone}`,
                  })(<Input placeholder="手机号" className={styles.antInputText} />)}
                </FormItem>
              </Col>
              <Col>
                <FormItem
                  {...formItemLayout}
                  label="用户邮箱"
                  style={{ width: 280, float: 'left' }}
                >
                  {getFieldDecorator('userMail', {
                    initialValue: `${this.state.userMail}`,
                  })(<Input placeholder="用户邮箱" className={styles.antInputText} />)}
                </FormItem>
              </Col>
              <Col>
                <FormItem style={{ float: 'right' }}>
                  <Button icon="search" className={styles.btn} htmlType="submit">
                    查询
                  </Button>
                </FormItem>
              </Col>
            </Row>
            <Row style={{ width: '100%' }}>
              <Col>
                <FormItem
                  {...formItemLayout}
                  label="用户状态"
                  style={{ width: 280, float: 'left' }}
                >
                  {getFieldDecorator('state', {
                    initialValue: { key: `${this.state.state.key}` },
                  })(
                    <Select
                      placeholder="请选择"
                      style={{ width: '135' }}
                      labelInValue
                      onChange={this.handleChangeState}
                    >
                      <Option value="0">请选择</Option>
                      <Option value="1">正常</Option>
                      <Option value="2">用户锁定</Option>
                      <Option value="3">用户注销</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col>
                <FormItem
                  {...formItemLayout}
                  label="用户类型"
                  style={{ width: 280, float: 'left' }}
                >
                  {getFieldDecorator('userType', {
                    initialValue: { key: `${this.state.userType.key}` },
                  })(
                    <Select
                      placeholder="请选择"
                      style={{ width: '135' }}
                      labelInValue
                      onChange={this.handleChangeUserType}
                    >
                      <Option value="0">请选择</Option>
                      <Option value="1">SAAS管理员</Option>
                      <Option value="2">服务提供方</Option>
                      <Option value="3">服务购买方</Option>
                      <Option value="4">业务用户</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col>
                <FormItem
                  {...formItemLayout}
                  label="单位名称"
                  style={{ width: 280, float: 'left' }}
                >
                  {getFieldDecorator('companyId', {
                    initialValue: { key: `${this.state.companyId.key}` },
                  })(
                    <Select
                      placeholder="请选择"
                      style={{ width: '135' }}
                      labelInValue
                      onChange={this.handleChangeCompanyId}
                    >
                      <Option value="0">请选择</Option>
                      {companyIdList}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row style={{ width: '100%' }}>
              <Col>
                <FormItem>
                  <TitleItem title="用户管理" />
                  {getTags().indexOf('user-add') != -1 && (
                    <Button type="primary" className={styles.btn} onClick={this.showModal}>
                      新增
                    </Button>
                  )}
                  {getTags().indexOf('user-delete') != -1 && (
                    <Popconfirm
                      title="是否删除选中用户?"
                      onConfirm={this.delete}
                      okText="确定"
                      cancelText="取消"
                    >
                      <Button className={styles.btn} disabled={!hasSelected} loading={loading}>
                        删除
                      </Button>
                    </Popconfirm>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Table
              columns={columns}
              dataSource={this.state.data}
              bordered
              rowKey={record => record.userId}
              rowSelection={rowSelection}
              pagination={false}
              loading={this.props.submitting}
            />
            <div className={styles.pageBox}>
              <div className={styles.pageWrap}>
                {/* <div className={styles.floatLeft}>单页</div> */}
                <Select
                  onChange={this.pageSizeChange}
                  defaultValue={this.state.pageSize + `行/页`}
                  className={styles.selectOption}
                >
                  <Option value="5">5行/页</Option>
                  <Option value="10">10行/页</Option>
                  <Option value="15">15行/页</Option>
                  <Option value="20">20行/页</Option>
                  <Option value="30">30行/页</Option>
                  <Option value="40">40行/页</Option>
                  <Option value="50">50行/页</Option>
                  <Option value="100">100行/页</Option>
                </Select>
                {/* <div className={styles.floatRight}>行</div> */}
              </div>
              <Pagination
                total={this.state.page.totalRecs}
                style={{ float: 'right' }}
                showQuickJumper
                showTotal={(total, range) =>
                  `共${total}条记录 第${this.state.page.curpage}/${this.state.page.pageCounts}页`
                }
                pageSize={this.state.pageSize}
                current={this.state.page.curpage}
                onChange={this.onChange}
              />
            </div>
          </Form>
          <CreateNewUserModal
            wrappedComponentRef={this.saveFormRef}
            visible={this.state.visible}
            onCancel={this.handleCancel}
            onCreate={this.handleCreate}
            companyIdList={companyIdList}
            leafIdOfCreate={this.getLeafIdOfCreate}
            treeDatas={this.state.treeDatas}
          />
          <UpdateUserModal
            wrappedComponentRef={this.saveEditFormRef}
            defaultdatas={this.state.userMassage}
            visible={this.state.editVisible}
            onCancel={this.editCancel}
            onCreate={this.editCreate}
            companyIdList={companyIdList}
            treeData={this.state.treeData}
            leafIdOfUpdate={this.getLeafIdOfUpdate}
            clickTag={this.state.clickTag}
            selectId={this.state.selectId}
            setTreeDataBlank={this.setTreeDataBlank}
          />
          <SetRoleForUser
            wrappedComponentRef={this.saveSetRoleFormRef}
            defaultdatas={this.state.allRoles}
            visible={this.state.setRoleVisible}
            onCancel={this.setRoleCancel}
            onCreate={this.setRoleComfirm}
            rolesList={this.state.rolesList}
          />
        </div>
      </PageHeaderLayout>
    );
  }
}
