# TaskSync Monitor

A modern real-time task monitoring system with WebSocket communication, file monitoring, and instant UI updates.

## ✨ Key Features

- **🔄 Real-time Updates**: Instant UI updates when files change
- **📝 Smart Task Management**: Submit tasks with file attachments through clean web interface
- **📋 Live Log Monitoring**: Real-time log display with newest entries at top
- **🔌 WebSocket Communication**: Seamless live connection with backend
- **📁 File Reference System**: Attach and display file references in tasks
- **🎯 One-Command Startup**: Automatic setup and server launch

## ✨ Quick Start

**Just run one command:**

```bash
cd TaskSyncV3
python3 start.py
```

That's it! The script automatically:
- ✅ Creates virtual environment
- ✅ Installs all dependencies
- ✅ Sets up directories and files
- ✅ Starts the server
- ✅ Opens your browser to http://localhost:8000

## 🎯 How to Use

### Task Management
1. **Submit Tasks**: Enter description, select category, attach files
2. **View Current Task**: Click info button to see active task details
3. **Monitor Progress**: Watch real-time log updates as tasks are processed

### File Attachments
- Click 📎 paperclip icon to browse and attach files
- Files are referenced (not uploaded) for context
- Attached files appear in the Current Task modal

### Categories
- **Task** - General requests
- **Development** - Code implementation
- **Bug Fix** - Corrections and fixes
- **Process** - Workflow improvements

## � How It Works

1. **Task Submission** → Written to `.tasksync/tasks.md`
2. **File Monitoring** → Detects changes automatically
3. **WebSocket Broadcast** → Sends updates to all clients
4. **Real-time UI** → Updates instantly without refresh

## 📁 Project Structure

```
TaskSyncV3/
├── backend/
│   ├── main.py           # FastAPI server with WebSocket support
│   └── requirements.txt  # Python dependencies
├── frontend/
│   ├── index.html        # Main UI with favicon
│   ├── favicon.ico       # TaskSync icon
│   ├── css/main.css      # Modern CSS styling
│   └── js/main.js        # Complete JavaScript logic
├── .tasksync/            # Monitored files directory
│   ├── tasks.md          # Current task (triggers UI updates)
│   └── log.md            # Agent logs (triggers UI updates)
├── venv/                 # Virtual environment (auto-created)
└── start.py              # One-command startup script
```

## �️ Technical Features

### Backend
- **FastAPI** with WebSocket support
- **File monitoring** using watchdog
- **Real-time broadcasting** to all connected clients
- **Automatic file parsing** for task and log content

### Frontend
- **Vanilla JavaScript** (no build process)
- **Modern CSS** with custom properties
- **WebSocket client** for real-time updates
- **File browser modal** for easy file selection
- **Responsive design** for all screen sizes

### Real-time Monitoring
The system watches:
- `.tasksync/tasks.md` - Task changes trigger UI updates
- `.tasksync/log.md` - Log changes appear instantly in UI

## 🔧 Manual Development Setup

If you prefer manual setup:

```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # Linux/macOS
# or venv\Scripts\activate  # Windows

# Install dependencies
pip install -r backend/requirements.txt

# Start server
python backend/main.py
```

## 📊 API Endpoints

- **Frontend**: `http://localhost:8000`
- **Health Check**: `http://localhost:8000/api/health`
- **WebSocket**: `ws://localhost:8000/ws`

## 🎨 Customization

### Styling
- Edit `frontend/css/main.css` for custom themes
- CSS custom properties make theming easy
- Modern design with smooth animations

### Functionality
- `frontend/js/main.js` contains all client logic
- Clean, well-documented code structure
- Easy to extend with new features

## 🧹 Recent Improvements

- ✅ Fixed real-time log monitoring (.tasksync directory)
- ✅ Consolidated to single JavaScript file
- ✅ Added favicon support
- ✅ Fixed file reference display in task modal
- ✅ Improved startup script with automatic setup
- ✅ Enhanced error handling and user feedback

## 📄 License

MIT License - Feel free to use and modify!
