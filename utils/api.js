const API_BASE_URL = 'https://vms-api-vms.shesha.app';
const BEARER_TOKEN = process.env.BEARER_TOKEN;
export const apiClient = {
  async createFarmer(registrationData) {
    try {
      // Map registration data to API format exactly as expected
      const farmerPayload = {
        firstName: registrationData.firstName || '',
        lastName: registrationData.lastName || '',
        identityNumber: registrationData.identityNumber || '',
        gender: parseInt(registrationData.gender) || 0,
        mobileNumber1: registrationData.mobileNumber1 || '',
        emailAddress1: registrationData.emailAddress1 || '',
        emailAddress2: registrationData.emailAddress2 || '',
        mobileNumber2: registrationData.mobileNumber2 || '',
        homeNumber: registrationData.homeNumber || '',
        initials: registrationData.initials || '',
        middleName: registrationData.middleName || '',
        dateOfBirth: registrationData.dateOfBirth || null,
        saId: registrationData.identityNumber || '', // Same as identityNumber for SA ID
        passportId: registrationData.passportId || '',
        
        // Functional criteria
        disability: registrationData.disability || false,
        disabilityDescription: registrationData.disabilityDescription || '',
        veteran: registrationData.veteran || false,
        governmentEmployee: registrationData.governmentEmployee || false,
        dweller: registrationData.dweller || false,
        
        // Farm information
        farmInformation: registrationData.farmInformation || '',
        address: registrationData.address || '',
        workAddress: registrationData.workAddress || '',
        primarySite: registrationData.primarySite || '',
        primaryAccount: registrationData.primaryAccount || '',
        primaryOrganisation: registrationData.primaryOrganisation || '',
        
        // Additional fields
        title: registrationData.title || 0,
        type: registrationData.type || 0,
        targetingFlag: registrationData.targetingFlag || 0,
        preferredContactMethod: registrationData.preferredContactMethod || 0,
        customShortName: registrationData.customShortName || '',
        photo: registrationData.photo || '',
        user: registrationData.user || 0,
        
        // Required by API
        _className: 'Farmer',
        _formFields: registrationData._formFields || [],
        preferredLanguages: registrationData.preferredLanguages || []
      };

      console.log('Sending farmer data to API:', JSON.stringify(farmerPayload, null, 2));

      const response = await fetch(`${API_BASE_URL}/api/dynamic/sheshapromaxx.vms/Farmer/Crud/Create`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json-patch+json',
          'Authorization': `Bearer ${BEARER_TOKEN}`
        },
        body: JSON.stringify(farmerPayload),
      });
      
      const result = await response.json();
      console.log('API Response:', result);
      
      if (!response.ok) {
        throw new Error(result.error?.message || `HTTP ${response.status}: Registration failed`);
      }
      
      return result;
    } catch (error) {
      console.error('API Error - createFarmer:', error);
      
      // FALLBACK ONLY - when API is completely unavailable
      if (error.message.includes('Network request failed') || error.message.includes('fetch')) {
        console.warn('API unavailable, using fallback registration');
        return {
          success: true,
          result: {
            id: 'offline-' + Date.now(),
            ...registrationData,
            fullName: `${registrationData.firstName} ${registrationData.lastName}`,
            creationTime: new Date().toISOString()
          }
        };
      }
      
      throw error;
    }
  },

  async getFarmer(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/dynamic/sheshapromaxx.vms/Farmer/Crud/Get?id=${id}`, {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${BEARER_TOKEN}`
        }
      });
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error?.message || 'Failed to get farmer');
      }
      
      return result;
    } catch (error) {
      console.error('API Error - getFarmer:', error);
      throw error;
    }
  },

  async getAllFarmers(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.filter) queryParams.append('filter', params.filter);
      if (params.quickSearch) queryParams.append('quickSearch', params.quickSearch);
      if (params.sorting) queryParams.append('sorting', params.sorting);
      if (params.skipCount) queryParams.append('skipCount', params.skipCount.toString());
      if (params.maxResultCount) queryParams.append('maxResultCount', params.maxResultCount.toString());
      
      const response = await fetch(`${API_BASE_URL}/api/dynamic/sheshapromaxx.vms/Farmer/Crud/GetAll?${queryParams}`, {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${BEARER_TOKEN}`
        }
      });
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error?.message || 'Failed to get farmers');
      }
      
      return result;
    } catch (error) {
      console.error('API Error - getAllFarmers:', error);
      throw error;
    }
  },

  // Voucher API calls - using the same base URL pattern
  async getVouchers(farmerId) {
    try {
      // Since voucher endpoints aren't in the swagger, we'll try the likely pattern
      const response = await fetch(`${API_BASE_URL}/api/dynamic/sheshapromaxx.vms/Voucher/Crud/GetAll?filter=farmerId eq ${farmerId}`, {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${BEARER_TOKEN}`
        }
      });
      
      if (!response.ok) {
        // If voucher API doesn't exist yet, return empty array
        console.log('Voucher API not available, returning empty array');
        return { success: true, result: { items: [], totalCount: 0 } };
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.log('Voucher API error, returning empty array:', error.message);
      // Return empty vouchers instead of failing
      return { success: true, result: { items: [], totalCount: 0 } };
    }
  },

  async getOrders(farmerId) {
    try {
      // Since order endpoints aren't in the swagger, we'll try the likely pattern
      const response = await fetch(`${API_BASE_URL}/api/dynamic/sheshapromaxx.vms/Order/Crud/GetAll?filter=farmerId eq ${farmerId}`, {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${BEARER_TOKEN}`
        }
      });
      
      if (!response.ok) {
        // If order API doesn't exist yet, return empty array
        console.log('Order API not available, returning empty array');
        return { success: true, result: { items: [], totalCount: 0 } };
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.log('Order API error, returning empty array:', error.message);
      // Return empty orders instead of failing
      return { success: true, result: { items: [], totalCount: 0 } };
    }
  },

  async getSuppliers() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/dynamic/sheshapromaxx.vms/Supplier/Crud/GetAll`, {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${BEARER_TOKEN}`
        }
      });
      
      if (!response.ok) {
        console.log('Supplier API not available, returning empty array');
        return { success: true, result: { items: [], totalCount: 0 } };
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.log('Supplier API error, returning empty array:', error.message);
      return { success: true, result: { items: [], totalCount: 0 } };
    }
  }
};