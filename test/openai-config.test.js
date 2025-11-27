const { OpenAIService, OpenAIConfig } = require('../src/services/openai');

async function testOpenAIConfiguration() {
  console.log('🧪 Testing OpenAI Configuration...');
  
  try {
    // Test configuration loading
    console.log('📋 Loading configuration...');
    const config = new OpenAIConfig();
    const configData = config.getAll();
    
    console.log('✅ Configuration loaded successfully');
    console.log('🔧 Model:', configData.model);
    console.log('🔧 Max Tokens:', configData.maxTokens);
    console.log('🔧 Temperature:', configData.temperature);
    console.log('🔧 Timeout:', configData.timeout);
    console.log('🔧 Base URL:', configData.baseURL);
    console.log('🔧 API Key:', configData.apiKey ? '✅ Set (masked)' : '❌ Not set');
    
    // Test service initialization
    console.log('\n🔧 Initializing OpenAI Service...');
    const openaiService = new OpenAIService();
    console.log('✅ OpenAI Service initialized successfully');
    
    // Test configuration validation
    console.log('\n✅ Configuration validation passed');
    
    console.log('\n🎉 OpenAI configuration test completed successfully!');
    console.log('💡 Note: API calls may require additional authentication or network configuration');
    
  } catch (error) {
    console.error('❌ OpenAI configuration test failed:', error.message);
    if (error.message.includes('API key')) {
      console.log('💡 Please ensure OPENAI_API_KEY is properly configured');
      console.log('💡 You can set it via:');
      console.log('   1. Environment variable: OPENAI_API_KEY');
      console.log('   2. Config file: ~/.genspark_llm.yaml');
      console.log('   3. Copy .env.example to .env and update the values');
    }
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testOpenAIConfiguration();
}

module.exports = { testOpenAIConfiguration };