<div align="center">
  <img src="https://github.com/4regab/TaskSync/blob/main/TaskSyncExtension/icon.png" alt="TaskSync Logo" width="120" height="120">
  <h1>TaskSync</h1>
</div>

**Save premium requests on your AI IDEs**. This simple prompt instructions helps your agent work more efficiently, reduce premium request usage, and allow you to give the agent new instructions while it's currently working or after completing a task.

## What This Does

TaskSync is an **autonomous agent protocol** that creates persistent agents. Instead of typing lots of messages back and forth, you write tasks in a tasks.md file. Your AI agent continuously monitors this file using Terminal word count checks, executes tasks autonomously, and maintains persistent operation until manually terminated.

https://github.com/user-attachments/assets/a4737779-b877-4e12-8990-1a70a7b09dcc

## How TaskSync Helps

- **Add new task in one request** - You can provide new instructions to the agent without sending a new chat message by simply adding tasks to the tasks.md file.
- **Task continuation priority** - completes current tasks before processing new instructions (unless urgent override detected)
- **Dual file system** - uses `tasks.md` for instructions and separate `log.md` for status tracking
- **Real-time status logging** - it writes progress monitoring into dedicated log.md
- **Never terminates automatically** - maintains persistent operation until you explicitly stop it
- **Self-correcting behavior** - when AI makes mistakes, it reads your corrections and fixes its mistakes
  **Works with any AI IDEs** - Kiro, Copilot, Cursor, Windsurf, Trae IDE, and more

---

## 🚀 Getting Started

### Option 1: File Mode

The simplest way to use TaskSync is through files and your existing AI IDE. Choose your IDE below:

<details>
<summary><strong>🎯 VS Code Copilot</strong></summary>

