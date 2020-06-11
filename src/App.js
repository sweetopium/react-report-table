import React from 'react';
import './App.css';
import TableData from './data'
import * as R from 'ramda'
import FilterForm from './components/FilterForm'
import ResultsTable from './components/ResultsTable'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.submitForm = this.submitForm.bind(this);
        this.sortTable = this.sortTable.bind(this);
        this.state = {
            sortParam: undefined,
            sortOrder: false,
            tableData: TableData,
            isLoading: false,
            filtrationParams: ['date', 'city', 'installs', 'trials']
        }
    }

    submitForm(formData){
        let params = {};
        formData.forEach(p => {
            console.log(p)
            params[p.filtrationParam] = parseInt(p.filtrationValue)
        });
        console.log(params)
        this.filterData(params)
    }

    createFilterFn (params) {
        const {filter, where, equals, gte, lt} = R;
        let city = typeof params.city !== "undefined" ? {city: equals(params.city)} : null;
        let date = typeof params.date !== "undefined" ? {date: gte(params.date)} : null;
        let installs = typeof params.installs !== "undefined" ? {installs: equals(params.installs)} : null;
        let trials = typeof params.trials !== "undefined" ? {trials: equals(params.trials)} : null;
        let conditions = {};
        if (date !== null) {
            conditions['date'] = date['date']
        }
        if (city !== null) {
            conditions['city'] = city['city']
        }
        if (installs !== null) {
            conditions['installs'] = installs['installs']
        }
        if (trials !== null) {
            conditions['trials'] = trials['trials']
        }
        console.log(conditions)
        return filter(where(conditions))
    }

    filterData (params) {
        this.setState({isLoading: true}, () => {
            let fn = this.createFilterFn(params);
            let data = TableData;

            console.log(fn(data))
            this.setState({tableData: fn(data)}, () => {
                this.setState({isLoading: false})
            });
        })
    }

    sortTable (param) {
        const data = this.state.tableData;
        let order = this.state.sortOrder;
        if (param === this.state.sortParam) {
            order = !order
        }
        if (order) {
            data.sort((a, b) => {
              if (a[param] < b[param]) {
                return -1;
              }
              if (a[param] > b[param]) {
                return 1;
              }
              return 0;
            });
        } else {
            data.sort((a, b) => {
              if (a[param] < b[param]) {
                return 1;
              }
              if (a[param] > b[param]) {
                return -1;
              }
              return 0;
            });
        }
        this.setState({tableData: data, sortParam: param, sortOrder: order})
    }
    render() {
        const {tableData, isLoading, filtrationParams} = this.state;
        return (
            <div className="container-fluid mt-4">
                <h3>Статистика по установкам приложения</h3>
                <FilterForm onSubmitForm={this.submitForm} filtrationParams={filtrationParams}/>
                <div className="row mt-3">
                    {!isLoading ?
                        <div className="col">
                            <ResultsTable sortTable={this.sortTable} tableData={tableData}/>
                        </div>
                        :
                        <div className="col text-center">
                            <p>Загрузка... </p>
                        </div>
                    }
                </div>
            </div>
        );
    }
}

export default App;
