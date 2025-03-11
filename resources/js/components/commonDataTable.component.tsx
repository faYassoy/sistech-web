import { SearchX } from 'lucide-react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { router, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface CommonDataTableProps<T> {
    columns: TableColumn<T>[];
    data: T[];
    searchRoute:string
}

const CommonDataTable = <T,>({
    columns,
    data,
    searchRoute,

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
    return (
        <>
            <div className="grid grid-cols-12 pb-2">
                <div className="col-span-3 col-start-10 flex gap-2">
                    <Button size={'icon'} variant={'outline'} onClick={resetSearch}>
                        <SearchX />
                    </Button>
                    <Input
                        type="search"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => {
                            handleSearch(e);
                        }}
                    />
                </div>
            </div>
            <div className="max-h-[440px] overflow-y-scroll">
                <DataTable columns={columns} data={data} pagination highlightOnHover {...props} />;
            </div>
        </>
    );
};

export default CommonDataTable;
