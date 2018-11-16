import React, { Component } from 'react';
import { Button, Modal, Upload, Icon, Popconfirm, message } from 'antd';
import { connect } from 'dva/index';
import { routerRedux } from 'dva/router';

@connect(({ order, loading }) => ({
  order,
  submitting: loading.effects['order/initUpload'],
}))
export class InitCollection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      initVisible: false,

      fileList: [],
      uploading: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const next = nextProps.order;
    if (next.returnType === 'initUpload' && next.resultCode === 1000) {
      next.resultCode = 0;
      this.setState({
        fileList: [],
        uploading: false,
      });
      message.success('upload successfully.');
    }
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

  // confirm = () =>{
  //
  //   this.setState({
  //     initVisible:false,
  //   });
  //
  //
  //   this.handleUpload();
  //
  //
  // }
  handleUpload = () => {
    const { fileList } = this.state;
    const formData = new FormData();
    fileList.forEach(file => {
      formData.append('files[]', file);
    });

    this.setState({
      uploading: true,
    });

    // You can use any AJAX library you like
    // reqwest({
    //   url: '//jsonplaceholder.typicode.com/posts/',
    //   method: 'post',
    //   processData: false,
    //   data: formData,
    //   success: () => {
    //     this.setState({
    //       fileList: [],
    //       uploading: false,
    //     });
    //     message.success('upload successfully.');
    //   },
    //   error: () => {
    //     this.setState({
    //       uploading: false,
    //     });
    //     message.error('upload failed.');
    //   },
    // });

    // fetch('/api/saas/file/upload', {
    //   method: 'post',
    //   headers: {
    //     "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    //   },
    //   body: formData,
    // })
    //
    //   .then(json)
    //
    //   .then(function (data) {
    //     this.setState({
    //       fileList: [],
    //       uploading: false,
    //     });
    //     message.success('upload successfully.');
    //   })
    //
    //   .catch(function (error) {
    //
    //     this.setState({
    //       uploading: false,
    //     });
    //     message.error('upload failed.');
    //   });

    this.props.dispatch({
      type: 'order/initUpload',
      payload: formData,
    });
  };

  render() {
    const text = '确定初始化此文件?';
    const { uploading } = this.state;
    const props = {
      action: '/api/saas/file/upload',
      onRemove: file => {
        this.setState(({ fileList }) => {
          const index = fileList.indexOf(file);
          const newFileList = fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: file => {
        this.setState(({ fileList }) => ({
          fileList: [...fileList, file],
          initVisible: true,
        }));
        return false;
      },
      fileList: this.state.fileList,
    };

    return (
      <div style={{ display: 'inline-block' }}>
        <Button
          size="small"
          disabled={this.props.initRecord.state === '未初始化' ? false : true}
          onClick={this.showModal}
        >
          初始化
        </Button>

        <Modal
          title="初始化数据"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Upload {...props}>
            <Button loading={this.state.loading}>
              <Icon type="upload" /> Select File
            </Button>
          </Upload>
          <Popconfirm
            placement="bottom"
            title={text}
            visible={this.state.initVisible}
            onConfirm={this.handleUpload}
            okText="确定"
            cancelText="取消"
          />
        </Modal>
      </div>
    );
  }
}
