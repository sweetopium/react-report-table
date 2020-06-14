import React from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

const LineChart = (props) => {
    return (
        <div className="row">
            <div className="col chart-wrapper">
                <HighchartsReact
                    updateArgs={[true]}
                    highcharts={Highcharts}
                    options={props.options}
                />
            </div>
        </div>
    )
};

export default LineChart;
