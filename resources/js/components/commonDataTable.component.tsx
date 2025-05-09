import { router, useForm } from '@inertiajs/react';
import { SearchX } from 'lucide-react';
import { useEffect, useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface CommonDataTableProps<T> {
    columns: TableColumn<T>[];
    data: T[];
    searchRoute: string;
    noSearch?: boolean;
    totalRow: number;
}

const CommonDataTable = <T,>({
    columns,
    data,
    searchRoute,
    noSearch,
    totalRow,

    ...props
}: CommonDataTableProps<T>) => {
    const [searchTerm, setSearchTerm] = useState('');
    const { setData, get } = useForm({ search: '' });

    useEffect(() => {
        setData('search', searchTerm);
        const delay = setTimeout(() => {
            if (searchTerm.trim() !== '') {
                get(route(searchRoute), { preserveState: true, replace: true });
            }
        }, 500); // 500ms delay

        return () => clearTimeout(delay); // Cleanup function
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm]);
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value); // Update local state first
    };
    const resetSearch = () => {
        setData('search', '');
        setSearchTerm('');
        router.visit(route(searchRoute));
    };
    function removeId(data) {
        if (typeof data !== 'object' || data === null) {
            return data; 
        }

        if (Array.isArray(data)) {
            return data.map((item) => removeId(item));
        }

        const newData = { ...data }; 
        delete newData.id;

        for (const key in newData) {
            if (typeof newData[key] === 'object' && newData[key] !== null) {
                newData[key] = removeId(newData[key]);
            }
        }

        return newData;
    }

    return (
        <>
            {!noSearch && (
                <div className="grid grid-cols-12 pb-2">
                    <div className="col-span-10 md:col-span-3 md:col-start-10 flex gap-2">
                        <Button size={'icon'} variant={'outline'} onClick={resetSearch}>
                            <SearchX />
                        </Button>
                        <Input
                            type="search"
                            placeholder="Cari ..."
                            value={searchTerm}
                            onChange={(e) => {
                                handleSearch(e);
                            }}
                        />
                    </div>
                </div>
            )}
            <div className="max-h-[440px] overflow-y-scroll">
                <DataTable
                    columns={columns}
                    data={data}
                    pagination
                    paginationServer
                    paginationTotalRows={totalRow || 0} // Total users from Laravel
                    onChangePage={(page) => {
                        router.get(route(searchRoute, { page }), {}, { preserveState: true, replace: true });
                    }}
                    highlightOnHover
                    
                    {...props}
                />
            </div>
        </>
    );
};

export default CommonDataTable;
