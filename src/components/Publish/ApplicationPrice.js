import {
  Upload,
  message,
  Button,
  Icon,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Cascader,
  Table,
  Popconfirm,
} from 'antd';

const Option = Select.Option;
import { connect } from 'dva';
import { createForm } from 'rc-form';
import style from './Publish.less';
import '../../common.less';

import jsonp from 'fetch-jsonp';
import querystring from 'querystring';
import $ from 'jquery';

const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);
var test = {};
var form = new Object();
class EditableCell extends React.Component {
  state = {
    editing: false,
    test: {},
  };

  componentDidMount() {
    if (this.props.editable) {
      document.addEventListener('click', this.handleClickOutside, true);
    }
  }

  componentWillUnmount() {
    if (this.props.editable) {
      document.removeEventListener('click', this.handleClickOutside, true);
    }
  }

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };

  handleClickOutside = e => {
    const { editing } = this.state;
    if (editing && this.cell !== e.target && !this.cell.contains(e.target)) {
      this.save();
    }
  };

  save = () => {
    const { record, handleSave } = this.props;
    form = this.form;
    this.form.validateFields((error, values) => {
      if (error) {
        test = error;
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  };

  formObj = () => {
    return form;
  };

  render() {
    const { editing } = this.state;
    const { editable, dataIndex, title, record, index, handleSave, ...restProps } = this.props;
    return (
      <td ref={node => (this.cell = node)} {...restProps}>
        {editable ? (
          <EditableContext.Consumer>
            {form => {
              this.form = form;
              return editing ? (
                <FormItem style={{ margin: 0 }}>
                  {dataIndex === 'value'
                    ? form.getFieldDecorator(dataIndex, {
                        rules: [
                          {
                            required: true,
                            message: `${title}不能为空！`,
                          },
                          {
                            max: 40,
                            message: `${title}长度不能超过40个字符!`,
                          },
                          {
                            pattern: /^[A-Za-z0-9]+$/,
                            message: '值为数字或英文字母！',
                          },
                        ],
                        initialValue:
                          record[dataIndex].indexOf(`请输入${title}！`) == -1
                            ? record[dataIndex]
                            : '',
                      })(<Input ref={node => (this.input = node)} onPressEnter={this.save} />)
                    : form.getFieldDecorator(dataIndex, {
                        rules: [
                          {
                            required: true,
                            message: `${title}不能为空！`,
                          },
                          {
                            max: 40,
                            message: `${title}长度不能超过40个字符!`,
                          },
                        ],
                        initialValue:
                          record[dataIndex].indexOf(`请输入${title}！`) == -1
                            ? record[dataIndex]
                            : '',
                      })(<Input ref={node => (this.input = node)} onPressEnter={this.save} />)}
                </FormItem>
              ) : (
                <div className="editable-cell-value-wrap" onClick={this.toggleEdit}>
                  {restProps.children}
                </div>
              );
            }}
          </EditableContext.Consumer>
        ) : (
          restProps.children
        )}
      </td>
    );
  }
}
const WrappedAdvancedSearchFormWithRef = Form.create()(EditableCell);
@connect(({ publish, loading }) => ({
  publish,
  submitting: loading.effects['publish/applicationPage'],
}))
@Form.create()
export default class ApplicationPrice extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '名称',
        dataIndex: 'name',
        editable: true,
      },
      {
        title: '标签',
        dataIndex: 'tag',
        editable: true,
      },
      {
        title: '值',
        dataIndex: 'value',
        editable: true,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => {
          return this.state.dataSource.length > 1 ? (
            <Popconfirm title="确定删除?" onConfirm={() => this.handleDelete(record.key)}>
              <a href="javascript:;">删除</a>
            </Popconfirm>
          ) : null;
        },
      },
    ];

    this.state = {
      // dataSource: [{
      //     key: '0',
      //     name: '请输入名称！',
      //     tag: '请输入标签！',
      //     value: '请输入值！',
      // }],
      initSource: [],
      dataSource: [],
      count: 1,
    };
  }
  // componentWillUpdate(){
  //     this.setState({
  //         dataSource:this.props.priceSource
  //     })
  // }
  componentWillReceiveProps(nextProps) {
    if (this.state.initSource.length === 0 || this.state.initSource !== nextProps.priceSource) {
      const count = nextProps.priceSource.length;
      this.setState({
        dataSource: nextProps.priceSource,
        initSource: nextProps.priceSource,
        count: count,
      });
    }
  }

  handleDelete = key => {
    const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
  };

  handleAdd = () => {
    const { count, dataSource } = this.state;
    const newData = {
      key: count,
      name: '请输入名称！',
      tag: '请输入标签！',
      value: '请输入值！',
    };
    const data = [];
    const reg = /^[A-Za-z0-9]+$/;
    data.push(dataSource[dataSource.length - 1]);
    // const err = this.formRef.formObj();
    // if(!!err.validateFields){
    //     err.validateFields((error, values)=>{
    //         if(error){
    //             console.log(error)
    //             return false;
    //         }
    //     })
    // }
    data.forEach((item, index) => {
      for (let v in item) {
        if (v === 'value' && !reg.test(item[v])) {
          message.error('值为数字或英文字母！');
          return;
        }
        if (v !== 'key') {
          switch (item[v]) {
            case '请输入名称！': {
              message.error('请输入名称、标签或值！');
              return;
            }
            case '请输入标签！': {
              message.error('请输入名称、标签或值！');
              return;
            }
            case '请输入值！': {
              message.error('请输入名称、标签或值！');
              return;
            }
          }
        }
      }

      this.setState({
        dataSource: [...dataSource, newData],
        count: count + 1,
      });
    });
  };

  handleSave = row => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({ dataSource: newData });
  };

  render() {
    const { visible, onCancel, onCreate, form } = this.props;
    const { getFieldDecorator } = form;
    const { TextArea } = Input;
    const formItemLayout = {
      labelCol: {
        span: 5,
      },
      wrapperCol: {
        span: 19,
      },
    };
    const { dataSource } = this.state;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    return (
      <Modal
        visible={this.props.visible}
        title="价格信息"
        okText="保存"
        onCancel={this.props.onCancel}
        onOk={this.props.onCreate.bind(this, this.state.dataSource)}
        destroyOnClose
      >
        <Form>
          <FormItem {...formItemLayout} label="单价/年">
            {getFieldDecorator('price', {
              rules: [
                {
                  required: true,
                  message: '请输入单价！',
                },
              ],
            })(
              <InputNumber
                placeholder="请输入单价!"
                min={1}
                max={9999999}
                style={{ width: '100%' }}
              />
            )}
          </FormItem>
        </Form>
        <div>
          <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
            <Icon type="plus-square" />添加
          </Button>
          <Table
            components={components}
            rowClassName={() => 'editable-row'}
            bordered
            dataSource={dataSource}
            columns={columns}
            pagination={false}
          />
          <WrappedAdvancedSearchFormWithRef wrappedComponentRef={inst => (this.formRef = inst)} />
        </div>
      </Modal>
    );
  }
}
