import { ComboBox, DataGrid, DateTimeSpinner, Dialog, Form, FormField, GridColumn, Layout, LayoutPanel, LinkButton, NumberBox, Panel } from 'rc-easyui';
import React, { Component } from 'react';
import { uAPIlocal } from '../../lib/config';
import axios from 'axios';
import parse from "html-react-parser";

class Slot extends Component {
    constructor(props) {
        super(props);
        this.state = {
            detail_login: this.props.detail_login,
            master_slot: {
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
            cabang: [],
            formTambah: {
                field: {
                    start: '00:00:00',
                    end: '00:00:00',
                    slot: 0,
                    cabang: null
                },
                rules: {
                    start: {
                        "required": true,
                        "myrule": {
                            "validator": (value) => {
                                var date = new Date();
                                date.setHours(date.getHours() + 2);
                                date.setMinutes(0, 0);
                                date = ('00' + date.getHours()).slice(-2) + ':' +
                                    ('00' + date.getMinutes()).slice(-2) + ':' +
                                    ('00' + date.getSeconds()).slice(-2);
                                // console.log(date)
                                return new Promise((resolve) => {
                                    setTimeout(() => {
                                        const start = this.state.master_slot.data.map(function (e) {
                                            return e.start;
                                        }).indexOf(value) < 0;
                                        resolve(start)
                                    }, 200)
                                })
                            },
                            "message": 'Jam Mulai Sudah Ada.'
                        },
                    },
                    end: ["required"],
                    slot: {
                        "required": true,
                        "myrule": {
                            "validator": (value) => {
                                if (value > 0) {
                                    return true;
                                } else {
                                    return new Promise(resolve => {
                                        resolve(false);
                                    });
                                }
                            },
                            "message": "Slot minimal 1."
                        }
                    },
                    cabang: ["required"],

                },
            },
            formEdit: {
                field: {
                    start: null,
                    end: null,
                    slot: null,
                    cabang: null
                },
                rules: {
                    start: ["required"],
                    end: ["required"],
                    slot: {
                        "required": true,
                        "myrule": {
                            "validator": (value) => {
                                if (value > 0) {
                                    return true;
                                } else {
                                    return new Promise(resolve => {
                                        resolve(false);
                                    });
                                }
                            },
                            "message": "Slot minimal 1."
                        }
                    },
                    cabang: ["required"],
                },
            }
        }
        this.errorDialog = React.createRef();
        this.tambahJamSlot = React.createRef();
        this.editJamSlot = React.createRef();
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
    async getCabang() {
        await axios.get(uAPIlocal + '/api/v1/cabang')
            // .then(function (response) {
            //     return response.data.results;
            // })
            .then(response =>
                response.data.results.map(branch => ({
                    value: `${branch.id_branch}`,
                    text: `${branch.branch_name}`,
                }))
            )
            .then(branch => {
                this.setState({
                    cabang: branch,
                })
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    async getData() {
        // const data = [
        //     { start: "07:00:00", end: "08:00:00", slot: 1, cabang: "GRANDIA" },
        //     { start: "08:00:00", end: "09:00:00", slot: 2, cabang: "GRANDIA" },
        //     { start: "09:00:00", end: "10:00:00", slot: 3, cabang: "GRANDIA" },
        //     { start: "07:00:00", end: "08:00:00", slot: 1, cabang: "KEDOYA" },
        //     { start: "08:00:00", end: "09:00:00", slot: 2, cabang: "KEDOYA" },
        //     { start: "09:00:00", end: "10:00:00", slot: 3, cabang: "KEDOYA" },
        // ]
        // await this.setState({
        //     master_slot: {
        //         ...this.state.master_slot,
        //         data: data,
        //         loading: false
        //     }
        // })
        await axios.get(uAPIlocal + '/api/v1/slot')
            .then(function (response) {
                return response.data.results;
            })
            .then(response => {
                // console.log(response)
                this.setState({
                    master_slot: {
                        ...this.state.master_slot,
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
                master_slot: {
                    ...this.state.master_slot,
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
            master_slot: {
                ...this.state.master_slot,
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
        formData.append('id_branch', this.state.formTambah.field.cabang);
        formData.append('start_time', this.state.formTambah.field.start);
        formData.append('end_time', this.state.formTambah.field.end);
        formData.append('slot', this.state.formTambah.field.slot);
        formData.append('creator_id', this.state.detail_login.id_user);

        for (var pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }

        if (formData.get('id_branch') !== "null" && formData.get('start_time') !== "null" && formData.get('end_time') !== "null" && formData.get('slot') !== "null" && formData.get('creator_id') !== "null") {
            await axios.post(uAPIlocal + '/api/v1/slot', formData, config)
                .then(response => {
                    console.log(response)
                    if (response.data.status === 406) {
                        this.setState({
                            errorMessage: response.data.message,
                        })
                        this.errorDialog.current.open();
                    } else {
                        this.getData();
                        this.tambahJamSlot.current.close();
                        this.setState({
                            formTambah: {
                                ...this.state.formTambah,
                                field: {
                                    start: '00:00:00',
                                    end: '00:00:00',
                                    slot: 0,
                                    cabang: null
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
        if (this.state.master_slot.selection) {
            await this.setState({
                formEdit: {
                    ...this.state.formEdit,
                    field: {
                        start: this.state.master_slot.selection.start_time,
                        end: this.state.master_slot.selection.end_time,
                        slot: this.state.master_slot.selection.slot,
                        cabang: {
                            value: `${this.state.master_slot.selection.id_branch}`,
                            text: `${this.state.master_slot.selection.branch_name}`,
                        }
                    },
                }
            })
            this.editJamSlot.current.open();
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
        formData.append('id_slot', this.state.master_slot.selection.id_slot);
        formData.append('id_branch', this.state.formEdit.field.cabang);
        formData.append('start_time', this.state.formEdit.field.start);
        formData.append('end_time', this.state.formEdit.field.end);
        formData.append('slot', this.state.formEdit.field.slot);

        // for (var pair of formData.entries()) {
        //     console.log(pair[0] + ': ' + pair[1]);
        // }

        if (formData.get('id_branch') !== "null" && formData.get('start_time') !== "null" && formData.get('end_time') !== "null" && formData.get('slot') !== "null") {
            await axios.put(uAPIlocal + '/api/v1/slot', formData, config)
                .then(response => {
                    if (response.data.status === 406) {
                        this.setState({
                            errorMessage: response.data.message,
                        })
                        this.errorDialog.current.open();
                    } else {
                        this.setState({
                            master_slot: {
                                ...this.state.master_slot,
                                loading: true
                            }
                        })
                        this.getData();
                        this.editJamSlot.current.close();
                        this.setState({
                            formEdit: {
                                ...this.state.formEdit,
                                field: {
                                    start: null,
                                    end: null,
                                    slot: null,
                                    cabang: null
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
        this.getCabang();
    }
    render() {
        return (
            <div className='pd-20'>
                <Layout style={{ width: '100%', height: 500 }}>
                    <LayoutPanel region="center" title="Data Slot" style={{ height: '100%' }}>
                        <Panel bodyStyle={{ padding: '5px' }} style={{ height: 32 }}>
                            <LinkButton iconCls="icon-add" plain onClick={() => this.tambahJamSlot.current.open()} >Tambah</LinkButton>
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
                            <Dialog title="Tambah Slot"
                                style={{ width: '500px', height: '350px' }}
                                modal
                                closed={true}
                                ref={this.tambahJamSlot}
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
                                        onChange={this.handleChangeFormTambah}
                                    >
                                        <FormField name="start" label="Jam Mulai:">
                                            <DateTimeSpinner format="HH:mm:ss" value={this.state.formTambah.field.start}></DateTimeSpinner>
                                        </FormField>
                                        <FormField name="end" label="Jam Selesai:">
                                            <DateTimeSpinner format="HH:mm:ss" value={this.state.formTambah.field.end}></DateTimeSpinner>
                                        </FormField>
                                        <FormField name="slot" label="Slot:">
                                            <NumberBox value={this.state.formTambah.field.slot}></NumberBox>
                                        </FormField>
                                        <FormField name="cabang" label="Pilih Cabang:">
                                            <ComboBox data={this.state.cabang} value={this.state.formTambah.field.cabang} ></ComboBox>
                                        </FormField>
                                        <FormField >
                                            <LinkButton onClick={this.handleSubmitFormTambah}>Submit</LinkButton>
                                        </FormField>
                                    </Form>
                                </div>
                            </Dialog>
                            <Dialog title="Edit Slot"
                                style={{ width: '500px', height: '350px' }}
                                modal
                                closed={true}
                                ref={this.editJamSlot}
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
                                        <FormField name="start" label="Start:">
                                            <DateTimeSpinner format="HH:mm:ss" value={this.state.formEdit.field.start}></DateTimeSpinner>
                                        </FormField>
                                        <FormField name="end" label="Nama Cabang:">
                                            <DateTimeSpinner format="HH:mm:ss" value={this.state.formEdit.field.end}></DateTimeSpinner>
                                        </FormField>
                                        <FormField name="slot" label="Slot:">
                                            <NumberBox value={this.state.formEdit.field.slot}></NumberBox>
                                        </FormField>
                                        <FormField name="cabang" label="Pilih Cabang:">
                                            <ComboBox data={this.state.cabang} value={this.state.formEdit.field.cabang} ></ComboBox>
                                        </FormField>
                                        <FormField >
                                            <LinkButton onClick={this.handleSubmitFormEdit}>Submit</LinkButton>
                                        </FormField>
                                    </Form>
                                </div>
                            </Dialog>
                        </Panel>
                        <DataGrid filterable filterRules={[]} pagination {...this.state.master_slot} style={{ height: 'calc(100% - 32px)', }} selectionMode='single' selection={this.state.master_slot.selection} onSelectionChange={this.selectionChange} onPageChange={this.pageChange} >
                            <GridColumn field="rn" align="center" width='30px'
                                cellCss="datagrid-td-rownumber" filterable={false}
                                render={({ rowIndex }) => (
                                    <span>{rowIndex + 1}</span>
                                )}
                            />
                            <GridColumn field="start_time" title="Jam Mulai" align="center" ></GridColumn>
                            <GridColumn field="end_time" title="Jam Selesai" align="center" ></GridColumn>
                            <GridColumn field="slot" title="Slot" align="center" ></GridColumn>
                            <GridColumn field="branch_name" title="Cabang" align="center" ></GridColumn>
                        </DataGrid>
                    </LayoutPanel>
                </Layout>
            </div>
        )
    }
}
export default Slot;