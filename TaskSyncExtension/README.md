# TaskSync VS Code Extension

## Features

- **Chat Interface**: Clean, modern chat UI for task submission and management
- **File References**: Attach files and folders to your tasks for context
- **AI Integration**: Built-in Copilot integration with custom prompts
- **Task Categories**: Organize tasks by type (Task, Bug, Feature, Research, etc.)
- **Real-time Updates**: Live chat updates as tasks are processed
- **Log Management**: Automatic logging of all interactions

## Installation

### Install from VS Code Marketplace (Recommended)

[![Install TaskSync Extension](https://img.shields.io/badge/VS_Code-Install_TaskSync-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://marketplace.visualstudio.com/items?itemName=4regab.tasksync-chat)

1. **One-Click Install**: Click the button above to go directly to the marketplace
2. **Manual Search**:
   - Open VS Code
   - Go to Extensions (Ctrl+Shift+X)
   - Search for "TaskSync Chat"
   - Click Install on the extension by 4regab
3. **Command Line**: `code --install-extension 4regab.tasksync-chat`

### Development Installation

1. Clone this repository
2. Open in VS Code
3. Run `npm install` to install dependencies
4. Press `F5` to launch the extension in a new Extension Development Host window

## Usage

### How to Use TaskSync Extension

1. **Open TaskSync Panel**: Click the TaskSync icon in VS Code sidebar
2. **Write Your Task**: Type your task or request in the input field
3. **Click Copilot Button 🤖**: Only needed for first initialization or when chat with agent has ended
4. **Continue Working**: After initialization, just write tasks and send normally

**Simple Workflow**: Write Task → Click Copilot Button (first time/when chat ended) → Task Sent to TaskSync Chat

### What Happens Next

- Your task is sent to the TaskSync chat system
- The extension creates and manages `tasks.md` and `log.md` files automatically
- You can monitor progress through the TaskSync interface
- All task communication flows through the extension's chat system

### Additional Features

- **File References**: Attach files using the paperclip icon for context
- **Task Categories**: Select task type from dropdown (Task, Bug, Feature, Research, etc.)
- **Send Options**: Click send button or press Enter to submit
- **Real-time Chat**: View conversation history and responses

### Extension Features

**Real-time Chat Interface**:

- Send tasks directly through the extension panel
- View conversation history and responses
- File attachment support for context
- Task categorization (Task, Bug, Feature, Research, etc.)

**Automatic File Management**:

- Creates and maintains `tasks.md` and `log.md` files
- Real-time synchronization with chat interface
- Persistent task history and logging

**Available Commands**:

- `tasksync:start` - Begin monitoring tasks.md
- `tasksync:stop` - Stop monitoring
- `tasksync:status` - Check current monitoring status
- `tasksync:refresh` - Force refresh the task list

## Development

### Building

```bash
npm run compile
```

### Packaging

```bash
vsce package
```

## File Structure

- `src/extension.ts` - Main extension logic
- `src/webview.js` - Chat interface implementation
- `src/copilot-prompt.ts` - AI agent prompt configuration
- `package.json` - Extension manifest

## Requirements

- VS Code 1.74.0 or higher
- Node.js for development

## License

MIT
