# OpenAI Integration for Lemon AI

This module provides OpenAI API integration for the Lemon AI project.

## Features

- ✅ Configuration management via environment variables or config file
- ✅ Chat completion with streaming support
- ✅ Error handling and validation
- ✅ TypeScript support
- ✅ Compatible with OpenAI API specification

## Configuration

### Method 1: Environment Variables
```bash
# Copy .env.example to .env and update the values
cp .env.example .env

# Set your OpenAI API configuration
OPENAI_API_KEY=your_api_key_here
OPENAI_BASE_URL=https://www.genspark.ai/api/llm_proxy/v1
OPENAI_MODEL=gpt-5
OPENAI_MAX_TOKENS=4000
OPENAI_TEMPERATURE=0.7
OPENAI_TIMEOUT=30000
```

### Method 2: Configuration File
Create `~/.genspark_llm.yaml`:
```yaml
openai:
  api_key: your_api_key_here
  base_url: https://www.genspark.ai/api/llm_proxy/v1
```

### Method 3: GenSpark LLM Configuration
The service automatically loads configuration from `~/.genspark_llm.yaml` if available.

## Usage

### Basic Chat Completion
```javascript
const { OpenAIService } = require('./src/services/openai');

const openai = new OpenAIService();

const messages = [
  { role: 'system', content: 'You are a helpful assistant.' },
  { role: 'user', content: 'Hello!' }
];

const response = await openai.createChatCompletion(messages);
console.log(response.choices[0].message.content);
```

### Streaming Response
```javascript
const stream = await openai.createStreamingChatCompletion(messages);

for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content || '';
  process.stdout.write(content);
}
```

### Simple Text Generation
```javascript
const response = await openai.generateResponse(
  'Write a haiku about coding',
  'You are a creative poet.'
);
console.log(response);
```

## Testing

Run configuration test:
```bash
node test/openai-config.test.js
```

Run integration test (requires API access):
```bash
node test/openai.test.js
```

## API Reference

### OpenAIService

#### `createChatCompletion(messages, options)`
Create a chat completion with the given messages.

**Parameters:**
- `messages` (Array): Array of message objects with `role` and `content`
- `options` (Object): Optional parameters
  - `model` (string): Model to use (default: gpt-5)
  - `maxTokens` (number): Maximum tokens (default: 4000)
  - `temperature` (number): Temperature (default: 0.7)
  - `stream` (boolean): Enable streaming (default: false)

#### `createStreamingChatCompletion(messages, options)`
Create a streaming chat completion.

#### `generateResponse(prompt, systemPrompt, options)`
Generate a simple text response.

#### `generateStreamingResponse(prompt, systemPrompt, onChunk, options)`
Generate a streaming text response.

#### `listModels()`
List available models from the API.

#### `isAvailable()`
Check if the service is available.

#### `getConfig()`
Get current configuration (API key is masked).

## Error Handling

The service includes comprehensive error handling:

- Configuration validation
- API error handling with detailed messages
- Network timeout handling
- Authentication error detection

## Security

- API keys are never logged or exposed
- Configuration validation prevents common security issues
- Environment variables are preferred over hardcoded values

## Notes

- The current implementation uses a proxy endpoint that may have Cloudflare protection
- For production use, ensure proper API authentication
- Consider implementing retry logic for transient failures
- Monitor API usage and implement rate limiting as needed