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
  TextArea,
} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { PayWay } from '../Order/PayWay';
import { PayResult } from '../Order/PayResult';
import style from './Order.less';
import '../../common.less';

import jsonp from 'fetch-jsonp';
import querystring from 'querystring';
import jqy from 'jquery';

@connect(({ publish, product, order, loading }) => ({
  publish,
  product,
  order,
  submitting: loading.effects['publish/applicationPage'],
}))
@Form.create()
export default class ApplicationConfig extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      companyData: [],
      priceList: [],
      companyName: '',
      showCompany: false,
      companyTag: false,
      styleIndex: 0,
      customizedJson: '',
      currentPrice: 0,

      payWayVisible: false,
      payResultVisible: false,
      buyData: {},
      appShortName: '',
    };
  }
  componentWillMount() {
    this.props.dispatch({
      type: 'product/queryHasCompany',
    });
  }

  componentWillReceiveProps(nextProps) {
    const nextPublish = nextProps.publish;
    const nextProduct = nextProps.product;
    const nextOrder = nextProps.order;
    const next = nextProps.publish;
    if (nextPublish.returnType === 'queryUser' && nextPublish.resultCode === 1000) {
      this.setState({
        data: nextPublish.resultData,
      });
    }
    if (nextProduct.returnType === 'queryCompany' && nextProduct.resultCode === 1000) {
      if (nextProduct.data.length > 0) {
        this.setState({
          companyData: nextProduct.data,
          companyTag: false,
        });
      } else {
        this.setState({
          companyTag: true,
        });
      }
    }
    if (nextProduct.returnType === 'queryVersion' && nextProduct.resultCode === 1000) {
      nextProduct.returnType = '';
      this.props.form.setFieldsValue({
        appName: nextProduct.data.appName,
        appId: nextProduct.data.appId,
        versionId: nextProduct.data.versionId,
      });
      this.props.dispatch({
        type: 'product/priceList',
        payload: {
          appId: nextProduct.data.appId,
          versionId: nextProduct.data.versionId,
        },
      });
      this.setState({
        appShortName: nextProduct.data.appShortName,
      });
    }
    if (nextProduct.returnType === 'priceList' && nextProduct.resultCode === 1000) {
      nextProduct.returnType = '';
      this.setState({
        priceList: nextProduct.data,
        customizedJson: nextProduct.data[0].configJson,
        currentPrice: nextProduct.data[0].price,
      });
    }
    if (nextProduct.returnType === 'creatOrder' && nextProduct.resultCode === 1000) {
      nextProduct.returnType = '';
      this.setState({
        payWayVisible: true,
        buyData: nextProduct.data,
      });
    }
    if (nextProduct.returnType === 'creatOrder' && nextProduct.resultCode !== 1000) {
      nextProduct.returnType = '';
      message.error(nextProduct.desc);
    }
    if (nextProduct.returnType === 'domainName' && nextProduct.resultCode !== 1000) {
      nextProduct.returnType = '';
      this.props.form.setFields({
        vhDomainName: {
          value: '',
          errors: [new Error('域名重复请重新输入')],
        },
      });
    }

    if (nextOrder.returnType === 'createXianxia' && nextOrder.resultCode === 1000) {
      nextOrder.returnType = '';
      message.success("购买成功！");
      this.props.dispatch(
        routerRedux.push({
          pathname: '/order/manage-order',
        })
      );
    }
    if (nextOrder.returnType === 'createXianxia' && nextOrder.resultCode !== 1000) {
      message.error(nextOrder.desc);
    }
    if (nextOrder.returnType === 'verifyConstract' && nextOrder.resultCode !== 1000) {
      nextOrder.returnType = '';
      const form = this.formRef.props.form;
      const contractNumber = form.getFieldValue('contractNumber');
      setTimeout(() => {
        form.setFields({
          contractNumber: {
            value: contractNumber,
            errors: [new Error(nextOrder.desc)],
          },
        });
      }, 500);
    }
    if (nextOrder.returnType === 'verifyConstract' && nextOrder.resultCode === 1000) {
      nextOrder.returnType = '';
      const form = this.formRef.props.form;
      form.validateFields((error, values) => {
        values.payType = Number(values.payType);
        values.orderId = this.state.buyData.orderId;
        values.appId = this.state.buyData.appId;
        values.orderDetId = this.state.buyData.orderDetId;
        this.props.dispatch({
          type: 'order/createXianxia',
          payload: {
            ...values,
          },
        });
      });
    }
    if (nextProduct.returnType === 'queryHasCompany' && nextProduct.resultCode === 1000) {
      // nextProduct.returnType = "";
      if (!!nextProduct.data.companyName) {
        const companyName = nextProduct.data.companyName;
        const companyId = nextProduct.data.companyId;
        this.setState({
          showCompany: true,
          companyId: companyId,
          companyName: companyName,
        });
      }
    }
  }

  handleSearch = value => {
    // this.fetch(value, data => this.setState({ data }));
    this.props.dispatch({
      type: 'publish/queryUser',
      payload: {
        mail: value,
        type: '4',
        companyId:this.state.companyId,
      },
    });
  };

  handleChange = value => {};
  companySearch = value => {
    if (!!value) {
      this.setState({
        companyName: value,
      });
    }
    this.props.dispatch({
      type: 'product/queryCompany',
      payload: {
        companyName: value,
      },
    });
  };

  companyChange = value => {
    // if(!!value){
    //     this.state.companyData.map((item,index) =>{
    //         if(item.companyId === value){
    //             this.setState({
    //                 companyName:item.companyName
    //             })
    //             return
    //         }
    //     })
    // }
  };
  conpanyBlur = () => {
    if (this.state.companyTag) {
      this.props.form.setFieldsValue({
        companyName: this.state.companyName,
        companyId: this.state.companyName,
      });
    } else {
      this.props.form.setFieldsValue({
        companyName: '',
      });
    }
  };
  domainName = () => {
    this.props.dispatch({
      type: 'product/domainName',
      payload: {
        appId: this.props.appId,
        prefix: this.props.form.getFieldValue('vhDomainName'),
      },
    });
  };

  changePrice = list => {
    this.setState({
      styleIndex: list[0],
      customizedJson: list[1],
      currentPrice: list[2],
    });
  };

  handleCancel = () => {
    this.props.onCancel();
    this.setState({ payWayVisible: false });
  };
  payResultOk = () => {
    this.props.dispatch(
      routerRedux.push({
        pathname: '/order/manage-order',
      })
    );
  };
  payResultCancel = () => {
    this.props.dispatch(
      routerRedux.push({
        pathname: '/order/income-expenses',
      })
    );
  };
  // 提交
  handleCreate = () => {
    const form = this.formRef.props.form;

    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      values.payType = Number(values.payType);
      values.orderId = this.state.buyData.orderId;
      values.appId = this.state.buyData.appId;
      values.orderDetId = this.state.buyData.orderDetId;
      if (values.payType === 4) {
        const contractNumber = values.contractNumber;
        this.props.dispatch({
          type: 'order/verifyConstract',
          payload: {
            contractNumber: contractNumber,
          },
        });
        return false;
      }
      fetch('/api/saas/pay/create', {
        method: 'POST',
        // mode: 'same-origin',
        // mode: 'cors',
        body: JSON.stringify(values),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(res => {
          return res.text();
        })
        .then(data => {
          setTimeout(function() {
            const tempwindow = window.open('_blank');
            tempwindow.document.write(data);
          }, 500);
          this.setState({
            payWayVisible: false,
            payResultVisible: true,
          });
          this.props.payResultShow();
          this.props.onCancel();
        })
        .catch(err => console.log(err));
      form.resetFields();
    });
  };
  yearChange = val => {
    this.setState({
      buyYears: val,
    });
  };
  saveFormRef = formRef => {
    this.formRef = formRef;
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

    const optionData = this.state.data;
    const optionDoms = [];
    optionData.forEach(item => {
      const key = item.userId;
      const val = item.userMail;
      optionDoms.push(<Option key={key}>{val}</Option>);
      return optionDoms;
    });
    const companyData = this.state.companyData;
    const companyDoms = [];
    companyData.forEach(item => {
      const key = item.companyId;
      const val = item.companyName;
      companyDoms.push(<Option key={key}>{val}</Option>);
      return companyDoms;
    });
    const priceList = [];
    // alert(this.state.priceList);
    this.state.priceList.forEach((item, index) => {
      var p;
      if (typeof item.configJson == 'string') {
        JSON.parse(item.configJson);
        p = eval('(' + item.configJson + ')');
      } else if (Array.isArray(item.configJson) || typeof item.configJson === 'object') {
        p = item.configJson;
      }
      const mapList = [];
      const _index = index;
      if (!!p) {
        const len = p.length - 1;
        p.map((list, index) => {
          mapList.push(
            <p data-index={_index}>
              <span data-index={_index} title={list.name} className={style.priceName}>
                {list.name}
              </span>:
              <span data-index={_index}> {list.value}</span>
            </p>
          );
          if (len === index) {
            mapList.push(
              <p data-index={_index}>
                <span data-index={_index} className={style.priceName}>
                  单价:
                </span>
                <span data-index={_index}> {item.price}</span>
              </p>
            );
          }
        });
        priceList.push(
          <li
            className={index === this.state.styleIndex ? style.li_action : ''}
            data-index={index}
            onClick={this.changePrice.bind(this, [index, item.configJson, item.price])}
          >
            {mapList}
          </li>
        );
      }
      return priceList;
    });

    return (
      <Modal
        visible={visible}
        title="订购应用配置信息"
        okText="保存"
        onCancel={onCancel}
        onOk={onCreate.bind(this, [
          this.state.currentPrice,
          this.state.customizedJson,
          this.state.showCompany,
        ])}
      >
        <Form>
          <FormItem {...formItemLayout} label="产品名称">
            {getFieldDecorator('appName', {})(<Input placeholder="产品名称" disabled />)}
            {getFieldDecorator('appId', {})(<Input type="hidden" />)}
            {getFieldDecorator('versionId', {})(<Input type="hidden" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="管理员邮箱">
            {getFieldDecorator('adminId', {
              rules: [
                {
                  required: true,
                  message: '请输入管理员邮箱！',
                },
                {
                  pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/,
                  message: '邮箱格式错误！',
                },
              ],
            })(
              <Select
                showSearch
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                onSearch={this.handleSearch}
                onChange={this.handleChange}
                notFoundContent={null}
              >
                {optionDoms}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="公司名称">
            {!this.state.showCompany
              ? getFieldDecorator('companyId', {
                  rules: [
                    {
                      required: true,
                      message: '请输入管理者名称！',
                    },
                    {
                      max: 40,
                      message: '公司名称长度不能超过40个字符!',
                    },
                  ],
                })(
                  <Select
                    showSearch
                    // defaultValue={0}
                    defaultActiveFirstOption={false}
                    showArrow={false}
                    filterOption={false}
                    onSearch={this.companySearch}
                    onChange={this.companyChange}
                    onBlur={this.conpanyBlur}
                    notFoundContent={null}
                  >
                    {companyDoms}
                  </Select>
                )
              : getFieldDecorator('companyName', {
                  initialValue: this.state.companyName,
                })(<Input disabled />)}
            {!this.state.showCompany
              ? getFieldDecorator('companyName', {
                  initialValue: this.state.companyName,
                })(<Input type="hidden" />)
              : getFieldDecorator('companyId', {
                  initialValue: this.state.companyId,
                })(<Input type="hidden" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="访问域名">
            {getFieldDecorator('vhDomainName', {
              rules: [
                {
                  required: true,
                  message: '请输入访问域名！',
                },
                {
                  max: 40,
                  message: '访问域名长度不能超过40个字符!',
                },
                {
                  pattern: /^[A-Za-z0-9]+$/,
                  message: '访问域名为数字或英文字母！',
                },
              ],
            })(
              <Input
                placeholder="请输入访问域名！"
                onBlur={this.domainName}
                style={{ width: '200px' }}
              />
            )}
            <span className="ant-form-text">.{this.state.appShortName}.vhsaas.com</span>
          </FormItem>
          <FormItem {...formItemLayout} label="购买年限">
            {getFieldDecorator('buyYears', {
              rules: [
                {
                  required: true,
                  message: '请输入购买年限！',
                },
              ],
            })(<InputNumber min={1} max={10} style={{ width: '100%' }} />)}
          </FormItem>
        </Form>
        <ul id="priceList" className={style.priceList}>
          {priceList}
        </ul>
        <PayWay
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.payWayVisible}
          title="支付方式"
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
        />
        {/*<PayResult*/}
        {/*visible={this.state.payResultVisible}*/}
        {/*payResultCancel={this.payResultCancel}*/}
        {/*payResultOk={this.payResultOk}*/}
        {/*/>*/}
      </Modal>
    );
  }
}
