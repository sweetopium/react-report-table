import React from 'react';

const ResultsTable = (props) => {
    return(
        <table className="table table-bordered">
            <thead className="thead-dark">
            <tr>
                <td onClick={() => props.sortTable('state')}>State</td>
                <td onClick={() => props.sortTable('city')}>City</td>
                <td onClick={() => props.sortTable('date')}>Date</td>
                <td onClick={() => props.sortTable('installs')}>Installs</td>
                <td onClick={() => props.sortTable('trials')}>Trials</td>
                <td onClick={() => props.sortTable('date')}>Conversions</td>
            </tr>
            </thead>
            <tbody>
            {props.tableData.map((item, index) => {
                return (
                    <tr key={index}>
                        <td>{item.state}</td>
                        <td>{item.city}</td>
                        <td>{item.date}</td>
                        <td>{item.installs}</td>
                        <td>{item.trials}</td>
                        <td>{((item.trials / item.installs) * 100).toFixed(1)}%</td>
                    </tr>
                )
            })}
            </tbody>
        </table>
    )
};

export default ResultsTable;
