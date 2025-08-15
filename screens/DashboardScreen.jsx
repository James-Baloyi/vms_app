import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, StyleSheet, RefreshControl } from 'react-native';
import { globalStyles, COLORS } from '../styles/globalStyles';
import { storage } from '../utils/storage';
import { apiClient } from '../utils/api';

export default function DashboardScreen() {
  const [farmerData, setFarmerData] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const storedFarmerData = await storage.getFarmerData();
      setFarmerData(storedFarmerData);

      if (storedFarmerData?.id) {
        try {
          const freshData = await apiClient.getFarmer(storedFarmerData.id);
          if (freshData.success) {
            setFarmerData(freshData.result);
            await storage.setFarmerData(freshData.result);
          }
        } catch (error) {
          console.log('Using cached farmer data (API unavailable)');
        }

        // TODO: Load real voucher/stats data when voucher API is available
        // For now, show basic info from farmer profile
        setStats({
          activeVouchers: 0, // Will be populated from voucher API
          programsEnrolled: storedFarmerData.selectedPrograms?.length || 0,
          totalValue: 0 // Will be calculated from active vouchers
        });
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  if (loading || !farmerData) {
    return (
      <SafeAreaView style={globalStyles.container}>
        <View style={[globalStyles.screenPadding, styles.loadingContainer]}>
          <Text>Loading dashboard...</Text>
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
          <Text style={styles.greeting}>
            Welcome, {farmerData.firstName || 'Farmer'}
          </Text>
          <Text style={styles.farmerId}>
            Farmer ID: {farmerData.id ? `F${farmerData.id.slice(-6)}` : 'Generating...'}
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={[globalStyles.card, styles.statCard]}>
            <Text style={styles.statNumber}>{stats?.activeVouchers || 0}</Text>
            <Text style={styles.statLabel}>Active Vouchers</Text>
          </View>
          
          <View style={[globalStyles.card, styles.statCard]}>
            <Text style={styles.statNumber}>{stats?.programsEnrolled || 0}</Text>
            <Text style={styles.statLabel}>Programmes Enrolled</Text>
          </View>
        </View>

        <View style={globalStyles.card}>
          <Text style={styles.sectionTitle}>Registration Status</Text>
          <Text style={styles.statusText}>
            ✅ Registration Complete
          </Text>
          <Text style={styles.statusDescription}>
            Your farmer profile has been created successfully. Vouchers will be assigned based on available programmes.
          </Text>
        </View>

        <View style={globalStyles.card}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <Text style={styles.actionItem}>• View My Vouchers</Text>
            <Text style={styles.actionItem}>• Check Order Status</Text>
            <Text style={styles.actionItem}>• Find Suppliers</Text>
            <Text style={styles.actionItem}>• Update Profile</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 30,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  farmerId: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  statusText: {
    fontSize: 16,
    color: COLORS.success,
    marginBottom: 8,
  },
  statusDescription: {
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 20,
  },
  quickActions: {
    gap: 8,
  },
  actionItem: {
    fontSize: 16,
    color: COLORS.textLight,
    lineHeight: 24,
  },
});