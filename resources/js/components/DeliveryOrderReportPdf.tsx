/* eslint-disable @typescript-eslint/ban-ts-comment */

import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 24, fontSize: 10 },
  title: { fontSize: 14, marginBottom: 10, textAlign: 'center' },
//   @ts-ignore
  table: { display: 'table', width: 'auto', marginTop: 10 },
  row: { flexDirection: 'row', borderBottom: '1px solid #ccc', paddingVertical: 4 },
  header: { fontWeight: 'bold', backgroundColor: '#eee' },
  cell: { flex: 1, paddingHorizontal: 4 },
});
// ts-ignore
const DeliveryOrderReportPDF = ({ orders }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Delivery Order Report</Text>

      <View style={styles.table}>
        <View style={[styles.row, styles.header]}>
          <Text style={styles.cell}>No</Text>
          <Text style={styles.cell}>Order #</Text>
          <Text style={styles.cell}>Date</Text>
          <Text style={styles.cell}>Sales</Text>
          <Text style={styles.cell}>Buyer</Text>
          <Text style={styles.cell}>Status</Text>
        </View>

        {
        // @ts-ignore
        orders.map((order, index) => (
          <View style={styles.row} key={order.id}>
            <Text style={styles.cell}>{index + 1}</Text>
            <Text style={styles.cell}>{order.order_number}</Text>
            <Text style={styles.cell}>{order.date}</Text>
            <Text style={styles.cell}>{order.creator.name}</Text>
            <Text style={styles.cell}>{order.buyer.name}</Text>
            <Text style={styles.cell}>{order.status}</Text>
          </View>
        ))}
      </View>
      
      <View style={styles.row}>
            <Text style={styles.cell}>Total: {orders.length}</Text>
          </View>
    </Page>
  </Document>
);

export default DeliveryOrderReportPDF;
