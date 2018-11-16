import { Button, Modal, Form, Input, Select, Upload, Icon, message } from 'antd';
const { TextArea } = Input;
const FormItem = Form.Item;
const Option = Select.Option;
import { connect } from 'dva';
import jqy from "jquery";

@connect(({ manage, loading }) => ({
    manage,
}))
@Form.create()
export default class CreateWorkList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    componentWillMount() {
    }
    componentWillReceiveProps(nextProps) {
        const next = nextProps.manage;
        if (next.resultCode == 2014 && next.returnType == "checkUser") {
            next.resultCode = 0;
            this.props.form.setFields({
                mail: {
                    errors: [new Error('该邮箱未注册！')],
                },
            });
        }
        if (next.resultCode == 2017 && next.returnType === 'checkPhone') {
            next.resultCode = 0;
            setTimeout(() => {
                this.props.form.setFields({
                    phone: {
                        errors: [new Error('手机号未注册！')],
                    },
                });
            }, 500);
        }
    }
    checkUser = (rule) => {
        this.props.form.validateFields("mail", { force: true }, (err, values) => {
            if (!err) {
                this.props.dispatch({
                    type: 'manage/checkUser',
                    payload: {
                        userMail: values.mail,
                    },
                });
            }
        });
    }
    checkPhone = (rule) => {
        this.props.form.validateFields("phone", { force: true }, (err, values) => {
            if (!err) {
                this.props.dispatch({
                    type: 'manage/checkPhone',
                    payload: {
                        userId: "",
                        phone: values.phone,
                    },
                });
            }
        });
    };

    handleChange = (info) => {
        let fileList = info.fileList;
        if (info.fileList.length > 1) {
            info.fileList.splice(0, info.fileList.length - 1);
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name} 上传成功！`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 上传失败！`);
        }
    }

    beforeUpload = (file) => {
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isLt10M) {
            message.error('上传文件不能超过10MB!');
        }
        return isLt10M;
    }
    messageDetail = (e) => {
        jqy("#message").val(jqy.trim(jqy("#message").val()));
    }
    render() {
        const { visible, onCancel, onCreate, form, applicationlistDatas } = this.props;
        const { getFieldDecorator } = form;
        const applicationlist = applicationlistDatas.map((applicationlistData, index) => <Option value={applicationlistData.appId} key={applicationlistData.appId}>{applicationlistData.appName}</Option>);
        const formItemLayout = {
            labelCol: {
                span: 5
            },
            wrapperCol: {
                span: 19
            },
        };
        const props = {
            name: 'file',
            action: '/api/saas-server/file/upload',
            onChange: this.handleChange,
            beforeUpload: this.beforeUpload,
            multiple: false,
            listType: "text",
            accept: ["application/pdf"],
        };
        return (
            <Modal
                visible={visible}
                title="新建工单"
                okText="保存"
                onCancel={onCancel}
                onOk={onCreate}
            >
                <Form>
                    <FormItem
                        {...formItemLayout}
                        label="应用名称">
                        {getFieldDecorator('appId', {
                            rules: [{
                                required: true,
                                message: '请选择应用名称'
                            }],
                        })(
                            <Select placeholder="请选择">
                                {applicationlist}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="问题类型">
                        {getFieldDecorator('subject', {
                            rules: [{
                                required: true,
                                message: '请选择问题类型！',
                            },]
                        })(
                            <Select placeholder="请选择">
                                <Option value="1">售前</Option>
                                <Option value="2">售后</Option>
                                <Option value="3">保修</Option>
                                <Option value="4">发票</Option>
                                <Option value="5">退款</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="问题描述">
                        {getFieldDecorator('message', {
                            rules: [{
                                required: true,
                                message: '请输入问题描述！',
                            },
                            {
                                max: 200,
                                message: '问题描述不能超过200个字符!',
                            },
                            ]
                        })(
                            <TextArea rows={8} onChange={this.messageDetail} placeholder="问题描述" />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout}
                        label="手机号">
                        {getFieldDecorator('phone', {
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
                        {getFieldDecorator('mail', {
                            rules: [{
                                required: true,
                                message: '请输入用户邮箱！',
                            },
                            {
                                type: 'email',
                                message: '用户邮箱格式错误！',
                            },
                            {
                                max: 50,
                                message: '用户邮箱不能超过50个字符!',
                            },
                            ],
                        })(
                            <Input placeholder="用户邮箱" onBlur={this.checkUser} />
                        )}
                    </FormItem>
                    {/* <FormItem {...formItemLayout} label="上传附件">
                        {getFieldDecorator('attachmentFileId')(
                            <Upload {...props}>
                                <Button>
                                    <Icon type="upload" /> 上传
                            </Button>
                            </Upload>
                        )}
                    </FormItem> */}
                </Form>
            </Modal>
        );
    }
}