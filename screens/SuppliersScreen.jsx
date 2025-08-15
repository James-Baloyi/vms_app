import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, TextInput, StyleSheet, Linking, Alert } from 'react-native';
import { globalStyles, COLORS } from '../styles/globalStyles';

export default function SuppliersScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Seeds', 'Fertiliser', 'Equipment'];

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      // TODO: Replace with real API call when suppliers endpoint is available
      // const suppliersResponse = await apiClient.getSuppliers();
      
      // For now, return empty array since no real suppliers API yet
      setSuppliers([]);
    } catch (error) {
      console.error('Error loading suppliers:', error);
      setSuppliers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || supplier.categories.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const handleWhatsApp = (phone) => {
    const phoneNumber = phone.replace(/[^0-9]/g, '');
    const url = `whatsapp://send?phone=${phoneNumber}`;
    
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('WhatsApp not available', 'Please install WhatsApp to contact suppliers directly');
      }
    });
  };

  const handleAssignAgent = () => {
    Alert.alert(
      'Assign Implementation Agent',
      'Please note: A service fee is charged on all orders placed with implementation agents. The service fee will be deducted from your voucher.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue', onPress: () => {
          // TODO: Navigate to agent assignment screen
          console.log('Navigate to agent assignment');
        }}
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={globalStyles.container}>
        <View style={[globalStyles.screenPadding, styles.centerContent]}>
          <Text>Loading suppliers...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView style={globalStyles.screenPadding}>
        <View style={styles.header}>
          <Text style={globalStyles.title}>Suppliers</Text>
          <Text style={globalStyles.subtitle}>Find approved suppliers near you</Text>
        </View>

        <TextInput
          style={[globalStyles.input, styles.searchInput]}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search suppliers"
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categories}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.selectedCategory
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory === category && styles.selectedCategoryText
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={[globalStyles.card, styles.agentCard]}>
          <Text style={styles.agentTitle}>Need help with redeeming your vouchers?</Text>
          <Text style={styles.agentDescription}>
            Request an implementation agent to redeem your voucher and deliver products directly to your farm
          </Text>
          <TouchableOpacity style={[globalStyles.button, styles.agentButton]} onPress={handleAssignAgent}>
            <Text style={globalStyles.buttonText}>Assign Implementation Agent</Text>
          </TouchableOpacity>
        </View>

        {suppliers.length === 0 ? (
          <View style={[globalStyles.card, styles.emptyState]}>
            <Text style={styles.emptyTitle}>No Suppliers Available</Text>
            <Text style={styles.emptyDescription}>
              Approved suppliers will be listed here. Check back later or contact support for assistance.
            </Text>
          </View>
        ) : (
          <View style={styles.suppliersList}>
            {filteredSuppliers.map((supplier) => (
              <View key={supplier.id} style={[globalStyles.card, styles.supplierCard]}>
                <Text style={styles.supplierName}>{supplier.name}</Text>
                <Text style={styles.supplierCategories}>{supplier.categories}</Text>
                
                <View style={styles.supplierInfo}>
                  <Text style={styles.infoLabel}>Location</Text>
                  <Text style={styles.infoValue}>{supplier.location}</Text>
                  <Text style={styles.distance}>{supplier.distance}</Text>
                </View>
                
                <View style={styles.supplierInfo}>
                  <Text style={styles.infoLabel}>Contact</Text>
                  <Text style={styles.infoValue}>{supplier.phone}</Text>
                  <Text style={styles.infoValue}>{supplier.email}</Text>
                </View>

                <View style={styles.supplierActions}>
                  <TouchableOpacity 
                    style={[globalStyles.button, globalStyles.buttonSecondary, styles.actionButton]}
                    onPress={() => handleWhatsApp(supplier.phone)}
                  >
                    <Text style={globalStyles.buttonSecondaryText}>WhatsApp</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={[globalStyles.button, styles.actionButton]}>
                    <Text style={globalStyles.buttonText}>Visit Store</Text>
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
  searchInput: {
    marginBottom: 16,
  },
  categories: {
    marginBottom: 20,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  selectedCategory: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryText: {
    fontSize: 14,
    color: COLORS.text,
  },
  selectedCategoryText: {
    color: COLORS.white,
  },
  agentCard: {
    backgroundColor: '#E8F5E8',
    marginBottom: 20,
  },
  agentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  agentDescription: {
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 20,
    marginBottom: 16,
  },
  agentButton: {
    marginVertical: 0,
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
  },
  suppliersList: {
    gap: 16,
  },
  supplierCard: {
    padding: 16,
  },
  supplierName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  supplierCategories: {
    fontSize: 14,
    color: COLORS.primary,
    marginBottom: 16,
  },
  supplierInfo: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textLight,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 2,
  },
  distance: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  supplierActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    marginVertical: 0,
  },
});
