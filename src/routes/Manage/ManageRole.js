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
  Popconfirm,
  message,
} from 'antd';
import styles from './Manage.less';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import CreateNewRoleModal from './CreateNewRoleModal.js';
import DeleteRolesModal from './DeleteRolesModal.js';
import UpdateRoleModal from './UpdateRoleModal.js';
import SetAuthorityForRole from './SetAuthorityForRole.js';
import jqy from 'jquery';
import { pageSize, roleTypeConst, getTags } from '../../common.js';
import TitleItem from '../../components/common/TitleItem.js';
import '../../common.less';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const Option = Select.Option;

@connect(({ manage, loading }) => ({
  manage,
  submitting: loading.effects['manage/searchRole'],
}))
@Form.create()
export default class ManageRole extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [], //角色信息列表
      page: {},
      roleNameText: '',
      selectedRowKeys: [],
      loading: false,
      deleteRolesVisible: false,
      roleAlterData: {
        roleId: '',
        roleType: '',
        roleName: '',
      },
      visible: false,
      editVisible: false,
      setAuthorityVisible: false,
      setAuthorityForRoleId: '',
      authorityTree: [],
      defaultSelectedKeys: [],
      permissions: [],
      pageSize: pageSize,
      selectedAuthorityTag: false,
    };
  }
  componentWillMount() {
    this.props.dispatch({
      type: 'manage/searchRole',
      payload: {
        searchParams: { roleName: '' },
        page: {
          size: this.state.pageSize,
          curpage: 1,
        },
      },
    });
  }
  componentDidMount() {}
  componentWillReceiveProps(nextProps) {
    const next = nextProps.manage;
    if (next.returnType === 'searchRole' && next.resultCode == 1000) {
      this.setState({
        data: next.resultData,
        page: next.resultPage,
        roleNameText: document.getElementById('roleNameText').value,
      });
    }
    if (next.returnType === 'authorityTree' && next.resultCode == 1000) {
      this.dealTreeData(next.authorityTreeData.treeNode);
      this.setState({
        authorityTree: next.authorityTreeData.treeNode.children,
        defaultSelectedKeys: next.authorityTreeData.defaultSelectedKeys,
      });
      if (next.authorityTreeData.defaultSelectedKeys.length < 1) {
        jqy('#remind').text('至少选择一个权限！');
      } else {
        jqy('#remind').text('');
      }
    }
    if (next.returnType === 'createRole' && next.resultCode == 1000) {
      message.success('角色添加成功！');
      var currentPage = jqy.trim(jqy('.ant-pagination-item-active a').text());
      if (currentPage == '' || currentPage == undefined) {
        currentPage = 1;
      }
      this.props.dispatch({
        type: 'manage/searchRole',
        payload: {
          searchParams: { roleName: this.state.roleNameText },
          page: {
            size: this.state.pageSize,
            curpage: currentPage,
          },
        },
      });
    }
    if (next.returnType === 'deleteRole' && next.resultCode == 1000) {
      next.returnType = '';
      next.resultCode = 0;
      message.success('角色删除成功！');
      this.props.dispatch({
        type: 'manage/searchRole',
        payload: {
          searchParams: { roleName: this.state.roleNameText },
          page: {
            size: this.state.pageSize,
            curpage: 1,
          },
        },
      });
    }
    if (next.returnType === 'deleteRole' && next.resultCode == 3000) {
      next.returnType = '';
      next.resultCode = 0;
      message.success('角色删除失败,请检查角色是否使用中或选择强制删除！', 3);
    }
    if (next.returnType === 'deleteRole' && next.resultCode == 2301) {
      next.returnType = '';
      next.resultCode = 0;
      message.success('部分角色删除失败,请检查角色是否使用中或选择强制删除！', 3);
      this.props.dispatch({
        type: 'manage/searchRole',
        payload: {
          searchParams: { roleName: this.state.roleNameText },
          page: {
            size: this.state.pageSize,
            curpage: 1,
          },
        },
      });
    }
    if (next.returnType === 'updateRole' && next.resultCode == 1000) {
      message.success('角色更新成功！');
      var currentPage = jqy.trim(jqy('.ant-pagination-item-active a').text());
      if (currentPage == '' || currentPage == undefined) {
        currentPage = 1;
      }
      this.props.dispatch({
        type: 'manage/searchRole',
        payload: {
          searchParams: { roleName: this.state.roleNameText },
          page: {
            size: this.state.pageSize,
            curpage: currentPage,
          },
        },
      });
    }
    if (next.returnType === 'setAuthority' && next.resultCode == 1000) {
      message.success('权限分配成功！');
      var currentPage = jqy.trim(jqy('.ant-pagination-item-active a').text());
      if (currentPage == '' || currentPage == undefined) {
        currentPage = 1;
      }
      this.props.dispatch({
        type: 'manage/searchRole',
        payload: {
          searchParams: { roleName: this.state.roleNameText },
          page: {
            size: this.state.pageSize,
            curpage: currentPage,
          },
        },
      });
    }
    next.returnType = '';
  }

  //处理分配权限的数据 将父节点id赋值
  dealTreeData = (data, parentNode) => {
    data.parentIds = [];
    if (parentNode) {
      if (parentNode.key !== '-1') {
        data.parentIds.push(parentNode.key);
      }
      for (var i = 0; i < parentNode.parentIds.length; i++) {
        data.parentIds.push(parentNode.parentIds[i]);
      }
    }
    if (data.children) {
      for (var i = 0; i < data.children.length; i++) {
        this.dealTreeData(data.children[i], data);
      }
    }
  };

  // 新增角色 start
  showModal = () => {
    this.setState({ visible: true });
  };
  handleCancel = () => {
    this.setState({ visible: false });
    const form = this.formRef.props.form;
    form.resetFields();
  };
  handleCreate = e => {
    e.preventDefault();
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      } else {
        this.formRef.props.dispatch({
          type: 'manage/createRoles',
          payload: {
            ...values,
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
  // 新增角色 end

  // 修改角色 start
  editRoles = (record, index) => {
    this.setState({
      editVisible: true,
      roleAlterData: {
        roleId: record.roleId,
        roleName: record.roleName,
        roleType: record.roleType,
      },
    });
  };
  editCancel = () => {
    this.setState({ editVisible: false });
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
          type: 'manage/updateRoles',
          payload: {
            roleId: values.roleId,
            roleName: values.roleName,
            roleType: values.roleType.key,
          },
        });
      }
      form.resetFields();
      this.setState({ editVisible: false });
    });
  };
  saveEditFormRef = editFormRef => {
    this.editFormRef = editFormRef;
  };
  // 修改角色 end

  // 给角色添加权限 start
  setAuthority = record => {
    this.setState({
      setAuthorityVisible: true,
      setAuthorityForRoleId: record.roleId,
      selectedAuthorityTag: false,
    });
    this.props.dispatch({
      type: 'manage/authorityTree',
      payload: {
        roleId: record.roleId,
      },
    });
  };
  setAuthorityCancel = () => {
    this.setState({ setAuthorityVisible: false });
    const form = this.setAuthorityFormRef.props.form;
    form.resetFields();
  };
  setAuthorityComfirm = e => {
    e.preventDefault();
    const form = this.setAuthorityFormRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      } else {
        const remindMessage = jqy('#remind').text();
        if (!!remindMessage) {
          return;
        } else {
          let permissions = [];
          if (this.state.selectedAuthorityTag) {
            permissions = this.state.permissions;
          } else {
            permissions = this.state.defaultSelectedKeys;
          }
          this.setAuthorityFormRef.props.dispatch({
            type: 'manage/setAuthority',
            payload: {
              roleId: this.state.setAuthorityForRoleId,
              permissions: permissions,
            },
          });
        }
      }
      form.resetFields();
      this.setState({ setAuthorityVisible: false });
    });
  };
  saveSetAuthorityFormRef = setAuthorityFormRef => {
    this.setAuthorityFormRef = setAuthorityFormRef;
  };
  // 给角色添加权限 end

  // 删除角色 start
  deleteRole = () => {
    this.setState({
      deleteRolesVisible: true,
    });
    const form = this.deleteRoleFormRef.props.form;
    form.resetFields();
  };
  deleteRoleCancel = () => {
    this.setState({ deleteRolesVisible: false });
    const form = this.deleteRoleFormRef.props.form;
    form.resetFields();
  };
  deleteRoleComfirm = e => {
    e.preventDefault();
    const form = this.deleteRoleFormRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      } else {
        this.deleteRoleFormRef.props.dispatch({
          type: 'manage/deleteRoles',
          payload: {
            roleIds: this.state.selectedRowKeys,
            isMandatory: values.isMandatory,
          },
        });
        setTimeout(() => {
          this.setState({
            selectedRowKeys: [],
            loading: false,
          });
        }, 1000);
      }
      form.resetFields();
      this.setState({ deleteRolesVisible: false });
    });
  };
  savedeleteRoleFormRef = deleteRoleFormRef => {
    this.deleteRoleFormRef = deleteRoleFormRef;
  };
  // 删除角色 end

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'manage/searchRole',
          payload: {
            searchParams: { roleName: values.roleNameText },
            page: {
              size: this.state.pageSize,
              curpage: 1,
            },
          },
        });
      }
    });
  };
  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  onChange = page => {
    const roleName = document.getElementById('roleNameText').value;
    this.props.dispatch({
      type: 'manage/searchRole',
      payload: {
        searchParams: {
          roleName,
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
    const roleName = document.getElementById('roleNameText').value;
    this.props.dispatch({
      type: 'manage/searchRole',
      payload: {
        searchParams: {
          roleName,
        },
        page: {
          size: value,
          curpage: 1,
        },
      },
    });
  };

  keyOnChange = (value, tag) => {
    this.setState({
      permissions: value,
      selectedAuthorityTag: tag,
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading, selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
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
        title: '角色名称',
        dataIndex: 'roleName',
        align: 'center',
      },
      {
        title: '角色类型',
        dataIndex: 'roleType',
        align: 'center',
        render: (text, record, index) => roleTypeConst[text],
      },
      {
        title: '操作',
        dataIndex: 'done',
        align: 'center',
        render: (text, record, index) => (
          <span>
            {getTags().indexOf('role-update') != -1 && (
              <a
                href="javascript:;"
                title="修改角色信息"
                onClick={() => {
                  this.editRoles(record);
                }}
              >
                <Icon type="form" />
              </a>
            )}
            {getTags().indexOf('role-update') != -1 &&
              getTags().indexOf('role-permis2role') != -1 && <Divider type="vertical" />}
            {getTags().indexOf('role-permis2role') != -1 && (
              <a
                href="javascript:;"
                title="分配权限"
                onClick={() => {
                  this.setAuthority(record);
                }}
              >
                <Icon type="share-alt" />
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
                <FormItem
                  {...formItemLayout}
                  label="角色名称"
                  style={{ width: 280, float: 'left' }}
                >
                  {getFieldDecorator('roleNameText', {
                    initialValue: this.state.roleNameText,
                  })(<Input placeholder="角色名称" className={styles.antInputText} />)}
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
                <FormItem>
                  <TitleItem title="角色管理" />
                  {getTags().indexOf('role-add') != -1 && (
                    <Button type="primary" className={styles.btn} onClick={this.showModal}>
                      新增
                    </Button>
                  )}
                  {getTags().indexOf('role-delete') != -1 && (
                    <Button
                      className={styles.btn}
                      onClick={this.deleteRole}
                      disabled={!hasSelected}
                      loading={loading}
                    >
                      删除
                    </Button>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Table
              columns={columns}
              dataSource={this.state.data}
              bordered
              rowKey={record => record.roleId}
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
          <CreateNewRoleModal
            wrappedComponentRef={this.saveFormRef}
            visible={this.state.visible}
            onCancel={this.handleCancel}
            onCreate={this.handleCreate}
          />
          <UpdateRoleModal
            wrappedComponentRef={this.saveEditFormRef}
            defaultdatas={this.state.roleAlterData}
            visible={this.state.editVisible}
            onCancel={this.editCancel}
            onCreate={this.editCreate}
          />
          <SetAuthorityForRole
            wrappedComponentRef={this.saveSetAuthorityFormRef}
            visible={this.state.setAuthorityVisible}
            onCancel={this.setAuthorityCancel}
            onCreate={this.setAuthorityComfirm}
            treeNodes={this.state.authorityTree}
            defaultSelectedKeys={this.state.defaultSelectedKeys}
            keyOnChange={this.keyOnChange}
          />
          <DeleteRolesModal
            wrappedComponentRef={this.savedeleteRoleFormRef}
            visible={this.state.deleteRolesVisible}
            onCancel={this.deleteRoleCancel}
            onCreate={this.deleteRoleComfirm}
          />
        </div>
      </PageHeaderLayout>
    );
  }
}
