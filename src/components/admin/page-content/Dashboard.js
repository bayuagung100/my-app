import { DataGrid, GridColumn, Layout, LayoutPanel } from 'rc-easyui';
import React, { Component } from 'react';
import { uAPIlocal } from '../../lib/config';
import axios from 'axios';
import parse from "html-react-parser";

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pasien: {
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
        }
    }
    async getData() {
        await axios.get(uAPIlocal + '/api/v1/dashboard')
            .then(function (response) {
                return response.data.results;
            })
            .then(response => {
                // console.log(response)
                this.setState({
                    pasien: {
                        ...this.state.pasien,
                        data: response,
                        loading: false
                    }
                })
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    componentDidMount() {
        this.getData();
    }
    render() {
        return (
            <div className='pd-20'>
                <Layout style={{ width: '100%', height: 500 }}>
                    <LayoutPanel region="center" title="Data Pasien" style={{ height: '100%' }}>
                        <DataGrid filterable filterRules={[]} pagination {...this.state.pasien} style={{ height: '100%', }} selectionMode='single' selection={this.state.pasien.selection} onSelectionChange={this.selectionChange} onPageChange={this.pageChange} >
                            <GridColumn field="rn" align="center" width='30px'
                                cellCss="datagrid-td-rownumber" filterable={false}
                                render={({ rowIndex }) => (
                                    <span>{rowIndex + 1}</span>
                                )}
                            />
                            <GridColumn field="firstname" title="Nama Pasien" align="center" ></GridColumn>
                            <GridColumn field="hp" title="No Hp / Telepon" align="center" ></GridColumn>
                            <GridColumn field="email" title="Email" align="center" ></GridColumn>
                            <GridColumn field="birth_date" title="Tanggal Lahir" align="center" ></GridColumn>
                            <GridColumn field="address" title="Alamat" align="center" ></GridColumn>
                            <GridColumn field="gender" title="Jenis Kelamin" align="center" ></GridColumn>
                            <GridColumn field="branch_name" title="Cabang" align="center" ></GridColumn>
                            <GridColumn field="check_date" title="Tanggal" align="center" ></GridColumn>
                            <GridColumn field="jam" title="Jam" align="center" ></GridColumn>
                            <GridColumn field="slot" title="Slot" align="center" ></GridColumn>
                            <GridColumn field="status" title="Status" align="center" ></GridColumn>

                        </DataGrid>
                    </LayoutPanel>
                </Layout>
            </div>
        )
    }
}
export default Dashboard;