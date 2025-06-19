/* eslint-disable @typescript-eslint/ban-ts-comment */
import CommonDataTable from '@/components/commonDataTable.component';
import DeliveryOrderReportPDF, { DeliveryOrderReportDoc } from '@/components/DeliveryOrderReportPdf';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { router, usePage } from '@inertiajs/react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useState } from 'react';

interface DeliveryOrder {
    id: number;
    order_number: string;
    date: string;
    status: string;
    buyer: { name: string };
    creator: { name: string };
    [key: string]: any;
}

interface PageProps {
    deliveryOrders: {
        data: DeliveryOrder[];
        current_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        search?: string;
        status?: string;
        salesperson_id?: string;
        date_filter_type?: string;
        date_value?: string;
    };
    salespersons: { id: number; name: string }[];
}

const DeliveryOrderReport: React.FC = () => {
    // @ts-ignore
    const { deliveryOrders, filters, salespersons } = usePage<PageProps>().props;

    const [localFilters, setLocalFilters] = useState({ ...filters });
    const [rangeStart, setRangeStart] = useState<string>(() => {
        if ((filters.date_filter_type === 'weekly' || filters.date_filter_type === 'range') && filters.date_value) {
            return filters.date_value.split(',')[0];
        }
        return '';
    });
    const [rangeEnd, setRangeEnd] = useState<string>(() => {
        if ((filters.date_filter_type === 'weekly' || filters.date_filter_type === 'range') && filters.date_value) {
            return filters.date_value.split(',')[1];
        }
        return '';
    });

    const applyFilters = () => {
        let finalFilters = { ...localFilters };
        if (localFilters.date_filter_type === 'weekly' || localFilters.date_filter_type === 'range') {
            finalFilters.date_value = rangeStart && rangeEnd ? `${rangeStart},${rangeEnd}` : undefined;
        }
        router.get(route('reports.index'), finalFilters, { preserveState: true, replace: true });
    };

const [isOpen, setIsOpen] = useState(false);

    const columns = [
        {
            name: '#',
            selector: (_: DeliveryOrder, index: number) => (deliveryOrders.current_page - 1) * deliveryOrders.per_page + index + 1,
            width: '50px',
        },
        { name: 'No. Surat Jalan', selector: (row: DeliveryOrder) => row.order_number, sortable: true },
        { name: 'Konsumen', selector: (row: DeliveryOrder) => row.buyer.name, sortable: true },
        { name: 'Tanggal', selector: (row: DeliveryOrder) => new Date(row.date).toLocaleDateString(), sortable: true },
        { name: 'Status', selector: (row: DeliveryOrder) => row.status, sortable: true },
        { name: 'Di Buat Oleh', selector: (row: DeliveryOrder) => row.creator.name, sortable: true },
    ];
const date = new Date
    return (
        <AppLayout>
            <div className="container mx-auto p-4">
                <div className="mb-6 flex justify-between">
                    <h1 className="text-2xl font-extrabold text-gray-800">Laporan Surat Jalan</h1>
                    <div className="flex gap-4">
                    <Button onClick={()=>{setIsOpen(true)}} variant="outline">Preview</Button>

                    <PDFDownloadLink document={<DeliveryOrderReportDoc orders={deliveryOrders.data} />} fileName={"delivery-order-report ["+ date.toDateString()+"]"}>
                        {({ loading }) => <Button variant="outline">{loading ? 'Generating...' : 'Download PDF 📄'}</Button>}
                    </PDFDownloadLink>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="mb-8 grid grid-cols-1 gap-6 rounded-lg bg-white p-6 shadow-md md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                    <select
                        value={localFilters.date_filter_type || ''}
                        onChange={(e) => {
                            const type = e.target.value;
                            setLocalFilters((prev) => ({ ...prev, date_filter_type: type || undefined, date_value: undefined }));
                            setRangeStart('');
                            setRangeEnd('');
                        }}
                        className="rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-slate-500 focus:outline-none"
                    >
                        <option value="">Tanpa Filter</option>
                        <option value="daily">Tanggal</option>
                        <option value="weekly">Mingguan</option>
                        <option value="monthly">Bulan</option>
                        <option value="range">Periode</option>
                    </select>

                    {localFilters.date_filter_type === 'daily' && (
                        <input
                            type="date"
                            value={localFilters.date_value || ''}
                            onChange={(e) => setLocalFilters((prev) => ({ ...prev, date_value: e.target.value }))}
                            className="rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-slate-500 focus:outline-none"
                        />
                    )}

                    {(localFilters.date_filter_type === 'weekly' || localFilters.date_filter_type === 'range') && (
                        <>
                            <input
                                type="date"
                                value={rangeStart}
                                onChange={(e) => setRangeStart(e.target.value)}
                                className="rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-slate-500 focus:outline-none"
                            />
                            <input
                                type="date"
                                value={rangeEnd}
                                onChange={(e) => setRangeEnd(e.target.value)}
                                className="rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-slate-500 focus:outline-none"
                            />
                        </>
                    )}

                    {localFilters.date_filter_type === 'monthly' && (
                        <input
                            type="month"
                            value={localFilters.date_value || ''}
                            onChange={(e) => setLocalFilters((prev) => ({ ...prev, date_value: e.target.value }))}
                            className="rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-slate-500 focus:outline-none"
                        />
                    )}

                    <Button onClick={applyFilters}>Terapkan Filter</Button>
                </div>

                <div className="mb-8 grid grid-cols-1 gap-6 rounded-lg bg-white p-6 shadow-md md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                    <input
                        type="text"
                        placeholder="Cari..."
                        value={localFilters.search || ''}
                        onChange={(e) => setLocalFilters((prev) => ({ ...prev, search: e.target.value }))}
                        className="col-span-2 rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-slate-500 focus:outline-none"
                    />

                    <select
                        value={localFilters.status || ''}
                        onChange={(e) => setLocalFilters((prev) => ({ ...prev, status: e.target.value || undefined }))}
                        className="rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-slate-500 focus:outline-none"
                    >
                        <option value="">Semua Status</option>
                        <option value="pending">Menunggu</option>
                        <option value="approved">Disetujui</option>
                        <option value="delivered">Dikirim</option>
                        <option value="canceled">Dibatalkan</option>
                    </select>

                    <select
                        value={localFilters.salesperson_id || ''}
                        onChange={(e) => setLocalFilters((prev) => ({ ...prev, salesperson_id: e.target.value || undefined }))}
                        className="rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-slate-500 focus:outline-none"
                    >
                        <option value="">Semua Seles</option>
                        {salespersons.map((sp) => (
                            <option key={sp.id} value={sp.id}>
                                {sp.name}
                            </option>
                        ))}
                    </select>
                    <Button onClick={applyFilters}>Cari</Button>
                </div>

                {/* Data Table */}
                <div className="rounded-lg bg-white p-6 shadow-md">
                    <CommonDataTable
                        // @ts-ignore
                        columns={columns}
                        noSearch
                        data={deliveryOrders.data}
                        searchRoute="reports.index"
                        totalRow={deliveryOrders.total}
                        paginationTotalRows={deliveryOrders.total}
                        onChangePage={(page, totalRows) => router.get(route('reports.index'), { ...filters, page }, { preserveState: true })}
                        onChangeRowsPerPage={(currentRowsPerPage, currentPage) =>
                            router.get(
                                route('reports.index'),
                                { ...filters, per_page: currentRowsPerPage, page: currentPage },
                                { preserveState: true },
                            )
                        }
                    />
                </div>
            </div>
            <DeliveryOrderReportPDF isOpen={isOpen} onClose={()=> setIsOpen(!isOpen)} orders={deliveryOrders.data} />
        </AppLayout>
    );
};

export default DeliveryOrderReport;
