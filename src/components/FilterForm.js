import React, {useState} from 'react';
import DateRangePicker from '@wojtekmaj/react-daterange-picker'
import moment from 'moment'

const FilterForm = (props) => {
    let initialFormData = {filtrationParam: 'state', filtrationValue: null};
    const [value, onChange] = useState([new Date(), new Date()]);
    const [formData, addCondition] = useState([]);
    const addFilterCondition = () => {
        addCondition(formData => [...formData, initialFormData]);
    };
    const handleChange = (e, index, inputType) => {
        const arr = [...formData];
        arr[index][inputType] = e.target.value;
        addCondition(arr)
    };
    const handleDateChange = (value, index) => {
        let dateFrom = moment(value[0]).format('YYYY-MM-DD');
        let dateTo = moment(value[1]).format('YYYY-MM-DD');
        const arr = [...formData];
        arr[index].filtrationValue = [dateFrom, dateTo];
        addCondition(arr);
        onChange(value);
    };
    return (
        <>
            <div className="row mb-2 mt-3">
                <div className="col text-right">
                    <a className="btn btn-primary text-white" onClick={addFilterCondition}>добавить фильтр</a>
                </div>
            </div>


            <form>
                {formData.map((item, index) => {
                    return (
                        <div className="row mb-2" key={index}>
                            <div className="col">
                                <select className="form-control"
                                        onChange={(e) => handleChange(e, index, 'filtrationParam')}>
                                    {props.filtrParams.map((param, index) => (
                                        <option key={index}>{param}</option>))}
                                </select>
                            </div>
                            {formData[index].filtrationParam !== 'date' ?
                                <div className="col">
                                    <input type="text" onChange={(e) => handleChange(e, index, 'filtrationValue')}
                                           placeholder="значение" className="form-control"/>
                                </div>
                                :
                                <DateRangePicker
                                    onChange={(value) => handleDateChange(value, index)}
                                    value={value}
                                    clearIcon={false}
                                    calendarIcon={false}
                                />
                            }
                        </div>
                    )
                })}
                {formData.length
                    ?
                    <div className="row">
                        <div className="col text-right">
                            <a className="btn btn-success text-white"
                               onClick={() => props.onSubmitForm(formData)}>применить фильтр</a>
                            {props.isFiltered ?
                            <a className="btn btn-secondary text-white ml-3" onClick={() => props.onGroupClick()}>
                                Группировать по городу</a>
                                :null
                            }
                        </div>
                    </div>
                    : null
                }

            </form>
        </>

    )
};

export default FilterForm;
