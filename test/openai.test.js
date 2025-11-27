const { OpenAIService, OpenAIConfig } = require('../src/services/openai');

async function testOpenAIIntegration() {
  console.log('🧪 Testing OpenAI Integration...');
  
  try {
    // Test configuration loading
    console.log('📋 Loading configuration...');
    const config = new OpenAIConfig();
    console.log('✅ Configuration loaded:', config.getAll());
    
    // Test service initialization
    console.log('🔧 Initializing OpenAI Service...');
    const openaiService = new OpenAIService();
    console.log('✅ OpenAI Service initialized');
    
    // Test basic chat completion
    console.log('💬 Testing chat completion...');
    const messages = [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: 'Hello! Can you introduce yourself briefly?' }
    ];
    
    const completion = await openaiService.createChatCompletion(messages, {
      maxTokens: 100,
      temperature: 0.7
    });
    
    console.log('✅ Chat completion response:', completion.choices[0]?.message?.content);
    
    // Test streaming
    console.log('🌊 Testing streaming completion...');
    let streamResponse = '';
    await openaiService.generateStreamingResponse(
      'Tell me a very short joke.',
      'You are a helpful assistant.',
      (chunk, fullResponse) => {
        process.stdout.write(chunk);
        streamResponse = fullResponse;
      },
      { maxTokens: 50 }
    );
    console.log('\n✅ Streaming completed:', streamResponse);
    
    console.log('🎉 All OpenAI integration tests passed!');
    
  } catch (error) {
    console.error('❌ OpenAI integration test failed:', error.message);
    if (error.message.includes('API key')) {
      console.log('💡 Please ensure OPENAI_API_KEY and OPENAI_BASE_URL are properly configured');
      console.log('💡 Check ~/.genspark_llm.yaml or environment variables');
    }
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testOpenAIIntegration();
}

module.exports = { testOpenAIIntegration };