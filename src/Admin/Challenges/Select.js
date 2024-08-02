import React from 'react';

const Select = ({ list, setValue, placeHolder, value }) => {
    const handleChange = (event) => {
        const selectedId = event.target.value;
        setValue(selectedId);
    };

    return (
        <select
            onChange={handleChange}
            value={value}
            className="border rounded-3 px-4 pointer w-75"
            style={{ height: '6rem', outline: 'none' }}
        >
            <option value="" disabled>{placeHolder}</option>
            {list && list.length > 0 ? (
                list.map((item) => {
                    const [id, theme] = Object.entries(item)[0];
                    return (
                        <option key={id} value={id}>
                            {theme}
                        </option>
                    );
                })
            ) : (
                <option disabled>No Data found</option>
            )}
        </select>
    );
};

export default Select;
