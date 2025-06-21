/* eslint-disable @typescript-eslint/ban-ts-comment */

import { Document, Page, PDFViewer, StyleSheet, Text, View } from '@react-pdf/renderer';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from './ui/sheet';
import { DToptions } from '@/lib/utils';

const styles = StyleSheet.create({
    page: { padding: 24, fontSize: 10 },
    title: { fontSize: 14, marginBottom: 10, textAlign: 'center' },
    //   @ts-ignore
    table: { display: 'table', width: 'auto', marginTop: 10 },
    row: { flexDirection: 'row', borderBottom: '1px solid #ccc', paddingVertical: 4 },
    header: { fontWeight: 'bold', backgroundColor: '#eee' },
    cell: { width: '20%', paddingHorizontal: 4 },
    cellDO: { width: '20%', paddingHorizontal: 4,display:'flex', flexDirection:'column' },
    cellStatus: { width: '20%', paddingHorizontal: 4, textAlign: 'center' },
    cellNumber: { width: '5%', paddingHorizontal: 4 },
    cellDate: { width: '18%', paddingHorizontal: 4,textAlign: 'center'},
});
// ts-ignore
const DeliveryOrderReportPDF = ({ isOpen, orders, onClose }) => (
    <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="min-w-[50vw]">
            <SheetHeader>
                <SheetTitle>Petinjau Surat Jalan</SheetTitle>
                <SheetDescription className="min-h-[90vh]">
                    {orders && (
                        <PDFViewer style={{ width: '100%', height: '100%' }}>
                            <DeliveryOrderReportDoc orders={orders} />
                        </PDFViewer>
                    )}
                </SheetDescription>
            </SheetHeader>
        </SheetContent>
    </Sheet>
);

export default DeliveryOrderReportPDF;
export const DeliveryOrderReportDoc = ({ orders }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <Text style={styles.title}>Delivery Order Report</Text>

            <View style={styles.table}>
                <View style={[styles.row, styles.header]}>
                    <Text style={styles.cellNumber}>No</Text>
                    <Text style={styles.cell}>Order #</Text>
                    <Text style={styles.cellDate}>Reservasi</Text>
                    <Text style={styles.cell}>Di Setujui</Text>
                    <Text style={styles.cell}>Di Kirim</Text>
                    <Text style={styles.cellStatus}>Status</Text>
                </View>

                {
                    // @ts-ignore
                    orders.map((order, index) => (
                        <View style={styles.row} key={order.id}>
                            <Text style={styles.cellNumber}>{index + 1}</Text>
                            <View style={styles.cell}>
                                <Text>{order.order_number}</Text>
                                <Text style={{marginTop:'4px',fontSize:'10pt'}}>sales: {order.creator.name}</Text>
                                <Text style={{marginTop:'4px',fontSize:'10pt'}}>konsumen: {order.buyer.name}</Text>
                                {/* <Text style={{marginTop:'4px', fontSize:'10pt'}}>tgl: {order.date?new Date(order.date).toLocaleDateString('id-ID'):'-'}</Text> */}
                            </View>
                            <Text style={styles.cellDate}>{order.reserved_at?new Date(order.reserved_at).toLocaleDateString():'-'}</Text>
                            <Text style={styles.cell}>{order.approved_at?new Date(order.approved_at).toLocaleDateString('id-ID',DToptions):'-'}</Text>
                            <Text style={styles.cell}>{order.delivered_at?new Date(order.delivered_at).toLocaleDateString('id-ID',DToptions):'-'}</Text>
                            <Text style={styles.cellStatus}>{order.status}</Text>
                        </View>
                    ))
                }
            </View>

            <View style={styles.row}>
                <Text style={styles.cell}>Total: {orders.length}</Text>
            </View>
        </Page>
    </Document>
);
