import axios from 'axios';
 
const OLLAMA_URL = 'http://146.148.54.192:11434/api/generate';

const ORDER_API_URL = 'https://YOUR_ORDER_API/api/v1/order';
 
let lastOrderNumber = null;
 
export async function handleChatMessage(userMessage) {

  console.log('User message:', userMessage);

  let systemPrompt = `

You are a Smart Voucher delivery assistant.

You ONLY help users with their orders and deliveries.

If no order number is available, ask politely for it.

If order details are provided, use them to answer.

User message: ${userMessage}

`;
 
  // Call Ollama model

  const aiResponse = await axios.post(OLLAMA_URL, {

    model: "gemma3:4b",

    prompt: systemPrompt,

    stream: false

  });

  console.log('AI response:', aiResponse.data.response);
 
  return aiResponse.data.response;

}

 