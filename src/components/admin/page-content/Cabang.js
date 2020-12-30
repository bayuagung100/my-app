import { DataGrid, Dialog, Form, FormField, GridColumn, Layout, LayoutPanel, LinkButton, Panel, TextBox } from 'rc-easyui';
import React, { Component } from 'react';
import { uAPIlocal } from '../../lib/config';
import axios from 'axios';
import parse from "html-react-parser";

class Cabang extends Component {
    constructor(props) {
        super(props);
        this.state = {
            detail_login: this.props.detail_login,
            cabang: {
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
                    kode_cabang: null,
                    nama_cabang: null,
                },
                rules: {
                    // kode_cabang: ["required", "exists"],
                    kode_cabang: {
                        "required": true,
                        "myrule": {
                            "validator": (value) => {
                                return new Promise((resolve) => {
                                    setTimeout(() => {
                                        const code = this.state.cabang.data.map(function (e) {
                                            return e.kode_branch;
                                        }).indexOf(value) < 0;
                                        resolve(code)
                                    }, 200)
                                })
                            },
                            "message": 'Kode Cabang Sudah Ada.'
                        }
                    },
                    nama_cabang: {
                        "required": true,
                        "myrule": {
                            "validator": (value) => {
                                return new Promise((resolve) => {
                                    setTimeout(() => {
                                        const cabang = this.state.cabang.data.map(function (e) {
                                            return e.branch_name;
                                        }).indexOf(value) < 0;
                                        resolve(cabang)
                                    }, 200)
                                })
                            },
                            "message": 'Nama Cabang Sudah Ada.'
                        }
                    },
                },

            },
            formEdit: {
                field: {
                    kode_cabang: null,
                    nama_cabang: null,
                },
                rules: {
                    kode_cabang: ["required"],
                    nama_cabang: ["required"],
                },

            }
        }
        this.errorDialog = React.createRef();
        this.tambahCabang = React.createRef();
        this.editCabang = React.createRef();
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
        await axios.get(uAPIlocal + '/api/v1/cabang')
            .then(function (response) {
                return response.data.results;
            })
            .then(response => {
                // console.log(response)
                this.setState({
                    cabang: {
                        ...this.state.cabang,
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
                cabang: {
                    ...this.state.cabang,
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
            cabang: {
                ...this.state.cabang,
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
        formData.append('kode_branch', this.state.formTambah.field.kode_cabang);
        formData.append('branch_name', this.state.formTambah.field.nama_cabang);
        formData.append('creator_id', this.state.detail_login.id_user);


        // for (var pair of formData.entries()) {
        //     console.log(pair[0] + ': ' + pair[1]);
        // }

        if (formData.get('kode_branch') !== "null" && formData.get('branch_name') !== "null") {
            await axios.post(uAPIlocal + '/api/v1/cabang', formData, config)
                .then(response => {
                    if (response.data.status === 406) {
                        this.setState({
                            errorMessage: response.data.message,
                        })
                        this.errorDialog.current.open();
                    } else {
                        this.getData();
                        this.tambahCabang.current.close();
                        this.setState({
                            formTambah: {
                                ...this.state.formTambah,
                                field: {
                                    kode_cabang: null,
                                    nama_cabang: null,
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
        if (this.state.cabang.selection) {
            await this.setState({
                formEdit: {
                    ...this.state.formEdit,
                    field: {
                        kode_cabang: this.state.cabang.selection.kode_branch,
                        nama_cabang: this.state.cabang.selection.branch_name,
                    },
                }
            })
            this.editCabang.current.open();
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
        formData.append('id_branch', this.state.cabang.selection.id_branch);
        formData.append('kode_branch', this.state.formEdit.field.kode_cabang);
        formData.append('branch_name', this.state.formEdit.field.nama_cabang);

        // for (var pair of formData.entries()) {
        //     console.log(pair[0] + ': ' + pair[1]);
        // }

        if (formData.get('kode_branch') !== "null" && formData.get('branch_name') !== "null") {
            await axios.put(uAPIlocal + '/api/v1/cabang', formData, config)
                .then(response => {
                    if (response.data.status === 406) {
                        this.setState({
                            errorMessage: response.data.message,
                        })
                        this.errorDialog.current.open();
                    } else {
                        this.setState({
                            cabang: {
                                ...this.state.cabang,
                                loading: true
                            }
                        })
                        this.getData();
                        this.editCabang.current.close();
                        this.setState({
                            formEdit: {
                                ...this.state.formEdit,
                                field: {
                                    kode_cabang: null,
                                    nama_cabang: null,
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
                    <LayoutPanel region="center" title="Data Cabang" style={{ height: '100%' }}>
                        <Panel bodyStyle={{ padding: '5px' }} style={{ height: 32 }}>
                            <LinkButton iconCls="icon-add" plain onClick={() => this.tambahCabang.current.open()} >Tambah</LinkButton>
                            <LinkButton iconCls="icon-edit" plain onClick={this.handleEditClick} >Edit & Lihat</LinkButton>
                            {/* <LinkButton iconCls="icon-print" plain>Print / Download</LinkButton>
                            <LinkButton iconCls="icon-save" plain>Kirim Email</LinkButton> */}

                            <Dialog
                                title="Alert"
                                style={{ width: '300px', height: '84px' }}
                                modal
                                closed={true}
                                ref={this.errorDialog}
                            >
                                <p style={{ textAlign: 'center', margin: '10px', fontSize: '16px' }}>{this.state.errorMessage}</p>
                            </Dialog>
                            <Dialog title="Tambah Cabang"
                                style={{ width: '500px', height: '300px' }}
                                modal
                                closed={true}
                                ref={this.tambahCabang}
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
                                        <FormField name="kode_cabang" label="Kode Cabang:">
                                            <TextBox value={this.state.formTambah.field.kode_cabang} ></TextBox>
                                        </FormField>
                                        <FormField name="nama_cabang" label="Nama Cabang:">
                                            <TextBox value={this.state.formTambah.field.nama_cabang} ></TextBox>
                                        </FormField>
                                        <FormField >
                                            <LinkButton onClick={this.handleSubmitFormTambah} >Submit</LinkButton>
                                        </FormField>
                                    </Form>
                                </div>
                            </Dialog>
                            <Dialog title="Edit Cabang"
                                style={{ width: '500px', height: '300px' }}
                                modal
                                closed={true}
                                ref={this.editCabang}
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
                                        <FormField name="kode_cabang" label="Kode Cabang:">
                                            <TextBox value={this.state.formEdit.field.kode_cabang}></TextBox>
                                        </FormField>
                                        <FormField name="nama_cabang" label="Nama Cabang:">
                                            <TextBox value={this.state.formEdit.field.nama_cabang}></TextBox>
                                        </FormField>
                                        <FormField >
                                            <LinkButton onClick={this.handleSubmitFormEdit}>Submit</LinkButton>
                                        </FormField>
                                    </Form>
                                </div>
                            </Dialog>
                        </Panel>


                        <DataGrid filterable filterRules={[]} pagination {...this.state.cabang} style={{ height: 'calc(100% - 32px)', }} selectionMode='single' selection={this.state.cabang.selection} onSelectionChange={this.selectionChange} onPageChange={this.pageChange} >
                            <GridColumn field="rn" align="center" width='30px'
                                cellCss="datagrid-td-rownumber" filterable={false}
                                render={({ rowIndex }) => (
                                    <span>{rowIndex + 1}</span>
                                )}
                            />
                            <GridColumn field="branch_name" title="Cabang" align="center" ></GridColumn>
                            <GridColumn field="kode_branch" title="Kode Cabang" align="center" ></GridColumn>
                        </DataGrid>
                        {/* </Panel> */}

                    </LayoutPanel>
                </Layout>
            </div>

        )
    }
}
export default Cabang;