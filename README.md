# 🚀 TaskSync V3
**Save premium requests on your AI coding IDEs**. This simple prompt instructions helps your agent work more efficiently, reduce premium request usage, and allow you to give the agent new instructions while it's currently working or after completing a task.

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
The simplest way to use TaskSync is through files and your existing AI IDE:

**🎯 VS Code Copilot**

[![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-instructions%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2F4regab%2FTaskSync%2Fmain%2F.github%2Finstructions%2Ftasksync.instructions.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-instructions%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2F4regab%2FTaskSync%2Fmain%2F.github%2Finstructions%2Ftasksync.instructions.md)
```bash
git clone --no-checkout https://github.com/4regab/TaskSync.git
cd TaskSync
git sparse-checkout init
echo ".github/*" > .git/info/sparse-checkout
git read-tree -m -u HEAD
```
*Note: If you use one-click install, create *`tasks.md`* and *`log.md`* files in your workspace.*
**For optimal results with Copilot**, enable "Auto Approve" and set "Max Requests" to 100 in your settings. This allows the agent to execute commands and handle long tasks without interruption. Adjust these settings via the UI or your user settings JSON file:
```text
"chat.tools.autoApprove": true,
"chat.agent.maxRequests": 100
```
**🎯 Cursor**
```bash
git clone --no-checkout https://github.com/4regab/TaskSync.git
cd TaskSync
git sparse-checkout init
echo ".cursor/*" > .git/info/sparse-checkout
git read-tree -m -u HEAD
```

**🎯 Kiro**
```bash
git clone --no-checkout https://github.com/4regab/TaskSync.git
cd TaskSync
git sparse-checkout init
echo ".kiro/*" > .git/info/sparse-checkout
git read-tree -m -u HEAD
```

**🎯 Any IDE (Global)**
```bash
git clone --no-checkout https://github.com/4regab/TaskSync.git
cd TaskSync
git sparse-checkout init
echo ".global/*" > .git/info/sparse-checkout
git read-tree -m -u HEAD
```

### Option 2: TaskSync UI
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

Tell the AI to 
```markdown
Strictly adhere to TaskSync Protocol #tasksync.md"
```
Note: tasksync.md prompt file must be attached.

### File Mode

Simply edit your `tasks.md` file e.g.: 

# Task
Fix the authentication bug in login.tsx
Add TypeScript types for user profile

### Web Interface Mode

1. **Launch**: `python3 start.py` → Opens http://localhost:8000
2. **Submit Tasks**: Use categories (Task, Development, Bug Fix, Process)
3. **File References**: Click 📎 to browse and reference files for context (optional)
4. **Monitor Progress**: Watch real-time log updates as the agent works

**The agent automatically detects changes and executes tasks**
---

## ✨ Key Features

* **Infinite Monitoring**: Agent never terminates automatically - operates continuously until manually stopped
* **Task Continuation Priority**: Completes current tasks before processing new instructions
* **Dual File System**: Uses `tasks.md` for instructions and `log.md` for status tracking  
* **Urgent Override Detection**: Keywords like "STOP CURRENT TASK", "CORRECTION" interrupt current work
* **Cross-Platform**: Windows, macOS, Linux compatibility
* **Optional Web Interface**: Modern dashboard with real-time monitoring for visual users

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
- **🔄 Enhanced Protocol**: Improved TaskSync Instructions for better persistence and enhanced file reference handling
- **🔧 Better Cross-Platform Support**: Windows, macOS, Linux compatibility
- **📝 File Path**: File reference for more context for agent
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

## 📊 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=4regab/TaskSync&type=Date)](https://www.star-history.com/#4regab/TaskSync&Date)

⭐ Drop a star if you find this useful!
