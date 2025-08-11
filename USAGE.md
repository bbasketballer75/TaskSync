
# TaskSync v4 Quick Start & Usage

## Option 1: Terminal Agent Mode (Recommended - New in v4)

### Revolutionary Terminal-Based Autonomous Agent

TaskSync v4 introduces a completely new paradigm - your AI becomes a persistent terminal-based autonomous agent that actively requests tasks through PowerShell commands, eliminating all file dependencies and monitoring overhead.

### How to Use TaskSync v4 Terminal Agent

1. **Initialize the Agent**
   - Provide the TaskSync v4 protocol file (`tasksync.md`) as context to your AI IDE
   - This gives your AI assistant access to the complete PRIMARY DIRECTIVE system it must follow

2. **Activate Terminal Agent Protocol**
   - Command your AI: `Strictly adhere to TaskSync Protocol #tasksync.md`
   - The AI immediately transforms into a persistent terminal-based autonomous agent

3. **Agent Becomes Self-Managing**
   - Agent announces: "TaskSync Terminal Agent initialized. Requesting first task."
   - Automatically executes: `$task = Read-Host "Enter your task (or 'none' if no new tasks)"`
   - Waits for your direct terminal input

4. **Provide Tasks Directly**
   - Type your task when prompted and press Enter
   - Agent processes immediately without any file monitoring delays
   - No need to manage files, folders, or monitoring systems

5. **Continuous Autonomous Operation**
   - After completing each task, agent automatically requests the next one
   - Operates indefinitely until you explicitly say "stop", "end", "terminate", or "quit"
   - Maintains session persistence across task cycles

6. **Manual Termination Control**
   - Agent never terminates automatically (PRIMARY DIRECTIVE)
   - You have complete control over session duration
   - Simple termination with explicit keywords

### Example Terminal Agent Workflow

```powershell
TaskSync Terminal Agent initialized. Requesting first task.
Enter your task (or 'none' if no new tasks): Create a Python web scraper for news articles
[INTERNAL: State - Active]
[INTERNAL: Current Task - Create Python web scraper for news articles]
Received task: Create a Python web scraper for news articles. Beginning execution...

# Agent completes the task automatically
Web scraper completed successfully with BeautifulSoup and requests library.
Task completed. Requesting next task from terminal.
Enter your task (or 'none' if no new tasks): Add data export to CSV functionality
[INTERNAL: State - Active]
[INTERNAL: Current Task - Add data export to CSV functionality]

# Continues indefinitely until manual termination
CSV export functionality added successfully.
Task completed. Requesting next task from terminal.
Enter your task (or 'none' if no new tasks): stop
Session terminated by user request.
TaskSync session completed. Tasks completed: 2.
```

## Option 2: File Mode (Legacy v3 Support)

### Traditional File-Based Workflow

For users who prefer the classic TaskSync v3 file monitoring approach:

1. **Add TaskSync Protocol as Context**
   - Provide the appropriate TaskSync v3 protocol file as context to your AI
   - Available in `.github/`, `.cursor/rules/`, `.kiro/`, or `.global/` directories

2. **Follow the Legacy Protocol**
   - Instruct your AI: `Strictly follow tasksync.md`
   - Agent operates with file monitoring and word count change detection

3. **Manage Task Files**
   - Create and edit `tasks.md` for task instructions
   - Agent monitors file changes and maintains `log.md` for status tracking

4. **Traditional Monitoring Workflow**
   - Agent checks for file changes at regular intervals (180s active, 30s monitoring)
   - Manual task file updates trigger agent task processing

### Example File-Based Workflow

1. Create or edit `tasks.md`:
```markdown
# Task
Create user authentication system with JWT tokens
Add password encryption with bcrypt
Implement login/logout API endpoints
```

2. Agent detects file changes and processes tasks
3. Monitor progress in `log.md` status tracking file
4. Add new tasks by editing `tasks.md` again

## Option 3: TaskSync Monitor UI (Legacy v3 Support)

### Web Interface for Visual Task Management

For users who prefer the TaskSync v3 visual interface with real-time monitoring:

1. **Clone and Setup**
   ```bash
   git clone --filter=blob:none --sparse https://github.com/4regab/TaskSync.git
   cd TaskSync
   git sparse-checkout set TaskSyncUI
   cd TaskSyncUI
   python3 start.py
   ```

2. **Use the Interface**
   - Opens automatically at http://localhost:8000
   - Submit tasks with categories (Task, Development, Bug Fix, Process)
   - Attach file references using the 📎 button
   - Monitor real-time progress with live log updates

3. **Features**
   - Visual task submission and management
   - Real-time WebSocket communication
   - File browser for easy workspace navigation
   - Modern responsive design with dark/light themes

---

This protocol empowers you to maximize the value of premium coding IDEs by enabling autonomous, persistent task execution with:

**TaskSync v4 Terminal Agent:**
- **Direct terminal communication** without file dependencies
- **Real-time task processing** with immediate execution
- **Autonomous agent behavior** with persistent operation
- **Manual termination control** - you control when to stop
- **PRIMARY DIRECTIVE compliance** for consistent reliable behavior
- **Cross-platform PowerShell compatibility** for universal access
- **Enhanced user experience** with direct agent interaction

**Legacy Support (v3):**
- **Infinite monitoring** without automatic termination
- **Real-time status logging** directly in tasks.md file  
- **Complete file reading** (minimum 1000 lines per operation)
- **Terminal-based monitoring** for cross-platform compatibility
- **Manual termination only** - you control when to stop
- **Robust error handling** with continuous operation
- **Seamless instruction integration** without losing context
- **Optional web interface** for visual task management

**For best results with TaskSync v4, simply initialize the terminal agent and start providing tasks directly through terminal input.**
