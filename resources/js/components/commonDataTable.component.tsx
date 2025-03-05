import DataTable, { TableColumn } from 'react-data-table-component';

interface CommonDataTableProps<T> {
    columns: TableColumn<T>[];
    data: T[];
}

const CommonDataTable = <T,>({
    columns,
    data,

    ...props
}: CommonDataTableProps<T>) => {
   

    return <DataTable columns={columns} data={data} pagination highlightOnHover {...props} />;
};

export default CommonDataTable;
