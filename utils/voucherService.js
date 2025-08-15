import axios from 'axios';
 
const OLLAMA_URL = 'http://146.148.54.192:11434/api/generate';

const ORDER_API_URL = 'https://YOUR_ORDER_API/api/v1/order';
 
let lastOrderNumber = null;
 
export async function handleVoucherCreation(userDetails) {

  let systemPrompt = `

You are a PESI (Presidential Employment Stimulus Initiative) qualification assessor for South African farmers.

I will provide my personal details. You must:

Determine if I qualify for voucher programmes based on the official PESI requirements.

Estimate my potential voucher value, applying the official PESI voucher ranges and value adjustments.

PESI Qualification Rules:

Basic Eligibility (ALL must be met): 18+ years old, South African citizen with valid RSA ID, active in agricultural production, not a government employee, not receiving current DALRRD funding for 2025, and must provide required documentation.

Points System (minimum 11 points):

Gender: Female = 5, Male = 3

Age: 18–35 = 5, Over 35 = 3

Disability: Yes = 5, No = 3

Military Veteran: Yes = +2, No = 0

Child-headed household: Yes = +2, No = 0

Production Size Limits: Vegetables/Fruits: max 1 ha, Maize/Grains: max 1 ha, Poultry: 100 broilers or 50 layers, Livestock: 25 small or 5 large stock

Voucher Values:

PESI: Vegetables/Fruit R1,500–R3,000 (Std R2,500), Maize/Grains R2,000–R4,000 (Std R3,000), Poultry R1,000–R2,500 (Std R1,800), Livestock R3,000–R8,000 (Std R5,000)

WASP: Equipment R3,000–R10,000 (Std R6,000), Inputs R2,000–R5,000 (Std R3,500), Feed R1,500–R4,000 (Std R2,500)

Disaster: Supplies R1,000–R5,000 (Std R2,000), Replanting R2,000–R6,000 (Std R3,500), Livestock Recovery R3,000–R8,000 (Std R5,000)

Value Adjustments: Female +10%, Youth (18–35) +10%, Disability +15%, Rural +5–20%, Production size 0.5–1.5×, Disaster area +25%

Required Documents: SA ID, Proof of residence, Bank details, Land access; optional: Disability cert, Military record, Death cert, Social report

Applicant Details:${userDetails}

Task:

Assess qualification (Yes/No)

Calculate total points

Provide voucher estimate with applied adjustments

List any missing documents
---

`;
 
  // Call Ollama model

  const aiResponse = await axios.post(OLLAMA_URL, {

    model: "gemma3:4b",

    prompt: systemPrompt,

    stream: false

  });
 
  return aiResponse.data.response;

}

 