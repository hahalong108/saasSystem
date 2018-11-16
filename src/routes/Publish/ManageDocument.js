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
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import CreateNewDocumentModal from '../../components/Publish/CreateNewDocumentModal.js';
import jqy from 'jquery';
import { pageSize, getTags } from '../../common.js';
import TitleItem from '../../components/common/TitleItem.js';
import TextEllipsis from '../../components/TextEllipsis/TextEllipsis.js';
import '../../common.less';
import moment from 'moment';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const Option = Select.Option;

@connect(({ publish, loading }) => ({
  publish,
  submitting: loading.effects['publish/documentPage'],
}))
@Form.create()
export default class ManageDocument extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      page: {},
      name: '',
      selectedRowKeys: [],
      loading: false,
      visible: false,
      pageSize: pageSize,
      appIdDatas: [],
      dictListDatas: [],
      dataSource: [],
    };
  }
  componentWillMount() {
    this.props.dispatch({
      type: 'publish/documentPage',
      payload: {
        searchParams: { name: '' },
        page: {
          size: this.state.pageSize,
          curpage: 1,
        },
      },
    });
    this.props.dispatch({
      type: 'publish/dictList',
      payload: {
        tabName: 'td_saas_document',
        tabColumn: 'document_type',
      },
    });
  }
  componentDidMount() {}
  componentWillReceiveProps(nextProps) {
    const next = nextProps.publish;
    if (next.returnType === 'documentPage' && next.resultCode == 1000) {
      this.setState({
        data: next.resultData,
        page: next.resultPage,
        name: document.getElementById('name').value,
      });
    }
    if (next.returnType === 'getAppId' && next.resultCode == 1000) {
      this.setState({
        appIdDatas: next.resultData,
      });
    }
    if (next.returnType === 'dictList' && next.resultCode == 1000) {
      this.setState({
        dictListDatas: next.resultData,
      });
    }
    if (next.returnType === 'createDocument' && next.resultCode == 1000) {
      message.success('文档添加成功！');
      var currentPage = jqy.trim(jqy('.ant-pagination-item-active a').text());
      if (currentPage == '' || currentPage == undefined) {
        currentPage = 1;
      }
      this.props.dispatch({
        type: 'publish/documentPage',
        payload: {
          searchParams: { name: this.state.name },
          page: {
            size: this.state.pageSize,
            curpage: currentPage,
          },
        },
      });
    }
    if (next.returnType === 'deleteDocument' && next.resultCode == 1000) {
      message.success('文档删除成功！');
      this.props.dispatch({
        type: 'publish/documentPage',
        payload: {
          searchParams: { name: this.state.name },
          page: {
            size: this.state.pageSize,
            curpage: 1,
          },
        },
      });
    }
    // next.returnType = "";
  }
  // 新增文档 start
  showModal = () => {
    this.setState({
      visible: true,
      dataSource: [],
    });
    this.props.dispatch({
      type: 'publish/getAppId',
    });

    const form = this.formRef.props.form;
    form.setFields({
      addDocument: {
        errors: [new Error('')],
      },
    });
    form.resetFields();
  };
  handleCancel = e => {
    this.setState({
      visible: false,
      dataSource: [],
    });
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
        if (values.versionId.key == '0') {
          form.setFields({
            versionId: {
              value:"",
              errors: [new Error('请选择应用版本号！')],
            },
          });
          return;
        } else if (Object.keys(values).length == 3) {
          form.setFields({
            addDocument: {
              errors: [new Error('至少添加一个文档！')],
            },
          });
          return;
        } else {
          const trans = json => {
            if (!json) return;
            if ('' + json !== '[object Object]') return;
            var documents = [];
            Object.keys(json).forEach(key => {
              if (/^documentType/.test(key)) {
                documents.push({
                  documentType: json[key].key,
                  fileId:
                    json[`fileId${key.replace('documentType', '')}`].file.response.data.fileId,
                });
                delete json[key];
                delete json[`fileId${key.replace('documentType', '')}`];
              }
            });
            return documents;
          };
          const documents = trans(values);
          this.formRef.props.dispatch({
            type: 'publish/createDocument',
            payload: {
              appId: values.appId.key,
              versionId: values.versionId.key,
              documents,
            },
          });
        }
      }
      form.resetFields();
      this.setState({
        visible: false,
        dataSource: [],
      });
    });
  };
  saveFormRef = formRef => {
    this.formRef = formRef;
  };
  // 新增文档 end

  // 删除文档 start
  delete = () => {
    this.setState({ loading: true });
    const deleteDocumentId = this.state.selectedRowKeys;
    this.props.dispatch({
      type: 'publish/deleteDocument',
      payload: deleteDocumentId,
    });
    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
        loading: false,
      });
    }, 1000);
  };

  // 删除文档 end

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'publish/documentPage',
          payload: {
            searchParams: { name: values.name },
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
    const name = document.getElementById('name').value;
    this.props.dispatch({
      type: 'publish/documentPage',
      payload: {
        searchParams: {
          name,
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
    const name = document.getElementById('name').value;
    this.props.dispatch({
      type: 'publish/documentPage',
      payload: {
        searchParams: {
          name,
        },
        page: {
          size: value,
          curpage: 1,
        },
      },
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading, selectedRowKeys } = this.state;
    const { submitting } = this.props;
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
        title: '应用名称',
        dataIndex: 'appName',
        align: 'center',
      },
      {
        title: '版本号',
        dataIndex: 'versionName',
        align: 'center',
      },
      {
        title: '文档名称',
        dataIndex: 'documentName',
        align: 'center',
        // render: (text, record, index) => (
        //     <a href={"/api/saas-file/" + record.documentPath} target="_blank">{text}</a>
        // )

        render: (text, record, index) => (
          <a href={'/api/saas-file/' + record.documentPath} target="_blank">
            <TextEllipsis text={text} width={100} color="#02C3E6" cursor="pointer" />
          </a>
        ),
      },
      {
        title: '文档类型',
        dataIndex: 'documentTypeName',
        align: 'center',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        align: 'center',
        render: (text, record, index) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
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
                  label="文档名称"
                  style={{ width: 280, float: 'left' }}
                >
                  {getFieldDecorator('name', {
                    initialValue: this.state.name,
                  })(<Input placeholder="文档名称" className={styles.antInputText} />)}
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
                  <TitleItem title="文档管理" />
                  {getTags().indexOf('document-add') != -1 && (
                    <Button type="primary" className={styles.btn} onClick={this.showModal}>
                      新增
                    </Button>
                  )}
                  {getTags().indexOf('document-delete') != -1 && (
                    <Popconfirm
                      title="是否删除选中文档?"
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
              rowKey={record => record.documentId}
              rowSelection={rowSelection}
              pagination={false}
              loading={submitting}
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
          <CreateNewDocumentModal
            wrappedComponentRef={this.saveFormRef}
            visible={this.state.visible}
            onCancel={this.handleCancel}
            onCreate={this.handleCreate}
            appIdDatas={this.state.appIdDatas}
            dictListDatas={this.state.dictListDatas}
            dataSource={this.state.dataSource}
          />
        </div>
      </PageHeaderLayout>
    );
  }
}
