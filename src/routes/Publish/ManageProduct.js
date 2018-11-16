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
import '../../common.less';
import logo from '../../assets/img/logo.svg';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import CreateNewProductModal from '../../components/Publish/CreateNewProductModal.js';
import { pageSize, getTags } from '../../common.js';
import styles from './Publish.less';
import TitleItem from '../../components/common/TitleItem.js';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const Option = Select.Option;

@connect(({ publish, loading }) => ({
  publish,
  submitting: loading.effects['publish/applicationPage'],
}))
@Form.create()
export default class ManageProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [], //角色信息列表
      page: {},
      name: '',
      visible: false,
      // pageSize:pageSize,
      // curpage: 1,
      selectedRowKeys: [],
      loading: false,
      selectAppId: '',
      btnTag: '',

      current: 1,
      total: 0,
      pageSize: pageSize,
      allPage: 1,

      // deleteRolesVisible: false,
      // roleAlterData: {
      //     roleId: "",
      //     roleType: "",
      //     roleName: "",
      // },
      // editVisible: false,
      // setAuthorityVisible: false,
      // setAuthorityForRoleId: "",
      // authorityTree: [],
      // defaultSelectedKeys: [],
      // permissions: [],
    };
  }
  componentWillMount() {
    this.getPage();
  }
  componentWillReceiveProps(nextProps) {
    const next = nextProps.publish;
    if (next.returnType === 'applicationPage' && next.resultCode === 1000) {
      next.resultCode == 0;
      // this.setState({
      //     data: next.resultData,
      //     page: next.resultPage,
      //     curpage: next.resultPage.curpage,
      //     name: document.getElementById("name").value,
      // })
      this.setState({
        data: next.resultData,
        current: next.resultPage.curpage,
        total: next.resultPage.totalRecs,
        pageSize: next.resultPage.size,
        allPage: next.resultPage.pageCounts,
      });
    }
    if (next.returnType === 'createProduct' && next.resultCode === 1000) {
      this.getPage(1);
      const form = this.formRef.props.form;
      form.resetFields();

      this.setState({ visible: false });
    }
    if (next.returnType === 'createProduct' && next.resultCode > 1000) {
      next.resultCode = 0;
      message.error(next.desc);
    }
    if (next.returnType === 'updateProduct' && next.resultCode === 1000) {
      this.getPage();
      const form = this.formRef.props.form;
      form.resetFields();
      this.setState({ visible: false });
    }
    if (next.returnType === 'updateProduct' && next.resultCode > 1000) {
      next.resultCode = 0;
      message.error(next.desc);
    }
    if (next.returnType === 'deleteProduct' && next.resultCode > 1000) {
      next.resultCode = 0;
      message.error(next.desc);
    }
    if (next.returnType === 'deleteProduct' && next.resultCode === 1000) {
      next.resultCode = 0;
      message.success('删除成功！');
      this.setState({
        selectedRowKeys: [],
      });
      this.getPage();
    }
  }
  // 新增产品 start
  showModal = val => {
    this.setState({
      btnTag: val,
    });
    if (val[1] === '修改') {
      this.setState({
        selectAppId: val[0],
      });
      this.props.dispatch({
        type: 'publish/queryProduct',
        payload: {
          appId: val[0],
        },
      });
    }
    this.setState({ visible: true });
  };
  deletErr = () => {
    message.error('请选择删除产品！');
  };
  deleteBtn = () => {
    this.props.dispatch({
      type: 'publish/deleteProduct',
      payload: this.state.selectedRowKeys,
    });
  };
  handleCancel = () => {
    this.setState({
      visible: false,
      btnTag: '',
    });
    const form = this.formRef.props.form;
    form.resetFields();
  };
  handleCreate = e => {
    // e.preventDefault();
    // console.log(e)
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      } else {
        values.detailPageZipFileId = e[1];
        values.logoFileId = e[0];
        if (this.state.btnTag === '新增') {
          this.props.dispatch({
            type: 'publish/createProduct',
            payload: {
              ...values,
            },
          });
        } else {
          values.appId = this.state.selectAppId;
          this.props.dispatch({
            type: 'publish/updateProduct',
            payload: {
              ...values,
            },
          });
        }
      }
    });
  };
  saveFormRef = formRef => {
    this.formRef = formRef;
  };
  // 新增产品 end

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields({ force: true }, (err, values) => {
      const myPro = new Promise((resolve, reject) => {
        this.setState({
          name: values.name,
        });
        resolve();
      });
      myPro.then(() => {
        this.getPage();
      });
    });
  };

  pageChange = e => {
    let val = e;
    const myPro = new Promise((resolve, reject) => {
      this.setState({
        pageSize: val,
      });
      resolve();
    });
    myPro.then(() => {
      this.getPage();
    });
  };

  getPage = curpage => {
    const { name, pageSize, current } = this.state;
    this.props.dispatch({
      type: 'publish/applicationPage',
      payload: {
        searchParams: {
          name: !!name ? name : '',
        },
        page: {
          size: pageSize,
          curpage: !!curpage ? curpage : current,
        },
      },
    });
  };

  changePage = (page, pageSize) => {
    // console.log(page, pageSize);
    const myPro1 = new Promise((resolve, reject) => {
      this.setState({
        current: page,
      });
      resolve();
    });
    myPro1.then(() => {
      this.getPage();
    });
  };
  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading, selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      onSelect: (record, selected, selectedRows) => {
        this.setState({
          selectAppId: record.appId,
        });
      },
      // type:"radio",
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
        title: '应用名称',
        dataIndex: 'appName',
        align: 'center',
      },
      {
        title: '应用简称',
        dataIndex: 'appShortName',
        align: 'center',
      },
      {
        title: '最新版本',
        dataIndex: 'versionName',
        align: 'center',
      },
      {
        title: '审核状态',
        dataIndex: 'stateName',
        align: 'center',
        // render: (text, record, index) => roleTypeConst[text],
      },
      {
        title: '应用描述',
        dataIndex: 'appDescription',
        align: 'center',
        width: '300px',
      },
      {
        title: 'LOGO',
        dataIndex: 'logoPath',
        align: 'center',
        render: (text, record, index) => (
          <span>
            <img src={`/api/saas-file/${text}`} style={{ width: 40, height: 40 }} />
          </span>
        ),
      },
      {
        title: '操作',
        dataIndex: 'done',
        align: 'center',
        render: (text, record, index) => (
          <span>
            {getTags().indexOf('application-update') != -1 && (
              <Button size="small" onClick={this.showModal.bind(this, [record.appId, '修改'])}>
                修改
              </Button>
            )}
            <Link
              to={{
                pathname: '/publish/details/product-details',
                state: { appId: record.appId, appName: record.appName },
              }}
              style={{ marginLeft: '10px' }}
            >
              <Button size="small">详情</Button>
            </Link>
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
                  label="应用名称"
                  style={{ width: 280, float: 'left' }}
                >
                  {getFieldDecorator('name', {
                    initialValue: this.state.name,
                  })(<Input placeholder="请输入应用名称" className={styles.antInputText} />)}
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
                  <TitleItem title="产品管理" />
                  {getTags().indexOf('application-add') != -1 && (
                    <Button
                      type="primary"
                      className={styles.btn}
                      onClick={this.showModal.bind(this, '新增')}
                    >
                      新增
                    </Button>
                  )}
                  {getTags().indexOf('application-delete') != -1 && (
                    <Popconfirm
                      placement="bottomRight"
                      title="是否确认删除此产品？"
                      onConfirm={
                        this.state.selectedRowKeys.length === 0 ? this.deletErr : this.deleteBtn
                      }
                      okText="确定"
                      cancelText="取消"
                    >
                      <Button className={styles.btn}>删除</Button>
                    </Popconfirm>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Table
              columns={columns}
              dataSource={this.state.data}
              bordered
              rowKey={record => record.appId}
              rowSelection={rowSelection}
              pagination={false}
              loading={this.props.submitting}
            />
            <div className={styles.pageDiv}>
              <span className={styles.pageStyle}>
                <Select
                  onChange={this.pageChange}
                  style={{ width: '95px', margin: '0 5px' }}
                  defaultValue={`${this.state.pageSize}行/页`}
                  className={styles.selectOption}
                >
                  <option value="5">5行/页</option>
                  <option value="10">10行/页</option>
                  <option value="15">15行/页</option>
                  <option value="20">20行/页</option>
                  <option value="30">30行/页</option>
                  <option value="40">40行/页</option>
                  <option value="50">50行/页</option>
                  <option value="100">100行/页</option>
                </Select>
              </span>
              <Pagination
                showQuickJumper
                pageSize={Number(this.state.pageSize)}
                onChange={this.changePage}
                current={this.state.current}
                total={this.state.total}
              />
              <span className={styles.pageStyle}>
                共{this.state.total}条记录 第{this.state.current}/{this.state.allPage}页{' '}
              </span>
            </div>
          </Form>

          <CreateNewProductModal
            wrappedComponentRef={this.saveFormRef}
            visible={this.state.visible}
            onCancel={this.handleCancel}
            onCreate={this.handleCreate}
            btnTag={this.state.btnTag}
          />
        </div>
      </PageHeaderLayout>
    );
  }
}
