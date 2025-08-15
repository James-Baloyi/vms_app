import React from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native';
import { globalStyles, COLORS } from '../styles/globalStyles';

export default function VouchersScreen() {
  const mockVouchers = [
    {
      id: 'F2025-001',
      title: 'Seeds and Fertiliser Voucher',
      amount: 2500,
      status: 'ACTIVE',
      program: 'PESI',
      validUntil: '01/01/2026',
      usage: 'Seeds, Fertiliser, Planting Tools'
    },
    {
      id: 'F2025-002', 
      title: 'Equipment Voucher',
      amount: 5000,
      status: 'AWAITING VERIFICATION',
      program: 'WASP',
      validUntil: '01/01/2026',
      usage: 'Equipment and Machinery'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return COLORS.success;
      case 'AWAITING VERIFICATION': return '#FF9800';
      case 'EXPIRING SOON': return COLORS.error;
      default: return COLORS.textLight;
    }
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView style={globalStyles.screenPadding}>
        <View style={styles.header}>
          <Text style={globalStyles.title}>My Vouchers</Text>
          <Text style={globalStyles.subtitle}>Manage your agricultural vouchers</Text>
        </View>

        <View style={styles.summary}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>2</Text>
            <Text style={styles.summaryLabel}>Active</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>1</Text>
            <Text style={styles.summaryLabel}>Awaiting Verification</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>0</Text>
            <Text style={styles.summaryLabel}>Expiring Soon</Text>
          </View>
        </View>

        <View style={styles.vouchersList}>
          {mockVouchers.map((voucher) => (
            <View key={voucher.id} style={[globalStyles.card, styles.voucherCard]}>
              <View style={styles.voucherHeader}>
                <Text style={styles.voucherTitle}>{voucher.title}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(voucher.status) }]}>
                  <Text style={styles.statusText}>{voucher.status}</Text>
                </View>
              </View>
              
              <Text style={styles.voucherId}>Voucher ID: {voucher.id}</Text>
              <Text style={styles.voucherAmount}>R{voucher.amount.toLocaleString()}</Text>
              
              <View style={styles.voucherDetails}>
                <Text style={styles.detailLabel}>Programme: <Text style={styles.detailValue}>{voucher.program}</Text></Text>
                <Text style={styles.detailLabel}>Valid Until: <Text style={styles.detailValue}>{voucher.validUntil}</Text></Text>
                <Text style={styles.detailLabel}>Usage: <Text style={styles.detailValue}>{voucher.usage}</Text></Text>
              </View>

              {voucher.status === 'ACTIVE' && (
                <TouchableOpacity style={[globalStyles.button, styles.useButton]}>
                  <Text style={globalStyles.buttonText}>Use Voucher</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 20,
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  summaryLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 4,
  },
  vouchersList: {
    gap: 12,
  },
  voucherCard: {
    padding: 16,
  },
  voucherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  voucherTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.white,
  },
  voucherId: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  voucherAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 12,
  },
  voucherDetails: {
    gap: 4,
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  detailValue: {
    fontWeight: '600',
    color: COLORS.text,
  },
  useButton: {
    marginTop: 8,
  },
});