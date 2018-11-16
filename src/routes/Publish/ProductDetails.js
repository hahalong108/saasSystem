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
import styles from './Publish.less';
import '../../common.less';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import ApplicationModal from '../../components/Publish/ApplicationModal.js';
import AuditingModal from '../../components/Publish/AuditingModal.js';
import moment from 'moment';
import jqy from 'jquery';
import { pageSize, getTags } from '../../common.js';
import TitleItem from '../../components/common/TitleItem.js';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const Option = Select.Option;

@connect(({ publish, loading }) => ({
  publish,
  submitting: loading.effects['publish/applicationPageDetails'],
}))
@Form.create()
export default class ManageProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [], //角色信息列表
      page: {},
      name: '',
      appName: '',
      appId: '',
      versionId: '',
      btnTag: '',
      btnTagFirst: true,
      state: '',
      visible: false,
      current: 1,
      total: 0,
      pageSize: pageSize,
      allPage: 1,
      selectedRowKeys: [],
      loading: false,
      auditingVisible: false,
      createTag: [],
    };
  }
  componentWillMount() {
    if (!!this.props.location.state) {
      this.setState({
        appName: this.props.location.state.appName,
        appId: this.props.location.state.appId,
      });
      this.getPage();
    } else {
      this.props.dispatch(
        routerRedux.push({
          pathname: '/publish/manage-product',
        })
      );
    }
  }

  componentWillReceiveProps(nextProps) {
    const next = nextProps.publish;
    if (next.returnType === 'applicationPageDetails' && next.resultCode === 1000) {
      this.setState({
        data: next.resultData,
        page: next.resultPage,
        current: next.resultPage.curpage,
        total: next.resultPage.totalRecs,
        pageSize: next.resultPage.size,
        allPage: next.resultPage.pageCounts,
      });
    }
    if (next.returnType === 'createApplication' && next.resultCode === 1000) {
      if (this.props.publish !== nextProps.publish) {
        //防止多次调用
        message.success('新增成功！');
        this.getPage(1);
        const form = this.formRef.props.form;
        form.resetFields();
        this.setState({
          visible: false,
          btnTagFirst: true,
        });
      }
    }
    if (next.returnType === 'createApplication' && next.resultCode > 1000) {
      message.error(next.desc);
    }
    if (next.returnType === 'updateApplication' && next.resultCode === 1000) {
      if (this.props.publish !== nextProps.publish) {
        message.success('修改成功！');
        this.getPage();
        const form = this.formRef.props.form;
        form.resetFields();
        this.setState({
          visible: false,
          btnTagFirst: true,
        });
      }
    }
    if (next.returnType === 'updateApplication' && next.resultCode > 1000) {
      message.error(next.desc);
    }

    if (next.returnType === 'deleteApplication' && next.resultCode > 1000) {
      message.error(next.desc);
    }
    if (next.returnType === 'deleteApplication' && next.resultCode === 1000) {
      if (this.props.publish !== nextProps.publish) {
        message.success('删除成功！');
        this.setState({
          selectedRowKeys: [],
        });
        this.getPage();
      }
    }
    if (next.returnType === 'auditingApplication' && next.resultCode === 1000) {
      if (this.props.publish !== nextProps.publish) {
        message.success('审核成功！');
        this.getPage();
        this.setState({
          auditingVisible: false,
          selectedRowKeys: [],
        });
      }
    }
    if (next.returnType === 'auditingApplication' && next.resultCode > 1000) {
      if (!!next.desc) {
        message.success(next.desc);
      }
    }
    if (next.returnType === 'submitAuditing' && next.resultCode === 1000) {
      if (this.props.publish !== nextProps.publish) {
        message.success('提交审核已提交！');
        this.setState({
          selectedRowKeys: [],
        });
        this.getPage();
      }
    }
    if (next.returnType === 'submitAuditing' && next.resultCode > 1000) {
      if (!!next.desc) {
        message.success(next.desc);
      }
    }
    if (next.returnType === 'checkConfig' && next.resultCode === 1000) {
      const form = this.formRef.props.form;
      form.validateFields((err, values) => {
        if (err) {
          return;
        }
        if (values.versionName !== next.data.versionName) {
          message.error('上传配置文件与版本名称不一致！');
        } else {
          this.handleCreate(this.state.createTag);
        }
      });
    }
    if (next.returnType === 'checkConfig' && next.resultCode > 1000) {
      message.error(next.desc);
    }
    // next.resultCode = 0;
    // next.returnType = "";
  }
  // 新增产品 start
  showModal = val => {
    this.setState(
      {
        btnTag: val,
        versionId: val[0],
      },
      () => {
        this.setState({
          btnTagFirst: false,
        });
      }
    );
    if (val[1] === '修改') {
      this.props.dispatch({
        type: 'publish/queryApplication',
        payload: {
          versionId: val[0],
        },
      });
    }
    this.setState({ visible: true });
  };
  auditingShowModal = val => {
    if (this.state.selectedRowKeys.length === 1) {
      this.setState({ auditingVisible: true });
    }
  };
  auditing = val => {
    const load = [];
    load.push(this.state.versionId);
    this.props.dispatch({
      type: 'publish/submitAuditing',
      payload: load,
    });
  };
  deletErr = () => {
    message.error('请选择删除版本！');
  };
  deleteBtn = () => {
    this.props.dispatch({
      type: 'publish/deleteApplication',
      payload: this.state.selectedRowKeys,
    });
  };
  handleCancel = () => {
    this.setState({
      visible: false,
      btnTagFirst: true,
    });
    const form = this.formRef.props.form;
    form.resetFields();
  };
  checkUpload = e => {
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      } else {
        this.props.dispatch({
          type: 'publish/checkConfig',
          payload: {
            fileId: e[0],
            appId: this.props.location.state.appId,
          },
        });
        this.setState({
          createTag: e,
        });
      }
    });
  };
  handleCreate = e => {
    // e.preventDefault();
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      } else {
        if (!e[1] || !e[2]) {
          message.error('有文件未上传！');
          return;
        }
        values.appId = this.props.location.state.appId;
        values.configFileId = e[0];
        values.deploymentFileId = e[1];
        values.customFileId = e[2];
        values.upgradeSqlFileId = e[3];

        const pl = e[4];
        pl.forEach(item => {
          if (Array.isArray(item.configJson) || typeof item.configJson === 'object') {
            item.configJson = JSON.stringify(item.configJson);
          }
          return pl;
        });
        values.priceList = pl;
        if (this.state.btnTag === '新增') {
          this.props.dispatch({
            type: 'publish/createApplication',
            payload: {
              ...values,
            },
          });
        } else {
          values.versionId = this.state.versionId;
          this.props.dispatch({
            type: 'publish/updateApplication',
            payload: {
              ...values,
            },
          });
        }
      }
    });
  };

  auditingCancel = () => {
    this.setState({ auditingVisible: false });
    const form = this.formRef1.props.form;
    form.resetFields();
  };

  auditingCreate = e => {
    // e.preventDefault();

    const form = this.formRef1.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      } else {
        const arr = [];
        arr.push(this.state.versionId);
        values.versionIds = arr;
        values.state = Number(values.state);
        this.props.dispatch({
          type: 'publish/auditingApplication',
          payload: {
            ...values,
          },
        });
      }
    });
  };
  saveFormRef = formRef => {
    this.formRef = formRef;
  };
  saveFormRef1 = formRef => {
    this.formRef1 = formRef;
  };

  // handleSubmit = e => {
  //     e.preventDefault();
  //     this.props.form.validateFields({ force: true }, (err, values) => {
  //         var currentPage = jqy.trim(jqy(".ant-pagination-item-active a").text());
  //         if (!err) {
  //             this.props.dispatch({
  //                 type: 'publish/applicationPageDetails',
  //                 payload: {
  //                     searchParams: {
  //                         appId: this.state.appId ,
  //                         versionName: values.versionName,
  //                     },
  //                     page: {
  //                         size: this.state.pageSize,
  //                         curpage: 1
  //                     }
  //                 },
  //             });
  //         }
  //     });
  // };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields({ force: true }, (err, values) => {
      const myPro = new Promise((resolve, reject) => {
        this.setState({
          versionName: values.versionName,
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
    const { appId, versionName, pageSize, current } = this.state;
    this.props.dispatch({
      type: 'publish/applicationPageDetails',
      payload: {
        searchParams: {
          appId: this.props.location.state.appId,
          versionName: !!versionName ? versionName : '',
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

  onChange = page => {
    const name = document.getElementById('versionName').value;
    this.props.dispatch({
      type: 'publish/applicationPageDetails',
      payload: {
        searchParams: {
          appId: this.state.appId,
          versionName: name,
        },
        page: {
          size: this.state.pageSize,
          curpage: 1,
        },
      },
    });
  };
  // pageSizeChange = (value) => {
  //     this.setState({
  //         pageSize:value,
  //     })
  //     const name = document.getElementById("versionName").value;
  //     this.props.dispatch({
  //         type: 'publish/applicationPageDetails',
  //         payload: {
  //             searchParams: {
  //                 appId: this.state.appId ,
  //                 versionName: name,
  //             },
  //             page: {
  //                 size: this.state.pageSize,
  //                 curpage: 1
  //             }
  //         },
  //     });
  // }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading, selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      onSelect: record => {
        this.setState({
          versionId: record.versionId,
          state: record.state,
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
        title: '版本名称',
        dataIndex: 'versionName',
        align: 'center',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        align: 'center',
        render: text => <span>{text && moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '创建人',
        dataIndex: 'userName',
        align: 'center',
      },
      {
        title: '状态',
        dataIndex: 'stateName',
        align: 'center',
      },
      {
        title: '操作',
        dataIndex: 'done',
        align: 'center',
        render: (text, record, index) => (
          <span>
            {getTags().indexOf('version-update') != -1 && (
              <Button
                size="small"
                onClick={this.showModal.bind(this, [record.versionId, '修改'])}
                disabled={record.state === 2 ? true : record.state === 1 ? true : false}
              >
                修改
              </Button>
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
                  label="版本名称"
                  style={{ width: 280, float: 'left' }}
                >
                  {getFieldDecorator('versionName', {
                    initialValue: this.state.name,
                  })(<Input placeholder="请输入版本名称" className={styles.antInputText} />)}
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
                  <TitleItem title="版本管理" />
                  {getTags().indexOf('version-add') != -1 && (
                    <Button
                      type="primary"
                      className={styles.btn}
                      onClick={this.showModal.bind(this, '新增')}
                    >
                      新增
                    </Button>
                  )}
                  {getTags().indexOf('version-delete') != -1 && (
                    <Popconfirm
                      placement="bottomRight"
                      title="是否确认删除此版本？"
                      onConfirm={
                        this.state.selectedRowKeys.length === 0 ? this.deletErr : this.deleteBtn
                      }
                      okText="确定"
                      cancelText="取消"
                    >
                      <Button className={styles.btn}>删除</Button>
                    </Popconfirm>
                  )}
                  {getTags().indexOf('version-review') != -1 && (
                    <Button
                      className={styles.btn}
                      onClick={this.auditingShowModal}
                      disabled={this.state.state === 1 && hasSelected ? false : true}
                      loading={loading}
                    >
                      审核
                    </Button>
                  )}
                  {getTags().indexOf('version-submit') != -1 && (
                    <Button
                      className={styles.btn}
                      onClick={this.auditing}
                      disabled={
                        !hasSelected
                          ? true
                          : this.state.state === 3 ? false : this.state.state === 0 ? false : true
                      }
                      loading={loading}
                    >
                      提交审核
                    </Button>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Table
              columns={columns}
              dataSource={this.state.data}
              bordered
              rowKey={record => record.versionId}
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
          <ApplicationModal
            wrappedComponentRef={this.saveFormRef}
            visible={this.state.visible}
            onCancel={this.handleCancel}
            onCreate={this.checkUpload}
            appId={this.state.appId}
            appName={this.state.appName}
            btnTag={this.state.btnTag}
            btnTagFirst={this.state.btnTagFirst}
          />
          <AuditingModal
            wrappedComponentRef={this.saveFormRef1}
            visible={this.state.auditingVisible}
            onCancel={this.auditingCancel}
            onCreate={this.auditingCreate}
          />
        </div>
      </PageHeaderLayout>
    );
  }
}
