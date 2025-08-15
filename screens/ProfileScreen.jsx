import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, StyleSheet, Alert, RefreshControl } from 'react-native';
import { globalStyles, COLORS } from '../styles/globalStyles';
import { storage } from '../utils/storage';
import { apiClient } from '../utils/api';
import { getDateOfBirthFromSAID } from '../utils/dob';

export default function ProfileScreen({ navigation }) {
  const [farmerData, setFarmerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const storedData = await storage.getFarmerData();
      setFarmerData(storedData);

      // Try to get fresh data from API
      if (storedData?.id) {
        try {
          const freshData = await apiClient.getFarmer(storedData.id);
          if (freshData.success) {
            setFarmerData(freshData.result);
            await storage.setFarmerData(freshData.result);
          }
        } catch (error) {
          console.log('Using cached profile data (API unavailable)');
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProfile();
    setRefreshing(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      "You're going to have to register again if you logout",
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout }
      ]
    );
  };

  const superSure = () => {
        Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: superSure }
      ]
    );
  }

  const logout = async () => {
    await storage.clearAll();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Landing' }],
    });
  };

  const formatGender = (gender) => {
    if (gender === 1 || gender === '1') return 'Male';
    if (gender === 2 || gender === '2') return 'Female';
    return 'Not specified';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'Not provided';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={globalStyles.container}>
        <View style={[globalStyles.screenPadding, styles.loadingContainer]}>
          <Text>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!farmerData) {
    return (
      <SafeAreaView style={globalStyles.container}>
        <View style={[globalStyles.screenPadding, styles.errorContainer]}>
          <Text style={styles.errorText}>Unable to load profile</Text>
          <TouchableOpacity style={globalStyles.button} onPress={loadProfile}>
            <Text style={globalStyles.buttonText}>Retry</Text>
          </TouchableOpacity>
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
          <Text style={globalStyles.title}>
            {farmerData.fullName || `${farmerData.firstName || ''} ${farmerData.lastName || ''}`.trim() || 'Farmer Profile'}
          </Text>
          <Text style={styles.farmerId}>
            Farmer ID: {farmerData.id ? `F${farmerData.id.slice(-6)}` : 'Not assigned'}
          </Text>
        </View>

        <View style={[globalStyles.card, styles.section]}>
          <Text style={styles.sectionTitle}>Personal Details</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Contact Number</Text>
            <Text style={styles.detailValue}>{farmerData.mobileNumber1 || 'Not provided'}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Gender</Text>
            <Text style={styles.detailValue}>{formatGender(farmerData.gender)}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Email</Text>
            <Text style={styles.detailValue}>{farmerData.emailAddress1 || 'Not provided'}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Secondary Email</Text>
            <Text style={styles.detailValue}>{farmerData.emailAddress2 || 'Not provided'}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date of Birth</Text>
            <Text style={styles.detailValue}>~{formatDate(getDateOfBirthFromSAID(farmerData.identityNumber))}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>ID Number</Text>
            <Text style={styles.detailValue}>{farmerData.identityNumber || 'Not provided'}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Home Number</Text>
            <Text style={styles.detailValue}>{farmerData.homeNumber || 'Not provided'}</Text>
          </View>
        </View>

        <View style={[globalStyles.card, styles.section]}>
          <Text style={styles.sectionTitle}>Farmer Information</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Veteran Status</Text>
            <Text style={styles.detailValue}>{farmerData.veteran ? 'Yes' : 'No'}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Government Employee</Text>
            <Text style={styles.detailValue}>{farmerData.governmentEmployee ? 'Yes' : 'No'}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Farm Dweller</Text>
            <Text style={styles.detailValue}>{farmerData.dweller ? 'Yes' : 'No'}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Disability</Text>
            <Text style={styles.detailValue}>{farmerData.disability ? 'Yes' : 'No'}</Text>
          </View>

          {farmerData.disability && farmerData.disabilityDescription && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Disability Description</Text>
              <Text style={styles.detailValue}>{farmerData.disabilityDescription}</Text>
            </View>
          )}
        </View>

        <View style={[globalStyles.card, styles.section]}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Registration Date</Text>
            <Text style={styles.detailValue}>{formatDate(farmerData.creationTime)}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Last Updated</Text>
            <Text style={styles.detailValue}>{formatDate(farmerData.lastModificationTime)}</Text>
          </View>
        </View>

        <View style={styles.actions}>

          
          <TouchableOpacity style={[globalStyles.button, styles.logoutButton]} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  farmerId: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: COLORS.error,
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
  },
  detailLabel: {
    fontSize: 14,
    color: COLORS.textLight,
    flex: 1,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: COLORS.text,
    flex: 1,
    textAlign: 'right',
    fontWeight: '400',
  },
  actions: {
    gap: 12,
    marginBottom: 40,
  },
  logoutButton: {
    backgroundColor: COLORS.error,
  },
  logoutButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});