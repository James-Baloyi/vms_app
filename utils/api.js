const API_BASE_URL = 'https://vms-api-vms.shesha.app';
const BEARER_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiYWRtaW4iLCJBc3BOZXQuSWRlbnRpdHkuU2VjdXJpdHlTdGFtcCI6Ik9BQzJJVlpPN05PWEFVV0c2WlpDNkNCVVBVWVhGV1ZEIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiQWRtaW4iLCJzdWIiOiIxIiwianRpIjoiMmIyMDQ1ODMtYjdjNC00OTcyLThjY2EtYjA5NmFiNDkyNDMxIiwiaWF0IjoxNzU1MTk4MDAzLCJuYmYiOjE3NTUxOTgwMDMsImV4cCI6MTc1NTYzMDAwMywiaXNzIjoiU2hlc2hhIiwiYXVkIjoiU2hlc2hhIn0.J6UdJgwaWopVuKRftofMHvZpZnOW49iv2KqKPiEjRgI';
export const apiClient = {

  async getCategories() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/dynamic/sheshapromaxx.vms/Category/Crud/GetAll`, {
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
      console.error('API Error - getSix:', error);
      throw error;
    }
  },

  async createApplication(farmerId, category) {
    console.log("CREATE APP",farmerId, category)
    try {

      const applicationPayload = {
        farmer: farmerId,
        program: "1cb226c2-2d8d-4af7-9a74-adafc5ad7d15",
        status: 0,
        isFraud: false,
        startDate: new Date().toISOString(),
        storedFile: '',
      };

      const response = await fetch(`${API_BASE_URL}/api/dynamic/sheshapromaxx.vms/Application/Crud/Create`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json-patch+json',
          'Authorization': `Bearer ${BEARER_TOKEN}`
        },
        body: JSON.stringify(applicationPayload),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error?.message || `HTTP ${response.status}: Application failed`);
      }
      
      return result;
    } catch (error) {
      console.error('API Error - createApplication:', error);
      throw error;
    }
  },

  async createFarmer(registrationData) {
    try {
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
        
        disability: registrationData.disability || false,
        disabilityDescription: registrationData.disabilityDescription || '',
        veteran: registrationData.veteran || false,
        governmentEmployee: registrationData.governmentEmployee || false,
        dweller: registrationData.dweller || false,
        
        farmInformation: registrationData.farmInformation || '',
        address: registrationData.address || '',
        workAddress: registrationData.workAddress || '',
        primarySite: registrationData.primarySite || '',
        primaryAccount: registrationData.primaryAccount || '',
        primaryOrganisation: registrationData.primaryOrganisation || '',
        
        title: registrationData.title || 0,
        type: registrationData.type || 0,
        targetingFlag: registrationData.targetingFlag || 0,
        preferredContactMethod: registrationData.preferredContactMethod || 0,
        customShortName: registrationData.customShortName || '',
        photo: registrationData.photo || '',
        user: registrationData.user || 1,
        
        
        _className: 'Farmer',
        _formFields: registrationData._formFields || [],
        preferredLanguages: registrationData.preferredLanguages || []
      };
      
      // console.log('Sending farmer data to API:', JSON.stringify(farmerPayload, null, 2));

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
    
      //console.log('API Response:', result);
      
      if (!response.ok) {
        throw new Error(result.error?.message || `HTTP ${response.status}: Registration failed`);
      }
      
      return result;
    } catch (error) {
      console.error('API Error - createFarmer:', error);
      
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
      console.log("API RESULT::",result)
      
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

  async getVouchers(farmerId) {
    console.log(farmerId)
    try {

      const response = await fetch(`${API_BASE_URL}/api/dynamic/sheshapromaxx.vms/Voucher/Crud/GetAll`, {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${BEARER_TOKEN}`
        }
      });
      if (!response.ok) {
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
      const response = await fetch(`${API_BASE_URL}/api/dynamic/sheshapromaxx.vms/Order/Crud/GetAll?filter=farmerId eq ${farmerId}`, {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${BEARER_TOKEN}`
        }
      });
      
      if (!response.ok) {
        console.log('Order API not available, returning empty array');
        return { success: true, result: { items: [], totalCount: 0 } };
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.log('Order API error, returning empty array:', error.message);
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