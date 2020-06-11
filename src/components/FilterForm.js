import React, {useState} from 'react';

const FilterForm = (props) => {
    let initialFormData = {filtrationParam: null, filtrationValue: null};
    const [formData, addCondition] = useState([]);
    const addFilterCondition = () => {
        addCondition(formData => [...formData, initialFormData]);
    };
    const handleChange = (e, index, inputType) => {
        const arr = [...formData];
        arr[index][inputType] = e.target.value;
        addCondition(arr)
    };
    return (
        <>
            <div className="row mb-2">
                <div className="col text-right">
                    <a className="btn btn-primary text-white" onClick={addFilterCondition}>+</a>
                </div>
            </div>
            <form>
            {formData.map((item, index) => {
                return (
                    <div className="row mb-2" key={index}>
                        <div className="col">
                            <select className="form-control" onChange={(e) => handleChange(e, index, 'filtrationParam')}>
                                {props.filtrationParams.map((param, index) => (<option key={index}>{param}</option>))}
                            </select>
                        </div>
                        <div className="col">
                            <input type="text" onChange={(e) => handleChange(e, index, 'filtrationValue')}
                                   placeholder="значение" className="form-control"/>
                        </div>
                    </div>
                )
            })}
                {formData.length
                    ?
                    <div className="row">
                        <div className="col text-right">
                            <a className="btn btn-success text-white" onClick={() => props.onSubmitForm(formData)}>применить</a>
                        </div>
                    </div>
                    : null
                }

            </form>
        </>

    )
};

export default FilterForm;
