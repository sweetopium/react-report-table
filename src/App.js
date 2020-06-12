import React from 'react';
import './App.css';
import TableData from './data'
import * as R from 'ramda'
import FilterForm from './components/FilterForm'
import ResultsTable from './components/ResultsTable'
import LineChart from './components/LineChart'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'


class App extends React.Component {
    constructor(props) {
        super(props);
        this.submitForm = this.submitForm.bind(this);
        this.sortTable = this.sortTable.bind(this);
        this.state = {
            sortParam: undefined,
            sortOrder: false,
            tableData: TableData,
            chartData: null,
            isLoading: false,
            filtrationParams: ['state', 'date', 'city', 'installs', 'trials'],
            options: {
                title: {
                    text: 'Установки / триалы'
                },
                chart: {type: 'line'},
                xAxis: {
                    categories: [],
                    type: 'datetime',
                    labels: {
                        formatter: function () {
                            return Highcharts.dateFormat('%a %d %b', this.value);
                        }
                    },
                },
                series: [
                    {data: null, name: 'Installs', color: '#28a745'},
                    {data: null, name: 'Trials', color: '#007bff'},
                ]
            }
        }
    }

    handleChartData(data) {
        let chartData = [];
        let installsList = [];
        let trialsList = [];
        let chartCategories = [];
        let f = R.groupBy(R.prop('date'), data);
        console.log(f)
        Object.keys(f).forEach(item => {
            let localInstalls = 0;
            let localTrials = 0;
            f[item].forEach(e => {
                localInstalls = localInstalls + e.installs;
                localTrials = localTrials + e.trials;
            });
            chartCategories.push(new Date(item));
            installsList.push(localInstalls);
            trialsList.push(localTrials)
        });
        let chartOptions = this.state.options;
        chartOptions.xAxis.categories = chartCategories;
        chartOptions.series[0].data = [];
        chartOptions.series[0].data = installsList;
        chartOptions.series[1].data = [];
        chartOptions.series[1].data = trialsList;
        this.setState({chartData: chartData, options: chartOptions})
    }

    async componentDidMount() {
        this.handleChartData(this.state.tableData);

    }

    submitForm(formData) {
        let params = {};
        formData.forEach(p => {
            isNaN(parseInt(p.filtrationValue))
                ? params[p.filtrationParam] = p.filtrationValue
                : params[p.filtrationParam] = parseInt(p.filtrationValue)
        });
        console.log(params)
        this.filterData(params)
    }

    createFilterFn(params) {
        const {filter, where, equals, gte, lt} = R;
        let state = typeof params.state !== "undefined" ? {state: equals(params.state)} : null;
        let city = typeof params.city !== "undefined" ? {city: equals(params.city)} : null;
        let date = typeof params.date !== "undefined" ? {date: gte(params.date)} : null;
        let installs = typeof params.installs !== "undefined" ? {installs: equals(params.installs)} : null;
        let trials = typeof params.trials !== "undefined" ? {trials: equals(params.trials)} : null;
        let conditions = {};
        if (state !== null) {
            conditions['state'] = state['state']
        }
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

    filterData(params) {
        this.setState({isLoading: true}, () => {
            let fn = this.createFilterFn(params);
            let data = TableData;
            this.setState({tableData: fn(data)}, () => {
                this.handleChartData(fn(data));
                this.setState({isLoading: false})
            });
        })
    }

    sortTable(param) {
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
        const {tableData, isLoading, filtrationParams, chartData, options} = this.state;
        return (
            <div className="container-fluid mt-4">
                <h3>Статистика установки приложения</h3>

                {chartData ?
                    <LineChart options={options}/>
                    : null
                }


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
