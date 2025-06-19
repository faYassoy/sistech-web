import { useEffect, useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SearchX } from 'lucide-react';
import DataTable from 'react-data-table-component';

type CommonDataTableProps<T> = {
    columns: any;
    data: T[];
    searchRoute: string;
    noSearch?: boolean;
    totalRow?: number;
    [key: string]: any;
};

// 🔁 Debounce Hook
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
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

    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    // 🌸 Debounced Search
    useEffect(() => {
        setData('search', debouncedSearchTerm);
        if (debouncedSearchTerm.trim() !== '') {
            get(route(searchRoute, { page: 1 }), {
                preserveState: true,
                replace: true,
            });
        }
    }, [debouncedSearchTerm]);

    // ✨ Forced Search (on Enter key)
    const forceSearch = () => {
        if (searchTerm.trim() !== '') {
            setData('search', searchTerm);
            get(route(searchRoute, { page: 1 }), {
                preserveState: true,
                replace: true,
            });
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            forceSearch(); // ⏎ tekan Enter, langsung cari
        }
    };

    const resetSearch = () => {
        setData('search', '');
        setSearchTerm('');
        router.visit(route(searchRoute, { page: 1 }));
    };

    return (
        <>
            {!noSearch && (
                <div className="grid grid-cols-12 pb-2">
                    <div className="col-span-10 md:col-span-3 md:col-start-10 flex gap-2">
                        <Button size="icon" variant="outline" onClick={resetSearch}>
                            <SearchX />
                        </Button>
                        <Input
                            type="search"
                            placeholder="Cari ..."
                            value={searchTerm}
                            onChange={handleSearch}
                            onKeyDown={handleKeyDown} // ⌨️ Dengarkan Enter
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
                    paginationTotalRows={totalRow || 0}
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
