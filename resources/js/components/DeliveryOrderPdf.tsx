/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Document, Page, PDFViewer, StyleSheet, Text, View } from '@react-pdf/renderer';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from './ui/sheet';

// Register a font if needed
// Font.register({ family: 'Helvetica', src: 'https://fonts.gstatic.com/s/helvetica/*.ttf' });

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 10,
        fontFamily: 'Helvetica',
        lineHeight: 1.4,
        transform: 'scale(0.9)', transformOrigin: 'top center'

    },
    section: {
        marginBottom: 10,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    soldTo: {},
    shipTo: {},
    invoiceMeta: { width: 200 },
    bold: { fontWeight: 'bold' },
    table: {
        // @ts-ignore
        display: 'table',
        width: 'auto',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#000',
        borderRightWidth: 0,
        borderBottomWidth: 0,
        marginBottom: 4,
    },
    tableRow: { flexDirection: 'row' },
    tableColHeader: {
        width: '20%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderColor: '#000',
        backgroundColor: '#F0F0F0',
        padding: 4,
        textAlign: 'center',
    },
    tableCol: {
        width: '20%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderColor: '#000',
        padding: 4,
        textAlign: 'center',
    },
    descriptionCol: { width: '60%', padding: 4, borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0, borderColor: '#000' },
    descriptionHeaderCol: { backgroundColor: '#F0F0F0', width: '60%', padding: 4, borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0, borderColor: '#000' },
    totalsContainer: { alignSelf: 'flex-end', width: 200, marginTop: 4 },
    totalsRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 2 },
    footer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
    signatureLine: { borderTopWidth: 1, borderColor: '#000', width: 150, marginTop: 70 },
});

// Helper to format currency
// @ts-ignore
const formatCurrency = (num) => `IDR ${Number(num).toLocaleString('id-ID', { minimumFractionDigits: 0 })}`;
// @ts-ignore
const DeliveryOrderPDF = ({ data, isOpen, onClose }) => {
    // Calculate amounts
    const subtotal = data ? data?.items?.reduce(
        // @ts-ignore
        (sum, item) => sum + parseFloat(item.unit_price) * item.quantity,
        0,
    ):0;
    const vat = subtotal * 0.11;
    const total = subtotal + vat;
    console.log(data);
    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="min-w-[50vw]">
                <SheetHeader>
                    <SheetTitle>Petinjau Surat Jalan</SheetTitle>
                    <SheetDescription className="min-h-[90vh]">
                        <PDFViewer style={{ width: '100%', height: '100%' }}>
                                <Document>
                                    <Page size="A4" style={styles.page}>
                                        {/* Header */}
                                        <View style={styles.headerContainer}>
                                            <View style={styles.soldTo}>
                                                <Text style={styles.bold}>SOLD TO :</Text>
                                                <Text>{data?.buyer?.name}</Text>
                                                <Text>{data?.buyer?.address}</Text>
                                            </View>
                                            <View style={styles.invoiceMeta}>
                                                <Text style={styles.bold}>No. Invoice : {data?.order_number}</Text>
                                                <View style={{ flexDirection: 'row', marginTop: 4 }}>
                                                    <View>
                                                        <Text>DATE</Text>
                                                        <Text>SALES</Text>
                                                        <Text>CURRENCY</Text>
                                                    </View>
                                                    <View style={{ marginLeft: 4 }}>
                                                        <Text>: {data?.date || '-'}</Text>
                                                        <Text>: {data?.creator?.name || '-'}</Text>
                                                        <Text>: IDR</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>

                                        {/* Ship To */}
                                        <View style={styles.section}>
                                            <Text style={styles.bold}>SHIP TO :</Text>
                                            <Text>{data?.buyer?.name || '-'}</Text>
                                            <Text>{data?.buyer?.address || '-'}</Text>
                                        </View>

                                        {/* Items Table */}
                                        <View style={styles.table}>
                                            <View style={styles.tableRow}>
                                                <Text style={styles.tableColHeader}>QTY</Text>
                                                <Text style={styles.tableColHeader}>PART NO</Text>
                                                <Text style={styles.descriptionHeaderCol}>DESCRIPTION</Text>
                                                {/* <Text style={styles.tableColHeader}>UNIT PRICE</Text>
                                                <Text style={styles.tableColHeader}>TOTAL PRICE</Text> */}
                                            </View>
                                            {/* @ts-ignore */}
                                            {data?.items?.map((item) => {
                                                // @ts-ignore
                                                // const prod = products.find((p) => p.id === item.product_id) || {};
                                                const lineTotal = item.quantity * parseFloat(item.unit_price);
                                                return (
                                                    <View style={styles.tableRow} key={item?.id}>
                                                        <Text style={styles.tableCol}>{item?.quantity}</Text>
                                                        <Text style={styles.tableCol}>{item?.product?.part_number}</Text>
                                                        <Text style={styles.descriptionCol}>{item?.product?.name}</Text>
                                                        {/* <Text style={styles.tableCol}>{formatCurrency(item?.unit_price || 0)}</Text> */}
                                                        {/* <Text style={styles.tableCol}>{formatCurrency(lineTotal || 0)}</Text> */}
                                                    </View>
                                                );
                                            })}
                                        </View>

                                        {/* Totals */}
                                        {/* <View style={styles.totalsContainer}>
                                            <View style={styles.totalsRow}>
                                                <Text>SUB TOTAL</Text>
                                                <Text>{formatCurrency(subtotal || 0)}</Text>
                                            </View>
                                            <View style={styles.totalsRow}>
                                                <Text>DISCOUNT</Text>
                                                <Text>0</Text>
                                            </View>
                                            <View style={styles.totalsRow}>
                                                <Text>DPP</Text>
                                                <Text>{formatCurrency(subtotal || 0)}</Text>
                                            </View>
                                            <View style={styles.totalsRow}>
                                                <Text>VAT 11%</Text>
                                                <Text>{formatCurrency(vat || 0)}</Text>
                                            </View>
                                            <View style={[styles.totalsRow, { fontWeight: 'bold', borderTopWidth: 1, borderColor: '#000' }]}>
                                                <Text>TOTAL INVOICE</Text>
                                                <Text>{formatCurrency(total || 0)}</Text>
                                            </View>
                                        </View> */}

                                        {/* Footer */}
                                        <View style={styles.footer}>
                                            <View>
                                                <Text>Received In Good Condition</Text>
                                                <View style={styles.signatureLine} />
                                            </View>
                                            <View>
                                                <Text>Approved By :</Text>
                                                <View style={styles.signatureLine} />
                                            </View>
                                        </View>
                                    </Page>
                                </Document>
                        </PDFViewer>
                    </SheetDescription>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    );
};

export default DeliveryOrderPDF;
