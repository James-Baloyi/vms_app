// screens/FarmInfoScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, StyleSheet, Switch } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { globalStyles, COLORS } from '../styles/globalStyles';
import { useApp } from '../context/AppContext';

export default function FarmInfoScreen({ navigation }) {
  const { state, dispatch } = useApp();
  const [formData, setFormData] = useState({
    farmSize: '',
    commodity: '',
    productionSize: '',
    disability: false,
    disabilityDescription: '',
    veteran: false,
    governmentEmployee: false,
    dweller: false,
    ...state.registrationData
  });

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const commodityOptions = [
    { label: 'Please Select', value: '' },
    { label: 'Vegetables and Fruits', value: 'vegetables_fruits' },
    { label: 'Maize/Soya/Cotton/Sugar/Grain Products/Other', value: 'grains' },
    { label: 'Poultry', value: 'poultry' },
    { label: 'Livestock', value: 'livestock' }
  ];

  const handleNext = () => {
    dispatch({ type: 'UPDATE_REGISTRATION', payload: formData });
    navigation.navigate('ProgramSelection');
  };

  const canProceed = () => {
    return formData.farmSize && formData.commodity && formData.productionSize;
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView style={globalStyles.screenPadding}>
        <View style={styles.header}>
          <Text style={globalStyles.title}>Farm Information</Text>
          <Text style={globalStyles.subtitle}>Tell us about your farming operation</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.sectionTitle}>Farm Information</Text>
          
          <Text style={globalStyles.label}>Farm Size (hectares)</Text>
          <TextInput
            style={globalStyles.input}
            value={formData.farmSize}
            onChangeText={(value) => updateField('farmSize', value)}
            placeholder="Enter farm size"
            keyboardType="numeric"
          />

          <Text style={globalStyles.label}>Commodity</Text>
          <View style={[globalStyles.input, { padding: 0 }]}>
            <Picker
              selectedValue={formData.commodity}
              onValueChange={(value) => updateField('commodity', value)}
            >
              {commodityOptions.map(option => (
                <Picker.Item key={option.value} label={option.label} value={option.value} />
              ))}
            </Picker>
          </View>
          
          <Text style={styles.helperText}>
            Dropdown options are dependent on the Commodities selected
          </Text>

          <Text style={globalStyles.label}>Production Size</Text>
          <TextInput
            style={globalStyles.input}
            value={formData.productionSize}
            onChangeText={(value) => updateField('productionSize', value)}
            placeholder="Enter production size"
            keyboardType="numeric"
          />

          <Text style={styles.sectionTitle}>Functional Criteria</Text>

          <View style={styles.switchRow}>
            <View style={styles.switchContent}>
              <Text style={styles.switchLabel}>Do you have any disabilities?</Text>
              <Text style={styles.switchOptions}>Yes / No</Text>
            </View>
            <Switch
              value={formData.disability}
              onValueChange={(value) => updateField('disability', value)}
              trackColor={{ false: COLORS.border, true: COLORS.secondary }}
              thumbColor={formData.disability ? COLORS.primary : '#f4f3f4'}
            />
          </View>

          {formData.disability && (
            <View style={styles.conditionalField}>
              <Text style={globalStyles.label}>If yes, please specify the type of disability</Text>
              <TextInput
                style={globalStyles.input}
                value={formData.disabilityDescription}
                onChangeText={(value) => updateField('disabilityDescription', value)}
                placeholder="Describe disability"
                multiline
                numberOfLines={3}
              />
            </View>
          )}

          <View style={styles.switchRow}>
            <View style={styles.switchContent}>
              <Text style={styles.switchLabel}>Are you a military veteran?</Text>
              <Text style={styles.switchOptions}>Yes / No</Text>
            </View>
            <Switch
              value={formData.veteran}
              onValueChange={(value) => updateField('veteran', value)}
              trackColor={{ false: COLORS.border, true: COLORS.secondary }}
              thumbColor={formData.veteran ? COLORS.primary : '#f4f3f4'}
            />
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchContent}>
              <Text style={styles.switchLabel}>Are you currently a government employee?</Text>
              <Text style={styles.switchOptions}>Yes / No</Text>
            </View>
            <Switch
              value={formData.governmentEmployee}
              onValueChange={(value) => updateField('governmentEmployee', value)}
              trackColor={{ false: COLORS.border, true: COLORS.secondary }}
              thumbColor={formData.governmentEmployee ? COLORS.primary : '#f4f3f4'}
            />
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchContent}>
              <Text style={styles.switchLabel}>Are you a farm dweller or farm worker?</Text>
              <Text style={styles.switchOptions}>Yes / No</Text>
            </View>
            <Switch
              value={formData.dweller}
              onValueChange={(value) => updateField('dweller', value)}
              trackColor={{ false: COLORS.border, true: COLORS.secondary }}
              thumbColor={formData.dweller ? COLORS.primary : '#f4f3f4'}
            />
          </View>
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity 
            style={[globalStyles.button, globalStyles.buttonSecondary]}
            onPress={() => navigation.goBack()}
          >
            <Text style={globalStyles.buttonSecondaryText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              globalStyles.button,
              !canProceed() && styles.disabledButton
            ]}
            onPress={handleNext}
            disabled={!canProceed()}
          >
            <Text style={globalStyles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 30,
  },
  form: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 24,
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  helperText: {
    fontSize: 12,
    color: COLORS.textLight,
    fontStyle: 'italic',
    marginTop: -4,
    marginBottom: 16,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
  },
  switchContent: {
    flex: 1,
    paddingRight: 16,
  },
  switchLabel: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 4,
  },
  switchOptions: {
    fontSize: 12,
    color: COLORS.textLight,
    fontStyle: 'italic',
  },
  conditionalField: {
    marginVertical: 16,
    paddingLeft: 16,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 40,
  },
  disabledButton: {
    opacity: 0.5,
  },
});