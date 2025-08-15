import axios from 'axios';
 
const OLLAMA_URL = 'http://146.148.54.192:11434/api/generate';

const ORDER_API_URL = 'https://YOUR_ORDER_API/api/v1/order';
 
let lastOrderNumber = null;
 
export async function handleApplication(payload) {

  let systemPrompt = `
You are a PESI eligibility checker.  
 
You must decide:
 
- "ACCEPT" → Meets ALL minimum requirements AND has a score of eleven points or more.  
- "REJECT" → Fails ANY minimum requirement OR has a score below eleven points.
 
---
 
### STEP 1 — MINIMUM REQUIREMENTS (ALL must be true):
1. Applicant age must be eighteen years or older.
2. Applicant nationality must be "South African".
3. Applicant must have a valid ID (hasValidId = true).
4. Applicant must be active in agriculture (activeInAgriculture = true).
5. Applicant must NOT be a government employee (isGovernmentEmployee = false).
6. Applicant must NOT have DALRRD funding (hasDALRRDFunding = false).
7. Production limits must be met:
   - hectares of vegetables must be one hectare or fewer
   - hectares of maize must be one hectare or fewer
   - number of poultry broilers must be one hundred or fewer OR number of poultry layers must be fifty or fewer
   - number of small stock must be twenty-five or fewer OR number of large stock must be five or fewer
8. Household must NOT already have an application (householdHasApplication = false)
 
If any minimum requirement fails → decision = "REJECT" and list all reasons.
 
---
 
### STEP 2 — SCORING SYSTEM:
- Gender: Female = 5 points, Male = 3 points
- Age: 18–35 years = 5 points, 36 years or older = 3 points
- Disability: Yes = 5 points, No = 3 points
- Military Veteran: Yes = +2 points, No = 0 points
- Child-headed Household: Yes = +2 points, No = 0 points
 
Score = sum of these points.  
If score is below eleven points → decision = "REJECT" and include reason "Score below 11 points".
 
---
 
### STEP 3 — FRAUD DETECTION:
Set status = "FLAGGED" if any of the following apply, otherwise status = "CLEAR":
 
1. Household already has an application (householdHasApplication = true). Include reason "Household already has an application".
2. Unrealistic production numbers: any negative values or excessively high values (vegetables > 100 ha, maize > 100 ha, poultry > 10,000, smallStock > 1,000, largeStock > 1,000). Include reason "Unrealistic production numbers".
3. Age mismatch with date of birth. Include reason "Age does not match date of birth".
4. Invalid ID number format: The South African ID must:  
   - Be exactly 13 digits long.  
   - Contain only numeric characters.  
   - Have a valid date in the first six digits (YYMMDD).  
   - Optionally, the 11th digit should be 0 or 1 (citizenship).  
   - Optionally, the last digit should pass the Luhn checksum.  
Include reason "Invalid ID number format" if any of these fail.
5. Child-headed household inconsistent with age: if childHeadedHousehold = true and age is 18 or older. Include reason "Child-headed household inconsistent with age".
6. ID number (idNumber) mismatch with date of birth (dob): Take the first six digits of the idNumber (YYMMDD) and compare them to the applicant's date of birth (dob). For example, if dob is "1985-06-06", the expected value is "850606". If the first six digits do not match, set status = "FLAGGED" and include reason "ID number does not match date of birth".
 
Include the reason for any flagged condition in the reasons array.
 
---
 
### OUTPUT RULES:
You must return ONLY valid JSON. 
No explanations, no extra text, no markdown formatting, no code fences.
The JSON must be in the following exact format:

{
  "decision": "ACCEPT" | "REJECT",
  "reasons": ["reason1", "reason2"],
  "score": number,
  "status": "CLEAR" | "FLAGGED"
}

- decision → eligibility based on minimum requirements and score.  
- reasons → all failed minimum requirements OR score reason OR fraud reasons, only provide two main reasons. 
- score → numeric value calculated from the scoring system.  
- status → "FLAGGED" if any fraud condition applies, otherwise "CLEAR".  
 
---
 
Here is the applicant data: ${payload}

`;
 
  // Call Ollama model

  const aiResponse = await axios.post(OLLAMA_URL, {

    model: "gemma3:4b",

    prompt: systemPrompt,

    stream: false

  });
 
  return aiResponse.data.response;

}

 