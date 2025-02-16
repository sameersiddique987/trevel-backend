const axios = require('axios');

const fetchAviationStackData = async () => {
  try {
    const response = await axios.get('https://api.aviationstack.com/v1/flights', {
      params: {
        access_key: '0d864873390e3b105267e8b1623ad5ef', // Replace with your AviationStack API key
        limit: 100,
      },
    });

    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching data from AviationStack:', error);
    throw error;
  }
};

module.exports = { fetchAviationStackData };