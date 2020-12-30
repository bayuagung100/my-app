import React, { Component } from 'react';
import { uAPIlocal } from '../../lib/config';
import axios from 'axios';
import parse from "html-react-parser";
import { DataGrid, Dialog, Form, FormField, GridColumn, Layout, LayoutPanel, LinkButton, Panel, TextBox } from 'rc-easyui';

class TestName extends Component {
    constructor(props) {
        super(props);
        this.state = {
            detail_login: this.props.detail_login,
            test_name: {
                total: 0,
                pageSize: 20,
                data: [],
                pagePosition: "bottom",
                pageOptions: {
                    layout: ['list', 'sep', 'first', 'prev', 'next', 'last', 'sep', 'refresh', 'sep', 'manual', 'info']
                },
                selection: null,
                loading: true,
            },
            formTambah: {
                field: {
                    test_name: null,
                    price: null,
                },
                rules: {
                    test_name: ["required"],
                    price: ["required"],
                },
            },
            formEdit: {
                field: {
                    test_name: null,
                    price: null,
                },
                rules: {
                    test_name: ["required"],
                    price: ["required"],
                },

            }
        }
        this.errorDialog = React.createRef();
        this.tambahTest = React.createRef();
        this.editTest = React.createRef();
        this.pageChange = this.pageChange.bind(this);
        this.selectionChange = this.selectionChange.bind(this);

        this.formTambah = React.createRef();
        this.handleChangeFormTambah = this.handleChangeFormTambah.bind(this);
        this.handleSubmitFormTambah = this.handleSubmitFormTambah.bind(this);
        this.formEdit = React.createRef();
        this.handleEditClick = this.handleEditClick.bind(this)
        this.handleChangeFormEdit = this.handleChangeFormEdit.bind(this);
        this.handleSubmitFormEdit = this.handleSubmitFormEdit.bind(this);
    }
    async getData() {
        await axios.get(uAPIlocal + '/api/v1/test-name')
            .then(function (response) {
                return response.data.results;
            })
            .then(response => {
                // console.log(response)
                this.setState({
                    test_name: {
                        ...this.state.test_name,
                        data: response,
                        loading: false
                    }
                })
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    pageChange(event) {
        console.log(event)
        if (event.refresh) {
            // console.log(event)
            this.setState({
                test_name: {
                    ...this.state.test_name,
                    loading: true,
                    selection: null
                },
            })
            this.getData();
        }

    }
    async selectionChange(event) {
        // console.log(event)
        await this.setState({
            test_name: {
                ...this.state.test_name,
                selection: event
            },
        })
    }

    async handleChangeFormTambah(name, value) {
        let field = Object.assign({}, this.state.formTambah.field);
        field[name] = value;
        await this.setState({
            formTambah: {
                ...this.state.formTambah,
                field: field
            }
        })
    }
    async handleSubmitFormTambah() {
        const formData = new FormData();
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };
        formData.append('test_name', this.state.formTambah.field.test_name);
        formData.append('price', this.state.formTambah.field.price);


        // for (var pair of formData.entries()) {
        //     console.log(pair[0] + ': ' + pair[1]);
        // }

        if (formData.get('test_name') !== "null" && formData.get('price') !== "null") {
            await axios.post(uAPIlocal + '/api/v1/test-name', formData, config)
                .then(response => {
                    if (response.data.status === 406) {
                        this.setState({
                            errorMessage: response.data.message,
                        })
                        this.errorDialog.current.open();
                    } else {
                        this.getData();
                        this.tambahTest.current.close();
                        this.setState({
                            formTambah: {
                                ...this.state.formTambah,
                                field: {
                                    test_name: null,
                                    price: null,
                                },
                            }
                        })
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }

    }
    async handleEditClick() {
        if (this.state.test_name.selection) {
            await this.setState({
                formEdit: {
                    ...this.state.formEdit,
                    field: {
                        test_name: this.state.test_name.selection.test_name,
                        price: this.state.test_name.selection.price,
                    },
                }
            })
            this.editTest.current.open();
        } else {
            // console.log('tidak ada yang di select');
            this.setState({
                errorMessage: "Tidak Ada Data yang Dipilih",
            })
            this.errorDialog.current.open();
        }
    }
    async handleChangeFormEdit(name, value) {
        let field = Object.assign({}, this.state.formEdit.field);
        field[name] = value;
        await this.setState({
            formEdit: {
                ...this.state.formEdit,
                field: field
            }
        })
    }
    async handleSubmitFormEdit() {
        const formData = new FormData();
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };
        formData.append('id_test', this.state.test_name.selection.id_test);
        formData.append('test_name', this.state.formEdit.field.test_name);
        formData.append('price', this.state.formEdit.field.price);

        // for (var pair of formData.entries()) {
        //     console.log(pair[0] + ': ' + pair[1]);
        // }

        if (formData.get('test_name') !== "null" && formData.get('price') !== "null") {
            await axios.put(uAPIlocal + '/api/v1/test-name', formData, config)
                .then(response => {
                    if (response.data.status === 406) {
                        this.setState({
                            errorMessage: response.data.message,
                        })
                        this.errorDialog.current.open();
                    } else {
                        this.setState({
                            test_name: {
                                ...this.state.test_name,
                                loading: true
                            }
                        })
                        this.getData();
                        this.editTest.current.close();
                        this.setState({
                            formEdit: {
                                ...this.state.formEdit,
                                field: {
                                    test_name: null,
                                    price: null,
                                },
                            }
                        })
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }
    componentDidMount() {
        this.getData();
    }
    render() {
        return (
            <div className='pd-20'>
                <Layout style={{ width: '100%', height: 500 }}>
                    <LayoutPanel region="center" title="Data Test" style={{ height: '100%' }}>
                        <Panel bodyStyle={{ padding: '5px' }} style={{ height: 32 }}>
                            <LinkButton iconCls="icon-add" plain onClick={() => this.tambahTest.current.open()} >Tambah</LinkButton>
                            <LinkButton iconCls="icon-edit" plain onClick={this.handleEditClick} >Edit & Lihat</LinkButton>

                            <Dialog
                                title="Alert"
                                style={{ width: '300px', height: '84px' }}
                                modal
                                closed={true}
                                ref={this.errorDialog}
                            >
                                <p style={{ textAlign: 'center', margin: '10px', fontSize: '16px' }}>{this.state.errorMessage}</p>
                            </Dialog>
                            <Dialog title="Tambah Test"
                                style={{ width: '500px', height: '300px' }}
                                modal
                                closed={true}
                                ref={this.tambahTest}
                            >
                                <div className='pd-20'>
                                    <Form
                                        ref={this.formTambah}
                                        style={{ maxWidth: 500 }}
                                        model={this.state.formTambah.field}
                                        rules={this.state.formTambah.rules}
                                        labelWidth={120}
                                        // labelAlign="right"
                                        labelPosition="top"
                                        floatingLabel
                                        // validateRules={this.getCustomRules}
                                        onChange={this.handleChangeFormTambah}
                                    >
                                        <FormField name="test_name" label="Nama Test:">
                                            <TextBox value={this.state.formTambah.field.test_name} ></TextBox>
                                        </FormField>
                                        <FormField name="price" label="Harga:">
                                            <TextBox value={this.state.formTambah.field.price} ></TextBox>
                                        </FormField>
                                        <FormField >
                                            <LinkButton onClick={this.handleSubmitFormTambah} >Submit</LinkButton>
                                        </FormField>
                                    </Form>
                                </div>
                            </Dialog>
                            <Dialog title="Edit Test"
                                style={{ width: '500px', height: '300px' }}
                                modal
                                closed={true}
                                ref={this.editTest}
                            >
                                <div className='pd-20'>
                                    <Form
                                        ref={this.formEdit}
                                        style={{ maxWidth: 500 }}
                                        model={this.state.formEdit.field}
                                        rules={this.state.formEdit.rules}
                                        labelWidth={120}
                                        // labelAlign="right"
                                        labelPosition="top"
                                        floatingLabel
                                        onChange={this.handleChangeFormEdit}
                                    >
                                        <FormField name="test_name" label="Nama Test:">
                                            <TextBox value={this.state.formEdit.field.test_name}></TextBox>
                                        </FormField>
                                        <FormField name="price" label="Harga:">
                                            <TextBox value={this.state.formEdit.field.price}></TextBox>
                                        </FormField>
                                        <FormField >
                                            <LinkButton onClick={this.handleSubmitFormEdit}>Submit</LinkButton>
                                        </FormField>
                                    </Form>
                                </div>
                            </Dialog>
                        </Panel>


                        <DataGrid filterable filterRules={[]} pagination {...this.state.test_name} style={{ height: 'calc(100% - 32px)', }} selectionMode='single' selection={this.state.test_name.selection} onSelectionChange={this.selectionChange} onPageChange={this.pageChange} >
                            <GridColumn field="rn" align="center" width='30px'
                                cellCss="datagrid-td-rownumber" filterable={false}
                                render={({ rowIndex }) => (
                                    <span>{rowIndex + 1}</span>
                                )}
                            />
                            <GridColumn field="test_name" title="Nama Test" align="center" ></GridColumn>
                            <GridColumn field="price" title="Harga" align="center" ></GridColumn>
                        </DataGrid>
                    </LayoutPanel>
                </Layout>
            </div>
        )
    }
}
export default TestName;