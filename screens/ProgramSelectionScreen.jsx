// screens/ProgramSelectionScreen.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { globalStyles, COLORS } from '../styles/globalStyles';
import { useApp } from '../context/AppContext';

export default function ProgramSelectionScreen({ navigation }) {
  const { state, dispatch } = useApp();
  const [selectedPrograms, setSelectedPrograms] = useState(
    state.registrationData.selectedPrograms || []
  );

  const programs = [
    {
      id: 'pesi',
      title: 'PESI',
      subtitle: 'Presidential Employment Stimulus Initiative',
      description: 'The Presidential Employment Stimulus is aimed at supporting farmers through employment programme and skills development',
      requirements: [
        'Must be a South African citizen with a valid RSA ID',
        'Must be using land for agricultural purposes',
        'Must provide ALL required documentation'
      ],
      color: COLORS.primary
    },
    {
      id: 'wasp',
      title: 'WASP',
      subtitle: 'Winter Agricultural Support Programme',
      description: 'The Winter Agricultural Support Programme provides seasonal assistance during critical farming periods',
      requirements: [
        'Must be actively farming during winter season',
        'Must demonstrate need for seasonal support',
        'Valid agricultural permits required'
      ],
      color: '#2196F3'
    },
    {
      id: 'disaster_relief',
      title: 'Disaster Relief',
      subtitle: 'Emergency Agricultural Support',
      description: 'Emergency support for farmers affected by natural disasters such as drought, floods, and extreme weather',
      requirements: [
        'Must demonstrate impact from natural disaster',
        'Farm assessment may be required',
        'Emergency documentation needed'
      ],
      color: '#FF5722'
    }
  ];

  const toggleProgram = (programId) => {
    setSelectedPrograms(prev => 
      prev.includes(programId) 
        ? prev.filter(id => id !== programId)
        : [...prev, programId]
    );
  };

  const handleNext = () => {
    dispatch({ 
      type: 'UPDATE_REGISTRATION', 
      payload: { selectedPrograms }
    });
    navigation.navigate('Documentation');
  };

  const canProceed = () => {
    return selectedPrograms.length > 0;
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView style={globalStyles.screenPadding}>
        <View style={styles.header}>
          <Text style={globalStyles.title}>Select Programmes</Text>
          <Text style={globalStyles.subtitle}>Choose the programmes you'd like to apply for</Text>
        </View>

        <View style={styles.progressIndicator}>
          <View style={styles.stepContainer}>
            <View style={[styles.step, styles.completedStep]}>
              <Text style={styles.stepNumber}>1</Text>
            </View>
            <Text style={styles.stepLabel}>Farmer Information</Text>
          </View>
          
          <View style={styles.stepContainer}>
            <View style={[styles.step, styles.completedStep]}>
              <Text style={styles.stepNumber}>2</Text>
            </View>
            <Text style={styles.stepLabel}>Farm Information</Text>
          </View>
          
          <View style={styles.stepContainer}>
            <View style={[styles.step, styles.activeStep]}>
              <Text style={styles.stepNumber}>3</Text>
            </View>
            <Text style={styles.stepLabel}>Programme Selection</Text>
          </View>
          
          <View style={styles.stepContainer}>
            <View style={styles.step}>
              <Text style={styles.stepNumber}>4</Text>
            </View>
            <Text style={styles.stepLabel}>Documentation</Text>
          </View>
        </View>

        <View style={styles.programs}>
          {programs.map((program) => (
            <TouchableOpacity
              key={program.id}
              style={[
                globalStyles.card,
                styles.programCard,
                selectedPrograms.includes(program.id) && styles.selectedCard
              ]}
              onPress={() => toggleProgram(program.id)}
              activeOpacity={0.8}
            >
              <View style={styles.programHeader}>
                <View style={styles.programTitleContainer}>
                  <Text style={[styles.programTitle, { color: program.color }]}>
                    {program.title}
                  </Text>
                  <Text style={styles.programSubtitle}>{program.subtitle}</Text>
                </View>
                <View style={[
                  styles.checkbox,
                  selectedPrograms.includes(program.id) && styles.checkedBox,
                  { borderColor: program.color }
                ]}>
                  {selectedPrograms.includes(program.id) && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </View>
              </View>
              
              <Text style={styles.programDescription}>{program.description}</Text>
              
              <Text style={styles.requirementsTitle}>Eligibility Requirements:</Text>
              <View style={styles.requirementsList}>
                {program.requirements.map((req, index) => (
                  <View key={index} style={styles.requirementItem}>
                    <Text style={[styles.bullet, { color: program.color }]}>•</Text>
                    <Text style={styles.requirement}>{req}</Text>
                  </View>
                ))}
              </View>

              {selectedPrograms.includes(program.id) && (
                <View style={[styles.selectedIndicator, { backgroundColor: program.color }]}>
                  <Text style={styles.selectedText}>Selected</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.selectionSummary}>
          <Text style={styles.summaryTitle}>
            {selectedPrograms.length > 0 
              ? `${selectedPrograms.length} programme${selectedPrograms.length > 1 ? 's' : ''} selected`
              : 'No programmes selected'
            }
          </Text>
          {selectedPrograms.length > 0 && (
            <Text style={styles.summaryDescription}>
              You will receive vouchers for each selected programme based on eligibility and availability.
            </Text>
          )}
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
  progressIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  stepContainer: {
    alignItems: 'center',
    flex: 1,
  },
  step: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  completedStep: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  activeStep: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textLight,
  },
  stepLabel: {
    fontSize: 10,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 12,
  },
  programs: {
    marginBottom: 30,
  },
  programCard: {
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
    overflow: 'hidden',
  },
  selectedCard: {
    borderColor: COLORS.primary,
    backgroundColor: '#F8FFF8',
  },
  programHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  programTitleContainer: {
    flex: 1,
    paddingRight: 16,
  },
  programTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  programSubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    fontStyle: 'italic',
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  checkedBox: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkmark: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 18,
  },
  programDescription: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 22,
    marginBottom: 16,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  requirementsList: {
    marginBottom: 16,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bullet: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
    marginTop: 1,
  },
  requirement: {
    fontSize: 12,
    color: COLORS.textLight,
    lineHeight: 18,
    flex: 1,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderBottomLeftRadius: 8,
  },
  selectedText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '600',
  },
  selectionSummary: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 16,
    marginBottom: 30,
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  summaryDescription: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 20,
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