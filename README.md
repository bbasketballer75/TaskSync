<div align="left">
  <img src="https://github.com/4regab/TaskSync/blob/main/TaskSyncExtension/icon.png" alt="TaskSync Logo" width="120" height="120">
  <h1>TaskSync</h1>
</div>

This simple prompt instructions helps you  work more efficiently, reduce premium request usage, and allow you to give the agent new instructions or feedback after completing a task. This is similar to Interactive/Enhanced Feedback MCP. 

## What This Does

TaskSync is a **terminal-based task agent** with direct terminal communication. Your coding agent will actively requests tasks or feedback through `$task = Read-Host "Enter your task"` command, executes tasks autonomously, and operates forever until you stop it.

https://github.com/user-attachments/assets/a4737779-b877-4e12-8990-1a70a7b09dcc

## Features
- **Human-in-the-loop workflow** - Provide feedback or new task, saving you premium requests on your AI IDEs
- **Terminal-based agent interaction** - Your AI becomes a persistent terminal agent that actively requests tasks
- **Autonomous operation** - Agent runs continuously requesting and executing tasks 
- **Never terminates automatically** - maintains persistent operation until you explicitly say "stop", "end", "terminate", or "quit"


## Getting Started
1. **Get the TaskSync Prompt**: Copy or download the prompt from [here](https://github.com/4regab/TaskSync/blob/main/Prompt/tasksync.md).
2. **Initialize Agent**: Provide the TaskSync v4 protocol file (`tasksync.md`) as context to your AI IDE or agent and type in chat: `Strictly follow TaskSync Protocol #tasksync.md` to activate.
4. **Agent Activation**: The agent immediately becomes a terminal-based autonomous agent and announces initialization.
5. **Task Input**: Agent executes `$task = Read-Host "Enter your task"` and waits for your input.
6. **Continuous Operation**: Agent requests tasks indefinitely until you say "stop", "end", "terminate", or "quit".

**Note:** Task must be entered as a single line. You can paste your task into the search bar, or into a new empty file and use "Join Lines" from the Command Palette to combine multiple lines.

### Alternative Option

<summary><strong>TaskSync VS Code Extension</strong></summary>

This version is using Version 3 that uses tasks.md for task input and log.md for updates.
For VS Code users who prefer an integrated extension experience:

[![TaskSync Extension](https://img.shields.io/badge/VS_Code-Install_TaskSync-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://marketplace.visualstudio.com/items?itemName=4regab.tasksync-chat)

If you have issues installing the extension on other IDEs follow this guide: [VSIX Installation Guide](https://docs.trae.ai/ide/manage-extensions)

_Source code available in the [TaskSyncExtension](https://github.com/4regab/TaskSync/tree/main/TaskSyncExtension) folder - this is an open source project._

**Features:**
- 🎯 **Integrated Chat Interface**: Send tasks directly through VS Code sidebar
- 🤖 **One-Click Copilot Activation**: Click/send for initialization
- 📁 **Automatic File Management**: Creates and manages files
- 📎 **File Attachment Support**: Reference files for context
- 🏷️ **Task Categorization**: Organize tasks by type
- 💬 **Real-time Chat**: View conversation history instantly


📋 **[View Full Changelog](CHANGELOG.md)** - See detailed release notes and version history

## 📦 Previous Versions

If you prefer older versions of TaskSync, you can access them directly:


**TaskSync V3 (Web UI version added)**
- [V3 Protocol](https://github.com/4regab/TaskSync/tree/v3)
- File monitoring system with web UI

**TaskSync V2 (Enhanced)**
- [V2 Protocol](https://github.com/4regab/TaskSync/blob/c6a9561b747eefaf6bfcf7a8a0a12dc07d549691/.global/tasksync.md)
- Terminal monitoring system with enhanced session management

**TaskSync V1 (Original)**
- [V1 Protocol](https://github.com/4regab/TaskSync/blob/ac778f1c417f1239e38c15ca195862094a37bf76/.global/tasksync.md)
- Simple autonomous agent protocol with basic monitoring

## 🤝 Discussions

The TaskSync community can be found on [GitHub Discussions](https://github.com/4regab/TaskSync/discussions) where you can ask questions, voice ideas, and share your prompts with other people. Contributions to TaskSync are welcome and highly appreciated. 

## 📊 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=4regab/TaskSync&type=Date)](https://www.star-history.com/#4regab/TaskSync&Date)

⭐ Drop a star if you find this useful!
