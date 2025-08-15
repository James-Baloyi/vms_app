import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { globalStyles, COLORS } from '../styles/globalStyles';
import { apiClient } from '../utils/api';
import { storage } from '../utils/storage';

export default function VouchersScreen() {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [farmerData, setFarmerData] = useState(null);

  useEffect(() => {
    loadVouchers();
  }, []);

  const loadVouchers = async () => {
    try {
      // Get farmer data first
      const farmer = await storage.getFarmerData();
      setFarmerData(farmer);

      if (farmer?.id) {
        // Try to get vouchers from API
        const vouchersResponse = await apiClient.getVouchers(farmer.id);
        
        if (vouchersResponse.success && vouchersResponse.result) {
          const voucherItems = vouchersResponse.result.items || [];
          setVouchers(voucherItems);
        } else {
          setVouchers([]);
        }
      } else {
        setVouchers([]);
      }
    } catch (error) {
      console.error('Error loading vouchers:', error);
      setVouchers([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadVouchers();
    setRefreshing(false);
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE': return COLORS.success;
      case 'AWAITING VERIFICATION': return '#FF9800';
      case 'PENDING': return '#FF9800';
      case 'EXPIRING SOON': return COLORS.error;
      case 'EXPIRED': return COLORS.textLight;
      case 'USED': return COLORS.textLight;
      default: return COLORS.textLight;
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'R0';
    return `R${amount.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'Invalid date';
    }
  };

  const getVoucherSummary = () => {
    const active = vouchers.filter(v => v.status?.toUpperCase() === 'ACTIVE').length;
    const pending = vouchers.filter(v => v.status?.toUpperCase() === 'PENDING' || v.status?.toUpperCase() === 'AWAITING VERIFICATION').length;
    const expiring = vouchers.filter(v => {
      if (!v.expiryDate) return false;
      const expiryDate = new Date(v.expiryDate);
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      return expiryDate <= thirtyDaysFromNow && v.status?.toUpperCase() === 'ACTIVE';
    }).length;

    return { active, pending, expiring };
  };

  const summary = getVoucherSummary();

  if (loading) {
    return (
      <SafeAreaView style={globalStyles.container}>
        <View style={[globalStyles.screenPadding, styles.centerContent]}>
          <Text>Loading vouchers...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView 
        style={globalStyles.screenPadding}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={globalStyles.title}>My Vouchers</Text>
          <Text style={globalStyles.subtitle}>Manage your agricultural vouchers</Text>
        </View>

        <View style={styles.summary}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{summary.active}</Text>
            <Text style={styles.summaryLabel}>Active</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{summary.pending}</Text>
            <Text style={styles.summaryLabel}>Pending</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{summary.expiring}</Text>
            <Text style={styles.summaryLabel}>Expiring Soon</Text>
          </View>
        </View>

        {vouchers.length === 0 ? (
          <View style={[globalStyles.card, styles.emptyState]}>
            <Text style={styles.emptyTitle}>No Vouchers Yet</Text>
            <Text style={styles.emptyDescription}>
              Your vouchers will appear here once they are issued by the administration team. 
              You will be notified when vouchers become available.
            </Text>
            <TouchableOpacity style={globalStyles.button} onPress={onRefresh}>
              <Text style={globalStyles.buttonText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.vouchersList}>
            {vouchers.map((voucher) => (
              <View key={voucher.id} style={[globalStyles.card, styles.voucherCard]}>
                <View style={styles.voucherHeader}>
                  <Text style={styles.voucherTitle}>
                    {voucher.title || voucher.name || `${voucher.programme || 'Programme'} Voucher`}
                  </Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(voucher.status) }]}>
                    <Text style={styles.statusText}>
                      {voucher.status || 'PENDING'}
                    </Text>
                  </View>
                </View>
                
                <Text style={styles.voucherId}>
                  Voucher ID: {voucher.voucherId || voucher.id || 'N/A'}
                </Text>
                
                <Text style={styles.voucherAmount}>
                  {formatCurrency(voucher.amount || voucher.value)}
                </Text>
                
                <View style={styles.voucherDetails}>
                  <Text style={styles.detailLabel}>
                    Programme: <Text style={styles.detailValue}>{voucher.programme || voucher.program || 'Not specified'}</Text>
                  </Text>
                  <Text style={styles.detailLabel}>
                    Valid Until: <Text style={styles.detailValue}>{formatDate(voucher.expiryDate || voucher.validUntil)}</Text>
                  </Text>
                  <Text style={styles.detailLabel}>
                    Usage: <Text style={styles.detailValue}>{voucher.usage || voucher.description || 'Agricultural supplies'}</Text>
                  </Text>
                  {voucher.remainingAmount && (
                    <Text style={styles.detailLabel}>
                      Remaining: <Text style={styles.detailValue}>{formatCurrency(voucher.remainingAmount)}</Text>
                    </Text>
                  )}
                </View>

                {(voucher.status?.toUpperCase() === 'ACTIVE') && (
                  <TouchableOpacity style={[globalStyles.button, styles.useButton]}>
                    <Text style={globalStyles.buttonText}>Use Voucher</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 20,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  emptyDescription: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
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