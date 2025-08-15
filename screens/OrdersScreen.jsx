import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { globalStyles, COLORS } from '../styles/globalStyles';
import { storage } from '../utils/storage';

export default function OrdersScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      // TODO: Replace with real API call when orders endpoint is available
      // const farmerData = await storage.getFarmerData();
      // const ordersResponse = await apiClient.getOrders(farmerData.id);
      
      // For now, return empty array since no real orders API yet
      setOrders([]);
    } catch (error) {
      console.error('Error loading orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return COLORS.success;
      case 'Awaiting Agent Confirmation': return '#FF9800';
      case 'In Transit': return '#2196F3';
      default: return COLORS.textLight;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={globalStyles.container}>
        <View style={[globalStyles.screenPadding, styles.centerContent]}>
          <Text>Loading orders...</Text>
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
          <Text style={globalStyles.title}>My Orders</Text>
          <Text style={globalStyles.subtitle}>View current and past orders</Text>
        </View>

        {orders.length === 0 ? (
          <View style={[globalStyles.card, styles.emptyState]}>
            <Text style={styles.emptyTitle}>No Orders Yet</Text>
            <Text style={styles.emptyDescription}>
              Your orders will appear here once you start using your vouchers with suppliers or implementation agents.
            </Text>
            <TouchableOpacity style={globalStyles.button}>
              <Text style={globalStyles.buttonText}>Find Suppliers</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.ordersList}>
            {orders.map((order) => (
              <View key={order.id} style={[globalStyles.card, styles.orderCard]}>
                <View style={styles.orderHeader}>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                    <Text style={styles.statusText}>{order.status}</Text>
                  </View>
                </View>
                
                <Text style={styles.orderId}>{order.id}</Text>
                <Text style={styles.orderDate}>{order.date}</Text>
                <Text style={styles.orderAmount}>R{order.amount}</Text>
                
                <View style={styles.orderDetails}>
                  <Text style={styles.detailLabel}>Agent: <Text style={styles.detailValue}>{order.agent}</Text></Text>
                  <Text style={styles.detailLabel}>Items: <Text style={styles.detailValue}>{order.items}</Text></Text>
                  {order.estimatedDelivery && (
                    <Text style={styles.detailLabel}>Estimated Delivery: <Text style={styles.detailValue}>{order.estimatedDelivery}</Text></Text>
                  )}
                  {order.delivered && (
                    <Text style={styles.detailLabel}>Delivered: <Text style={styles.detailValue}>{order.delivered}</Text></Text>
                  )}
                </View>

                <View style={styles.orderActions}>
                  <TouchableOpacity style={[globalStyles.button, globalStyles.buttonSecondary, styles.actionButton]}>
                    <Text style={globalStyles.buttonSecondaryText}>
                      {order.status === 'Delivered' ? 'Report Issue' : 'Track'}
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={[globalStyles.button, styles.actionButton]}>
                    <Text style={globalStyles.buttonText}>Details</Text>
                  </TouchableOpacity>
                </View>
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
  ordersList: {
    gap: 16,
  },
  orderCard: {
    padding: 16,
  },
  orderHeader: {
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.white,
  },
  orderId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 8,
  },
  orderAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 16,
  },
  orderDetails: {
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
  orderActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    marginVertical: 0,
  },
});