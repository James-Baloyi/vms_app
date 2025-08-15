import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, StyleSheet, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { globalStyles, COLORS } from '../styles/globalStyles';
import { useApp } from '../context/AppContext';
import { apiClient } from '../utils/api';
import { storage } from '../utils/storage';

export default function DocumentationScreen({ navigation }) {
  const { state, dispatch } = useApp();
  const [documents, setDocuments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const requiredDocs = [
    { id: 'id_copy', name: 'ID Copy', required: true },
    { id: 'proof_of_farming', name: 'Proof of Farming Activity', required: true },
    { id: 'land_documents', name: 'Land Use Documents', required: false },
    { id: 'bank_details', name: 'Banking Details', required: true }
  ];

  const handleDocumentUpload = async (docId) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        
        const document = {
          id: docId,
          name: file.name,
          size: `${(file.size / 1024 / 1024).toFixed(1)}MB`,
          uri: file.uri,
          type: file.mimeType,
          uploaded: true
        };
        
        setDocuments(prev => {
          const filtered = prev.filter(doc => doc.id !== docId);
          return [...filtered, document];
        });
      }
    } catch (error) {
      Alert.alert('Upload Error', 'Failed to upload document. Please try again.');
      console.error('Document upload error:', error);
    }
  };

  const removeDocument = (docId) => {
    setDocuments(prev => prev.filter(doc => doc.id !== docId));
  };

  const getUploadedDoc = (docId) => {
    return documents.find(doc => doc.id === docId);
  };

  const canSubmit = () => {
    const requiredDocIds = requiredDocs
      .filter(doc => doc.required)
      .map(doc => doc.id);
    
    return requiredDocIds.every(docId => 
      documents.some(doc => doc.id === docId && doc.uploaded)
    );
  };

  const handleSubmit = async () => {
    if (!canSubmit()) {
      Alert.alert('Missing Documents', 'Please upload all required documents');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Prepare farmer data according to Swagger schema
      const farmerData = {
        firstName: state.registrationData.firstName,
        lastName: state.registrationData.lastName,
        identityNumber: state.registrationData.identityNumber,
        gender: state.registrationData.gender,
        mobileNumber1: state.registrationData.mobileNumber1,
        emailAddress1: state.registrationData.emailAddress1,
        disability: state.registrationData.disability,
        disabilityDescription: state.registrationData.disabilityDescription || null,
        veteran: state.registrationData.veteran,
        governmentEmployee: state.registrationData.governmentEmployee,
        dweller: state.registrationData.dweller,
        // Add any other fields from the registration flow
        commodity: state.registrationData.commodity,
        farmSize: state.registrationData.farmSize,
        productionSize: state.registrationData.productionSize,
        selectedPrograms: state.registrationData.selectedPrograms
      };

      // REAL API CALL
      const response = await apiClient.createFarmer(farmerData);

      if (response.success) {
        // Generate token based on farmer ID
        const token = `farmer-${response.result.id}-${Date.now()}`;

        apiClient.createApplication(response.result.id, state.registrationData.category).then(res => console.log("post app",res))
        
        // Store farmer data and token
        await storage.setFarmerToken(token);
        await storage.setFarmerData(response.result);
        
        // Update context
        dispatch({ type: 'SET_FARMER', payload: response.result });
        
        Alert.alert(
          'Registration Successful!', 
          'Welcome to the Farmer Portal. You can now access your dashboard.',
          [{ text: 'Continue', onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Main' }],
            });
          }}]
        );
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      Alert.alert(
        'Registration Failed', 
        error.message || 'Please check your connection and try again'
      );
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView style={globalStyles.screenPadding}>
        <View style={styles.header}>
          <Text style={globalStyles.title}>Upload Documentation</Text>
          <Text style={globalStyles.subtitle}>Upload required documents to complete registration</Text>
        </View>

        <View style={styles.documentsSection}>
          {requiredDocs.map((doc) => {
            const uploadedDoc = getUploadedDoc(doc.id);
            
            return (
              <View key={doc.id} style={[globalStyles.card, styles.docCard]}>
                <View style={styles.docHeader}>
                  <Text style={styles.docName}>{doc.name}</Text>
                  {doc.required && <Text style={styles.requiredLabel}>Required</Text>}
                </View>
                
                {uploadedDoc ? (
                  <View style={styles.uploadedDoc}>
                    <Text style={styles.fileName}>{uploadedDoc.name}</Text>
                    <Text style={styles.fileSize}>{uploadedDoc.size}</Text>
                    <TouchableOpacity 
                      style={styles.removeButton}
                      onPress={() => removeDocument(doc.id)}
                    >
                      <Text style={styles.removeText}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity 
                    style={[globalStyles.button, globalStyles.buttonSecondary]}
                    onPress={() => handleDocumentUpload(doc.id)}
                  >
                    <Text style={globalStyles.buttonSecondaryText}>Upload Document</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity 
            style={[globalStyles.button, globalStyles.buttonSecondary]}
            onPress={() => navigation.goBack()}
          >
            <Text style={globalStyles.buttonSecondaryText}>Back</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              globalStyles.button,
              (!canSubmit() || isSubmitting) && styles.disabledButton
            ]}
            onPress={handleSubmit}
            disabled={!canSubmit() || isSubmitting}
          >
            <Text style={globalStyles.buttonText}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Text>
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
  documentsSection: {
    marginBottom: 40,
  },
  docCard: {
    marginBottom: 16,
  },
  docHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  docName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  requiredLabel: {
    fontSize: 12,
    color: COLORS.error,
    fontWeight: '600',
  },
  uploadedDoc: {
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fileName: {
    fontSize: 14,
    color: COLORS.text,
    flex: 1,
  },
  fileSize: {
    fontSize: 12,
    color: COLORS.textLight,
    marginRight: 12,
  },
  removeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  removeText: {
    color: COLORS.error,
    fontSize: 12,
    fontWeight: '600',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  disabledButton: {
    opacity: 0.5,
  },
});
