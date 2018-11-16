import { Modal, Form ,Button } from 'antd';
const FormItem = Form.Item;
import { connect } from 'dva';
import { userTypeConst, userStateConst } from '../../common.js';
import '../../common.less';
import styles from './UserCentre.less';

@connect(({ manage }) => ({
    manage
}))
@Form.create()
export default class UserCentre extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        const { visible, onCancel, onCreate, defaultdatas } = this.props;
        const formItemLayout = {
            labelCol: {
                span: 5,
            },
            wrapperCol: {
                span: 19,
            },
        };
        return (
            <Modal
                visible={visible}
                title="用户信息"
                okText="确定"
                onCancel={onCancel}
                onOk={onCreate}
                footer={<Button onClick={this.props.onCancel} type="primary">确定</Button>}
            >
                <Form>
                    <FormItem {...formItemLayout} label="用户名">
                        <span>{defaultdatas.userName}</span>
                    </FormItem>
                    <FormItem {...formItemLayout} label="手机号">
                        <span>{defaultdatas.userPhone}</span>
                    </FormItem>
                    <FormItem {...formItemLayout} label="用户邮箱">
                        <span>{defaultdatas.userMail}</span>
                    </FormItem>
                    <FormItem {...formItemLayout} label="用户类型">
                        <span>{userTypeConst[`${defaultdatas.userType}`]}</span>
                    </FormItem>
                    <FormItem {...formItemLayout} label="用户状态">
                        <span>{userStateConst[`${defaultdatas.state}`]}</span>
                    </FormItem>
                    <FormItem {...formItemLayout} label="单位名称">
                        <span>{defaultdatas.companyName}</span>
                    </FormItem>
                    <FormItem {...formItemLayout} label="所属部门">
                        <span>{defaultdatas.departmentName}</span>
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}