[![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-instructions%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2F4regab%2FTaskSync%2Fmain%2F.github%2Finstructions%2Ftasksync.instructions.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-instructions%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2F4regab%2FTaskSync%2Fmain%2F.github%2Finstructions%2Ftasksync.instructions.md)

```bash
git clone --no-checkout https://github.com/4regab/TaskSync.git
cd TaskSync
git sparse-checkout init
echo ".github/*" > .git/info/sparse-checkout
git read-tree -m -u HEAD
```

_Note: If you use one-click install, create `tasks.md` and `log.md` files in your workspace._

**For optimal results with Copilot**, enable "Auto Approve" and set "Max Requests" to 100 in your settings. This allows the agent to execute commands and handle long tasks without interruption. Adjust these settings via the UI or your user settings JSON file:

```text
"chat.tools.autoApprove": true,
"chat.agent.maxRequests": 100
```

</details>

<details>
<summary><strong>🎯 Cursor</strong></summary>

```bash
git clone --no-checkout https://github.com/4regab/TaskSync.git
cd TaskSync
git sparse-checkout init
echo ".cursor/*" > .git/info/sparse-checkout
git read-tree -m -u HEAD
```

</details>

<details>
<summary><strong>🎯 Kiro</strong></summary>

```bash
git clone --no-checkout https://github.com/4regab/TaskSync.git
cd TaskSync
git sparse-checkout init
echo ".kiro/*" > .git/info/sparse-checkout
git read-tree -m -u HEAD
```

</details>

<details>
<summary><strong>🎯 Any IDE (Global)</strong></summary>

```bash
git clone --no-checkout https://github.com/4regab/TaskSync.git
cd TaskSync
git sparse-checkout init
echo ".global/*" > .git/info/sparse-checkout
git read-tree -m -u HEAD
```

</details>

### Option 2: TaskSync VS Code Extension

For VS Code users who want an integrated extension experience:

**Features:**

- 🎯 **Integrated Chat Interface**: Send tasks directly through VS Code sidebar
- 🤖 **One-Click Copilot Integration**: Click copilot button to activate GitHub Copilot with TaskSync protocol
- 📁 **Automatic File Management**: Creates and manages `tasks.md` and `log.md` files
- 📎 **File Attachment Support**: Reference files for context
- 🏷️ **Task Categorization**: Organize tasks by type (Task, Bug, Feature, Research)
- 💬 **Real-time Chat**: View conversation history and responses

**Installation:**

[![TaskSync Extension](https://img.shields.io/badge/VS_Code-Install_TaskSync-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://marketplace.visualstudio.com/items?itemName=4regab.tasksync-chat)

_Source code available in the [TaskSyncExtension](https://github.com/4regab/TaskSync/tree/main/TaskSyncExtension) folder - this is an open source project._

**Usage:**

1. Click the TaskSync icon in VS Code sidebar
2. Write your task in the input field
3. Click the Copilot button 🤖 (only needed for first initialization or when chat ends)
4. Continue working - after initialization, just write and send tasks normally

### Option 3: TaskSync UI

For users who prefer a visual interface with real-time monitoring:

```bash
git clone --no-checkout https://github.com/4regab/TaskSync.git
cd TaskSync
git sparse-checkout init
echo "TaskSyncUI/*" > .git/info/sparse-checkout
git read-tree -m -u HEAD
cd TaskSyncUI
python3 start.py
```

This automatically sets up the environment and opens a web interface at http://localhost:8000.

<img width="1017" height="521" alt="image" src="https://github.com/user-attachments/assets/0659ffc0-4310-4b6b-bf2c-2838c97863d7" />

---

## 🛠️ How to Use

Choose your preferred method below:

<details>
<summary><strong>📁 File Mode</strong></summary>

Tell the agent to:

```markdown
Strictly adhere to TaskSync Protocol #tasksync.md
```

Note: tasksync.md prompt file must be attached.

Simply edit your `tasks.md` file e.g.:

```markdown
# Task

Fix the authentication bug in login.tsx
Add TypeScript types for user profile
```

**The agent automatically detects changes and executes tasks**

</details>

<details>
<summary><strong>🔌 VS Code Extension</strong></summary>

1. **Open TaskSync Panel**: Click the TaskSync icon in VS Code sidebar
2. **Initialize Agent**: Click the Copilot button 🤖 (only needed for first initialization or when chat ends) for other IDEs paste the prompt to chat
3. **Add Tasks**: Write your task in the input field and press Enter
4. **Attach Files**: Use the 📎 button to reference files for context (optional)
5. **Categorize**: Select task type (Task, Bug, Feature, Research) from dropdown
6. **Monitor Progress**: View real-time responses and log history
7. **Continue Working**: After initialization, just write and send tasks normally - no need to click Copilot button again
</details>

<details>
<summary><strong>🌐 Web Interface</strong></summary>

Tell the agent to:

```markdown
Strictly adhere to TaskSync Protocol #tasksync.md
```

Note: tasksync.md prompt file must be attached.

1. **Launch**: `python3 start.py` → Opens http://localhost:8000
2. **Submit Tasks**: Use categories (Task, Development, Bug Fix, Process)
3. **File References**: Click 📎 to browse and reference files for context (optional)
4. **Monitor Progress**: Watch real-time log updates as the agent works

**The agent automatically detects changes and executes tasks**

</details>

## ✨ Key Features

- **Infinite Monitoring**: Agent never terminates automatically - operates continuously until manually stopped
- **Task Continuation Priority**: Completes current tasks before processing new instructions
- **Dual File System**: Uses `tasks.md` for instructions and `log.md` for status tracking
- **Urgent Override Detection**: Keywords like "STOP CURRENT TASK", "CORRECTION" interrupt current work
- **Cross-Platform**: Windows, macOS, Linux compatibility
- **Optional Web Interface**: Modern dashboard with real-time monitoring for visual users

---

## 🧩 How It Works

TaskSync uses terminal-based word count monitoring to efficiently detect file changes for new instructions while working:

**Active Task Execution:**

- **Interval**: 180 seconds
- **Command**: `wc -w [tasks.md]` (Linux/macOS) or `Get-Content [tasks.md] | Measure-Object -Word` (Windows)

**Monitoring Mode:**

- **Interval**: 30 seconds
- **Command**: `sleep 30; wc -w [tasks.md]` (Linux/macOS) or `Start-Sleep -Seconds 30; Get-Content [tasks.md] | Measure-Object -Word` (Windows)

---

## 🎉 What's New in V3

- **🎨 TaskSync UI**: Modern web interface for users who prefer visual interface
- **🔌 VS Code Extension**: Integrated extension with chat interface and one-click Copilot integration
- **🔄 Enhanced Protocol**: Improved TaskSync Instructions for better persistence and enhanced file reference handling
- **🔧 Better Cross-Platform Support**: Windows, macOS, Linux compatibility
- **📝 File Path**: File reference for more context for agent

📋 **[View Full Changelog](CHANGELOG.md)** - See detailed release notes and version history

---

## 📦 Previous Versions

If you prefer older versions of TaskSync, you can access them directly:

**TaskSync V1 (Original)**

- [V1 Protocol](https://github.com/4regab/TaskSync/blob/ac778f1c417f1239e38c15ca195862094a37bf76/.global/tasksync.md)
- Simple autonomous agent protocol with basic monitoring

**TaskSync V2 (Enhanced)**

- [V2 Protocol](https://github.com/4regab/TaskSync/blob/c6a9561b747eefaf6bfcf7a8a0a12dc07d549691/.global/tasksync.md)
- PowerShell monitoring system with enhanced session management

To use a previous version, simply download the specific tasksync.md file and follow the instructions within it.

---

## 🤝 Community

The TaskSync community can be found on [GitHub Discussions](https://github.com/4regab/TaskSync/discussions) where you can ask questions, voice ideas, and share your projects with other people.

## 🛠️ Contributing

Contributions to TaskSync are welcome and highly appreciated. However, before you jump right into it, we would like you to review our [Contribution Guidelines](https://github.com/4regab/TaskSync/blob/main/CONTRIBUTING.md) to make sure you have a smooth experience contributing to TaskSync.

---

## 📊 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=4regab/TaskSync&type=Date)](https://www.star-history.com/#4regab/TaskSync&Date)

⭐ Drop a star if you find this useful!
