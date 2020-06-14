import React from 'react';

const ResultsTable = (props) => {
    return(
        <table className="table table-bordered">
            <thead className="thead-dark">
            <tr>
                {props.tableColumns.map(column => {return (
                    <td key={column} onClick={() => props.sortTable(column)}>{column}</td>
                )})}
            </tr>
            </thead>
            <tbody>
            {props.tableData.map((item, index) => {
                return (
                    <tr key={index}>
                        {props.tableColumns.map(column => {
                            if(column === 'conversions') {
                                return (<td key={column}
                                >{((item.trials / item.installs) * 100).toFixed(1)}%</td>)
                            } else {
                                return (<td  key={column}>{item[column]}</td>)
                            }
                        })}
                    </tr>
                )
            })}
            </tbody>
        </table>
    )
};

export default ResultsTable;
