import { Button, Modal, Form, Input, Select, Cascader } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import styles from "./Manage.less";
import { connect } from 'dva';
@connect(({ manage, loading }) => ({
    manage,
    // submitting: loading.effects['manage/submit'],
}))
@Form.create()
export default class CreateNewUserModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],  //companyId列表
            companyId: "",
            treeDatas: [],
        }
    }
    componentWillMount() {
        // this.props.dispatch({
        //     type: 'manage/getCompanyId',
        // });
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.treeDatas !== this.props.treeDatas) {
            this.setState({ treeDatas: nextProps.treeDatas });
          }
        const next = nextProps.manage;
        // if(next.returnType === "companyList" && next.resultCode == 1000 ) {
        //     this.setState({
        //         list: next.list,
        //     })
        // }

        if (next.returnType === "checkUser" && next.resultCode == 2005) {
            next.resultCode = 0;
            setTimeout(() => {
                this.props.form.setFields({
                    userEmail: {
                        value:"",
                        errors: [new Error('邮箱已注册')],
                    },
                });
            }, 500);
        }
        if (next.returnType === "getTreeData" && next.resultCode == 1000) {
            next.returnType = "";
            this.setState({
                treeDatas: next.treeDatas,
            })
        }
        if (next.resultCode == 2004 && next.returnType === 'checkPhone') {
            next.returnType = "";
            setTimeout(() => {
                this.props.form.setFields({
                    userPhone: {
                        value: "",
                        errors: [new Error('手机号重复！')],
                    },
                });
            }, 500);
        }
        //   next.returnType ="";
    }
    checkUser = (rule) => {
        this.props.form.validateFields("userEmail", { force: true }, (err, values) => {
            if (!err) {
                this.props.dispatch({
                    type: 'manage/checkUser',
                    payload: {
                        userMail: values.userEmail,
                    },
                });
            }
        });
    }
    checkPhone = () => {
        this.props.form.validateFields("userPhone", { force: true }, (err, values) => {
            if (!err) {
                this.props.dispatch({
                    type: 'manage/checkPhone',
                    payload: {
                        userId: "",
                        phone: values.userPhone,
                    },
                });
            }
        });
    };
    displayRender = (label) => {
        return label[label.length - 1];
    }
    onChange = (value) => {
        const leafId = value[value.length - 1];
        this.props.leafIdOfCreate(leafId);
    }
    handleChange = (value) => {
        this.props.dispatch({
            type: 'manage/getTreeData',
            payload: {
                companyId: value.key,
            },
        });
    }
    render() {
        const { visible, onCancel, onCreate, form, companyIdList } = this.props;
        const { getFieldDecorator } = form;
        // const companyIdList = this.state.list.map((companyIdItem, index) => <Option value={companyIdItem.companyId} key={companyIdItem.companyId}>{companyIdItem.companyName}</Option>);
        const formItemLayout = {
            labelCol: {
                span: 5
            },
            wrapperCol: {
                span: 19
            },
        };
        return (
            <Modal
                visible={visible}
                title="新增用户信息"
                okText="保存"
                onCancel={onCancel}
                onOk={onCreate}
            >
                <Form>
                    <FormItem
                        {...formItemLayout}
                        label="用户名">
                        {getFieldDecorator('userName', {
                            rules: [{
                                required: true,
                                message: '请输入用户名！'
                            }, {
                                pattern: /^.{0,40}$/,
                                message: '用户名不能超过40个字符！',
                            },],
                        })(
                            <Input placeholder="用户名" />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout}
                        label="手机号">
                        {getFieldDecorator('userPhone', {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入手机号！',
                                },
                                {
                                    pattern: /^1\d{10}$/,
                                    message: '手机号格式错误！',
                                },
                            ],
                        })(<Input placeholder="手机号" onBlur={this.checkPhone} />)}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="用户邮箱">
                        {getFieldDecorator('userEmail', {
                            rules: [{
                                required: true,
                                message: '请输入用户邮箱！',
                            },
                            {
                                pattern: /^.{0,50}$/,
                                message: '用户邮箱不能超过50个字符！',
                            },
                            {
                                type: 'email',
                                message: '用户邮箱格式错误！',
                            },
                            ],
                        })(
                            <Input placeholder="用户邮箱" onBlur={this.checkUser} />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="用户类型">
                        {getFieldDecorator('userType', {
                            rules: [{
                                required: true,
                                message: '请输入用户类型！',
                            },]
                        })(
                            <Select placeholder="请选择">
                                <Option value="1">SAAS管理员</Option>
                                <Option value="2">服务提供方</Option>
                                <Option value="3">服务购买方</Option>
                                <Option value="4">业务用户</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="单位名称">
                        {getFieldDecorator('companyId', {
                            // rules: [{
                            //     required: true,
                            //     message: '请输入单位ID！',
                            // },]
                        })(
                            <Select placeholder="请选择" onChange={this.handleChange} labelInValue>
                                {companyIdList}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="所属部门">
                        {getFieldDecorator('departmentId', {
                            // rules: [{
                            //     required: true,
                            //     message: '请输入部门ID！',
                            // },]
                        })(
                            <Cascader options={this.state.treeDatas} displayRender={this.displayRender} onChange={this.onChange} placeholder="请选择" changeOnSelect allowClear={false}/>
                        )}
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}