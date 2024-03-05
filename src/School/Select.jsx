/* eslint-disable indent */
// eslint-disable-next-line no-unused-vars
const Select = ({ list, setValue, placeHolder, value, drop }) => {
    return (
        <select
            onChange={(e) => setValue(e.target.value)}
            value={value}
            className="border rounded-3 px-4 pointer w-100"
            style={{ height: '6rem', outline: 'none' }}
        >
            <option value={''}>{placeHolder}</option>
            {list && list.length > 0 ? (
                list.map((item, i) => (
                    // <option key={i} value={item}>
                    //     {item}
                    // </option>
                    <option
                        key={i}
                        value={
                            drop == 1
                                ? item.district_id
                                : drop == 2
                                ? item.block_id
                                : drop == 3
                                ? item.taluk_id
                                : drop == 4
                                ? item.place_id
                                : item
                        }
                    >
                        {drop == 1
                            ? item.district_name
                            : drop == 2
                            ? item.block_name
                            : drop == 3
                            ? item.taluk_name
                            : drop == 4
                            ? item.place_name
                            : item}
                    </option>
                ))
            ) : (
                <option disabled>No Data found</option>
            )}
        </select>
    );
};

export default Select;
