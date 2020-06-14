import React from 'react';
import './App.css';
import TableData from './data'
import * as R from 'ramda'
import FilterForm from './components/FilterForm'
import ResultsTable from './components/ResultsTable'
import LineChart from './components/LineChart'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Highcharts from 'highcharts'



class App extends React.Component {
    constructor(props) {
        super(props);
        this.submitForm = this.submitForm.bind(this);
        this.sortTable = this.sortTable.bind(this);
        this.handleGroup = this.handleGroup.bind(this);
        this.state = {
            sortParam: undefined,
            sortOrder: false,
            tableData: TableData,
            chartData: null,
            isLoading: false,
            filtrationParams: ['state', 'date', 'city', 'installs', 'trials'],
            isFiltered: false,
            isGrouped: false,
            options: {
                title: {
                    text: 'Установки / триалы'
                },
                chart: {type: 'line'},
                yAxis: [
                    {
                        min: 0
                    },
                    {
                        min: 0,
                        opposite: true,
                        zIndex: 10,
                    }
                ],
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
                    {data: null, yAxis: 0, name: 'Installs', color: '#28a745'},
                    {data: null,yAxis: 1, name: 'Trials', color: '#007bff'},
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
            if (p.filtrationParam === 'installs' || p.filtrationParam === 'trials') {
                params[p.filtrationParam] = parseInt(p.filtrationValue)
            } else {
                params[p.filtrationParam] = p.filtrationValue
            }
        });
        this.filterData(params)
    }

    createFilterFn(params) {
        const {filter, where, equals, gte, gt, lte, and} = R;
        let state = typeof params.state !== "undefined" ? {state: equals(params.state)} : null;
        let city = typeof params.city !== "undefined" ? {city: equals(params.city)} : null;
        let date = typeof params.date !== "undefined" ? {date: and(gt(params.date[0]), gte(params.date[1]))} : null;
        let installs = typeof params.installs !== "undefined" ? {installs: lte(params.installs)} : null;
        let trials = typeof params.trials !== "undefined" ? {trials: lte(params.trials)} : null;
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
        console.log(conditions);
        return filter(where(conditions))
    }

    groupData(data){
        let reducedData = [];
        let grouped = R.groupBy(R.prop('city'), data);
        Object.keys(grouped).forEach(item => {
            let localInstalls = 0;
            let localTrials = 0;
            grouped[item].forEach(e => {
                localInstalls = localInstalls + e.installs;
                localTrials = localTrials + e.trials;
            });
            let localConversions = (localTrials / localInstalls) * 100;
            reducedData.push({
                city: item,
                installs: localInstalls,
                trials: localTrials,
                conversions: Number(localConversions.toFixed(1))
            })
        });
        return reducedData;
    }

    handleGroup(){
        this.setState({isLoading: true}, () => {
            const data = this.state.tableData;
            this.setState({tableData: this.groupData(data)}, () => {
                setTimeout(() => {
                this.setState({isLoading: false})
            }, 1000)
            })
        });
    }

    filterData(params) {
        this.setState({isLoading: true}, () => {
            let fn = this.createFilterFn(params);
            let data = TableData;
            this.setState({tableData: fn(data)}, () => {
                this.handleChartData(fn(data));
                this.setState({isLoading: false, isFiltered: true})
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
        const {tableData, isLoading, filtrationParams, chartData, options, isFiltered} = this.state;
        return (
            <div className="container-fluid mt-4">
                <h3>Статистика установки приложения</h3>

                {chartData ?
                    <LineChart options={options}/>
                    : null
                }

                <FilterForm onSubmitForm={this.submitForm} onGroupClick={this.handleGroup}
                            filtrParams={filtrationParams} isFiltered={isFiltered}/>
                <div className="row mt-3">
                    {!isLoading
                        ?
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
