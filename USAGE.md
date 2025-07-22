
# TaskSync V3 Quick Start & Usage

## Option 1: File Mode (Recommended)

### How to Use TaskSync in Your Chat Workflow

1. **Add TaskSync Protocol as Context**
   - Drag only the TaskSync instructions file (e.g., `tasksync.md`) into your chat as context. This gives your AI assistant access to the TaskSync rules it must follow.

2. **Strictly Follow the Protocol**
   - Instruct your AI: `Strictly follow tasksync.md`.
   - This ensures the agent operates with infinite monitoring, proper logging, and task continuation priority.

3. **Add Your Tasks**
   - Open or create `tasks.md` (in `.github/`, `.cursor/rules/`, `.kiro/`, or `.global/` depending on your IDE).
   - Write your tasks, corrections, or urgent overrides in markdown format. See `EXAMPLES.md` for templates and best practices.

4. **Start TaskSync**
   - After adding your tasks, send a message in chat: `Strictly follow tasksync.md, add tasks in tasks.md and then send.`
   - TaskSync will now begin executing your tasks, monitoring for changes, and logging all activity.

5. **Add New Instructions Anytime**
   - You can add new tasks or corrections to `tasks.md` at any time—before or after the current task is done.
   - TaskSync will always finish the current task (unless you use an urgent override), then process new instructions automatically.
   - This saves you from sending repeated requests—just update `tasks.md` and TaskSync will handle the rest.

6. **Session Never Ends Automatically**
   - TaskSync will continue monitoring and executing tasks indefinitely until you explicitly say `stop`, `end`, `terminate`, or `quit`.

### Example Workflow

1. Drag only the TaskSync instructions file (e.g., `tasksync.md`) into your chat as context.
2. Instruct: `Strictly follow tasksync.md, add tasks in tasks.md and then send.`
3. Add your tasks to `tasks.md`.
4. TaskSync starts, logs progress, and lets you add new instructions at any time.

## Option 2: TaskSync Monitor UI

### Web Interface Setup

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

For full protocol details, see [`docs/PROTOCOL.md`](./PROTOCOL.md). 
For ready-to-use task templates and best practices, see [`docs/EXAMPLES.md`](./EXAMPLES.md).

---

This protocol empowers you to maximize the value of premium coding IDEs by enabling autonomous, persistent file-driven task execution with:

- **Infinite monitoring** without automatic termination
- **Real-time status logging** directly in tasks.md file  
- **Complete file reading** (minimum 1000 lines per operation)
- **Terminal-based monitoring** for cross-platform compatibility
- **Manual termination only** - you control when to stop
- **Robust error handling** with continuous operation
- **Seamless instruction integration** without losing context
- **Optional web interface** for visual task management

**For best results, always keep `tasks.md` up to date.**
