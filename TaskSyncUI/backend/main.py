#!/usr/bin/env python3
"""
TaskSync Monitor Backend
FastAPI server with WebSocket support and file monitoring
"""

import asyncio
import json
import logging
import os
import time
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Set

import uvicorn
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Data models
class TaskSubmission(BaseModel):
    task: str
    category: str = "Task"
    references: List[str] = []

class LogEntry(BaseModel):
    id: str
    message: str
    timestamp: str
    level: str = "info"
    session: Optional[str] = None

class WebSocketMessage(BaseModel):
    type: str
    data: Dict

# Global state
class AppState:
    def __init__(self):
        self.connections: Set[WebSocket] = set()
        self.current_task: Optional[Dict] = None
        self.log_entries: List[Dict] = []
        self.session_count: int = 1
        self.check_count: int = 0
        self.baseline_word_count: int = 0
        # Use absolute path to ensure file monitoring works correctly
        self.workspace_path = Path(__file__).parent.parent.parent.absolute()
        # Store tasks.md and log.md in TaskSync/TaskSyncUI/tasksync/
        self.tasksync_path = Path(__file__).parent.parent.absolute() / "tasksync"
        self.tasks_file = self.tasksync_path / "tasks.md"
        self.log_file = self.tasksync_path / "log.md"
        
    def ensure_files_exist(self):
        """Ensure tasksync directory, tasks.md and log.md exist"""
        self.tasksync_path.mkdir(parents=True, exist_ok=True)
        self.tasks_file.parent.mkdir(parents=True, exist_ok=True)
        self.log_file.parent.mkdir(parents=True, exist_ok=True)
        if not self.tasks_file.exists():
            self.tasks_file.write_text("# TaskSync Tasks\n\n")
        if not self.log_file.exists():
            self.log_file.write_text("")  # Start with empty log file

app_state = AppState()

# FastAPI app
app = FastAPI(title="TaskSync Monitor", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# File monitoring
class TaskSyncFileHandler(FileSystemEventHandler):
    async def broadcast_task_file(self):
        """Broadcast the current tasks.md file content to all connections"""
        if not self.app_state.connections:
            return
        if not self.app_state.tasks_file.exists():
            content = ""
        else:
            content = self.app_state.tasks_file.read_text()
        message = {
            "type": "task_file_update",
            "data": {"content": content}
        }
        disconnected = set()
        for connection in self.app_state.connections:
            try:
                await connection.send_text(json.dumps(message))
            except Exception:
                disconnected.add(connection)
        self.app_state.connections -= disconnected
    async def broadcast_log_file(self):
        """Broadcast the current log.md file content to all connections"""
        if not self.app_state.connections:
            return
        if not self.app_state.log_file.exists():
            content = ""
        else:
            content = self.app_state.log_file.read_text()
        lines = content.split('\n')
        entries = []
        for line in lines:
            line = line.strip()
            if line and not line.startswith('#'):
                entries.append({"message": line})
        # Reverse entries to show newest first
        entries.reverse()
        message = {
            "type": "log_file_update",
            "data": entries
        }
        disconnected = set()
        for connection in self.app_state.connections:
            try:
                await connection.send_text(json.dumps(message))
            except Exception:
                disconnected.add(connection)
        self.app_state.connections -= disconnected
    """Handle file system events for tasks.md and log.md"""
    
    def __init__(self, app_state: AppState):
        self.app_state = app_state
        self.last_tasks_content = ""
        self.last_log_content = ""
        
    def on_modified(self, event):
        if event.is_directory:
            return
            
        file_path = Path(event.src_path)
        logger.info(f"🔍 File modified: {file_path.name} at {file_path}")
        
        if file_path.name == "tasks.md":
            logger.info("📝 Detected tasks.md change, processing...")
            import asyncio
            try:
                loop = asyncio.get_event_loop()
                if loop.is_running():
                    asyncio.create_task(self.handle_tasks_change())
                    asyncio.create_task(self.broadcast_task_file())
                else:
                    asyncio.run(self.handle_tasks_change())
                    asyncio.run(self.broadcast_task_file())
            except RuntimeError:
                import threading
                threading.Thread(target=lambda: asyncio.run(self.handle_tasks_change())).start()
                threading.Thread(target=lambda: asyncio.run(self.broadcast_task_file())).start()
        elif file_path.name == "log.md":
            logger.info("📋 Detected log.md change, processing...")
            import asyncio
            try:
                loop = asyncio.get_event_loop()
                if loop.is_running():
                    asyncio.create_task(self.handle_log_change())
                else:
                    asyncio.run(self.handle_log_change())
            except RuntimeError:
                # If no event loop, schedule it differently
                import threading
                threading.Thread(target=lambda: asyncio.run(self.handle_log_change())).start()
    
    async def handle_tasks_change(self):
        """Handle changes to tasks.md"""
        try:
            if not self.app_state.tasks_file.exists():
                return
                
            content = self.app_state.tasks_file.read_text()
            if content == self.last_tasks_content:
                return
                
            self.last_tasks_content = content
            word_count = len(content.split())
            
            self.app_state.check_count += 1
            
            if self.app_state.baseline_word_count == 0:
                self.app_state.baseline_word_count = word_count
                message = f"🔵 Check #{self.app_state.check_count}: Word count: {word_count} words (baseline). New session started."
                level = "info"
            elif word_count != self.app_state.baseline_word_count:
                message = f"🟡 Check #{self.app_state.check_count}: Word count: {word_count} words (CHANGE DETECTED). Reading tasks.txt..."
                level = "change"
                # Parse new task if content increased
                if word_count > self.app_state.baseline_word_count:
                    await self.parse_new_task(content)
            else:
                message = f"🟣 Check #{self.app_state.check_count}: Word count: {word_count} words (no change). Task in progress."
                level = "monitoring"
            
            # Broadcast the actual log.md file content to all connections
            await self.broadcast_log_file()
            
        except Exception as e:
            logger.error(f"Error handling tasks.md change: {e}")
    
    async def handle_log_change(self):
        """Handle changes to log.md"""
        try:
            if not self.app_state.log_file.exists():
                logger.error("log.md file does not exist")
                return
                
            content = self.app_state.log_file.read_text()
            logger.info(f"📋 Current content length: {len(content)}, Last content length: {len(self.last_log_content) if self.last_log_content else 0}")
            
            if content == self.last_log_content:
                logger.info("📋 Content unchanged, skipping")
                return
            
            # Instead of trying to detect new lines, let's parse all lines and find truly new entries
            current_lines = [line.strip() for line in content.split('\n') if line.strip()]
            last_lines = [line.strip() for line in self.last_log_content.split('\n') if line.strip()] if self.last_log_content else []
            
            logger.info(f"📋 Current lines: {len(current_lines)}, Last lines: {len(last_lines)}")
            
            # Extract messages from lines that look like log entries
            def extract_message(line):
                if (line.startswith('- ') or 
                    line.startswith('* ') or
                    (line and any(emoji in line for emoji in ['🔄', '✅', '📊', '🎯', '🟢', '🔵', '🟡', '🟣', '📝', '❌', '🚀', '🔍', '🎉', '🔥', '🎊', '✨']))):
                    message = line.lstrip('- ').lstrip('* ').strip()
                    if message and not message.startswith('#'):
                        return message
                return None
            
            current_messages = [extract_message(line) for line in current_lines]
            current_messages = [msg for msg in current_messages if msg]
            
            last_messages = [extract_message(line) for line in last_lines]
            last_messages = [msg for msg in last_messages if msg]
            
            # Find new messages
            new_messages = [msg for msg in current_messages if msg not in last_messages]
            
            logger.info(f"📋 Found {len(new_messages)} new messages: {new_messages}")
            
            # Instead of sending individual log entries, broadcast the whole file
            await self.broadcast_log_file()
            self.last_log_content = content
                        
        except Exception as e:
            logger.error(f"Error handling log.md change: {e}")
    
    async def parse_new_task(self, content: str):
        """Parse new task from tasks.md content"""
        try:
            lines = content.split('\n')
            current_task = None
            
            for i, line in enumerate(lines):
                if line.startswith('## ') and any(keyword in line.lower() for keyword in ['task', 'development', 'correction', 'urgent']):
                    # Found a task header
                    category = line.replace('## ', '').strip()
                    description_lines = []
                    
                    # Get description from following lines
                    for j in range(i + 1, len(lines)):
                        if lines[j].startswith('## ') or lines[j].startswith('# '):
                            break
                        if lines[j].strip():
                            description_lines.append(lines[j].strip())
                    
                    if description_lines:
                        current_task = {
                            "id": f"task-{int(time.time() * 1000)}",
                            "description": ' '.join(description_lines),
                            "category": category,
                            "status": "active",
                            "timestamp": datetime.now().isoformat()
                        }
                        break
            
            if current_task:
                self.app_state.current_task = current_task
                await self.broadcast_message({
                    "type": "task_update",
                    "data": current_task
                })
                
        except Exception as e:
            logger.error(f"Error parsing new task: {e}")
    
    async def broadcast_message(self, message: Dict):
        """Broadcast message to all connected WebSocket clients"""
        if not self.app_state.connections:
            return
            
        disconnected = set()
        for connection in self.app_state.connections:
            try:
                await connection.send_text(json.dumps(message))
            except Exception:
                disconnected.add(connection)
        
        # Remove disconnected connections
        self.app_state.connections -= disconnected

# Initialize file monitoring
    
async def load_initial_task_content():
    """Load existing tasks.md content into app_state.current_task"""
    try:
        if not app_state.tasks_file.exists():
            return
            
        content = app_state.tasks_file.read_text().strip()
        if not content:
            return
            
        lines = content.split('\n')
        
        # DEBUG: Log the raw content
        logger.info(f"🔍 DEBUG: Raw task file content: {repr(content)}")
        logger.info(f"🔍 DEBUG: Split into {len(lines)} lines: {lines}")
        
        # Parse task from file
        category = "Task"
        description = ""
        file_references = []
        
        # Find category (first # header)
        for i, line in enumerate(lines):
            line = line.strip()
            if line.startswith('# '):
                category = line.replace('# ', '').strip()
                break
        
        # Find description (lines after category, before "File Reference:")
        description_lines = []
        file_ref_start = -1
        
        for i, line in enumerate(lines):
            line_stripped = line.strip()
            if line_stripped.startswith('File Reference:'):
                file_ref_start = i
                break
            elif line_stripped and not line_stripped.startswith('#') and not line_stripped.startswith('File Reference:'):
                description_lines.append(line_stripped)
        
        description = ' '.join(description_lines).strip()
        
        # Extract file references if found
        if file_ref_start != -1:
            for i in range(file_ref_start + 1, len(lines)):
                line_stripped = lines[i].strip()
                if line_stripped.startswith('- ') or line_stripped.startswith('* '):
                    file_ref = line_stripped.replace('- ', '').replace('* ', '').strip()
                    if file_ref:
                        file_references.append(file_ref)
                elif line_stripped and not line_stripped.startswith('#'):
                    # Non-bullet line after File Reference: - could be another section
                    break
        
        if description:
            app_state.current_task = {
                "id": f"task-{int(time.time() * 1000)}",
                "description": description,
                "category": category,
                "status": "active",
                "timestamp": datetime.now().isoformat(),
                "file_references": file_references
            }
            logger.info(f"📝 Loaded existing task: {category} - {description[:50]}... (with {len(file_references)} file refs)")
            logger.info(f"🔍 DEBUG: Full task object: {app_state.current_task}")
        else:
            logger.info(f"🔍 DEBUG: No description found, task object not created")
        
    except Exception as e:
        logger.error(f"Error loading initial task content: {e}")
        import traceback
        logger.error(f"🔍 DEBUG: Full traceback: {traceback.format_exc()}")

async def load_initial_log_content():
    """Load existing log.md content into app_state.log_entries"""
    try:
        if not app_state.log_file.exists():
            return
            
        content = app_state.log_file.read_text()
        lines = content.split('\n')
        
        for line in lines:
            line = line.strip()
            # Accept any non-empty line that's not a markdown header
            if line and not line.startswith('#'):
                # Clean up the line for display (remove markdown formatting if present)
                message = line.lstrip('- ').lstrip('* ').strip()
                
                log_entry = {
                    "id": f"log-{int(time.time() * 1000)}-{abs(hash(message)) % 10000}",
                    "message": message,
                    "timestamp": datetime.now().isoformat(),
                    "level": "info",
                    "session": f"#{app_state.session_count}"
                }
                
                # Check if this entry already exists
                if not any(entry["message"] == log_entry["message"] for entry in app_state.log_entries):
                    app_state.log_entries.append(log_entry)
        
        # Reverse to have latest first
        app_state.log_entries.reverse()
        
        # Update the file handler's last content to prevent duplicate processing
        file_handler.last_log_content = content
        
    except Exception as e:
        logger.error(f"Error loading initial log content: {e}")

file_handler = TaskSyncFileHandler(app_state)
observer = Observer()

@app.on_event("startup")
async def startup_event():
    """Initialize the application"""
    logger.info("🚀 TaskSync Monitor Backend starting...")
    
    # Ensure files exist
    app_state.ensure_files_exist()
    
    # Start file monitoring for tasksync directory only
    observer.schedule(file_handler, str(app_state.tasksync_path), recursive=False)
    observer.start()
    
    # Initialize baseline word count
    if app_state.tasks_file.exists():
        content = app_state.tasks_file.read_text()
        app_state.baseline_word_count = len(content.split())
    
    # Load initial task content
    await load_initial_task_content()
    
    # Load initial log content and populate log_entries
    if app_state.log_file.exists():
        await load_initial_log_content()
    
    logger.info(f"📁 Monitoring: {app_state.tasks_file}")
    logger.info(f"📁 Monitoring: {app_state.log_file}")
    logger.info(f"📊 Baseline word count: {app_state.baseline_word_count}")
    logger.info(f"📋 Loaded {len(app_state.log_entries)} existing log entries")
    if app_state.current_task:
        logger.info(f"📝 Current task: {app_state.current_task['category']} - {app_state.current_task['description'][:50]}...")

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    observer.stop()
    observer.join()
    logger.info("🛑 TaskSync Monitor Backend stopped")

# WebSocket endpoint
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    app_state.connections.add(websocket)
    
    logger.info(f"🔌 WebSocket connected. Total connections: {len(app_state.connections)}")
    
    # Send initial state (log file and task file)
    try:
        # Read log.md file
        if app_state.log_file.exists():
            content = app_state.log_file.read_text()
            lines = content.split('\n')
            entries = []
            for line in lines:
                line = line.strip()
                if line and not line.startswith('#'):
                    entries.append({"message": line})
            # Reverse entries to show newest first
            entries.reverse()
        else:
            entries = []
            
        # Send initial state
        await websocket.send_text(json.dumps({
            "type": "initial_state",
            "data": {
                "current_task": app_state.current_task,
                "log_entries": entries[:20],  # Take first 20 since already reversed
                "session": app_state.session_count,
                "check_count": app_state.check_count,
                "baseline_word_count": app_state.baseline_word_count
            }
        }))
        logger.info(f"🔍 DEBUG: Sent initial_state with task: {app_state.current_task}")
        
        # Also send current task file content
        if app_state.tasks_file.exists():
            task_content = app_state.tasks_file.read_text()
            await websocket.send_text(json.dumps({
                "type": "task_file_update", 
                "data": {"content": task_content}
            }))
            logger.info(f"🔍 DEBUG: Sent task_file_update with content: {repr(task_content[:100])}")
            
    except Exception as e:
        logger.error(f"Error sending initial state: {e}")
        import traceback
        logger.error(f"🔍 DEBUG: WebSocket error traceback: {traceback.format_exc()}")
    
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            if message["type"] == "submit_task":
                await handle_task_submission(message["data"], websocket)
            elif message["type"] == "get_file_tree":
                await handle_file_tree_request(websocket)
            elif message["type"] == "clear_log":
                await handle_clear_log_request(websocket)
            elif message["type"] == "ping":
                await websocket.send_text(json.dumps({"type": "pong"}))
                
    except WebSocketDisconnect:
        app_state.connections.discard(websocket)
        logger.info(f"🔌 WebSocket disconnected. Total connections: {len(app_state.connections)}")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        app_state.connections.discard(websocket)

async def handle_task_submission(task_data: Dict, websocket: WebSocket):
    """Handle task submission from WebSocket"""
    try:
        task = task_data.get("task", "").strip()
        category = task_data.get("category", "Task")
        references = task_data.get("references", [])
        
        if not task:
            await websocket.send_text(json.dumps({
                "type": "error",
                "data": {"message": "Task description is required"}
            }))
            return
        
        # Format task for tasks.md (OVERWRITE, not append)
        if references:
            task_content = f"# {category}\n{task}\n\nFile Reference:\n"
            for ref in references:
                task_content += f"- {ref}\n"
        else:
            task_content = f"# {category}\n{task}\n"
        # OVERWRITE tasks.md with new content (no timestamp)
        with open(app_state.tasks_file, 'w', encoding='utf-8') as f:
            f.write(task_content)
        
        # Create task object
        new_task = {
            "id": f"task-{int(time.time() * 1000)}",
            "description": task,
            "category": category,
            "references": references,
            "status": "active",
            "timestamp": datetime.now().isoformat()
        }
        
        app_state.current_task = new_task
        
        # Send confirmation
        await websocket.send_text(json.dumps({
            "type": "task_submitted",
            "data": new_task
        }))
        
        # Broadcast to all connections
        for connection in app_state.connections:
            if connection != websocket:
                try:
                    await connection.send_text(json.dumps({
                        "type": "task_update",
                        "data": new_task
                    }))
                except Exception:
                    pass
        
        logger.info(f"📝 Task submitted: {category} - {task[:50]}...")
        
    except Exception as e:
        logger.error(f"Error handling task submission: {e}")
        await websocket.send_text(json.dumps({
            "type": "error",
            "data": {"message": f"Error submitting task: {str(e)}"}
        }))

async def handle_clear_log_request(websocket: WebSocket):
    """Handle clear log request from WebSocket"""
    try:
        # Clear the in-memory log entries
        app_state.log_entries = []
        
        # Clear the log.md file completely (make it empty)
        with open(app_state.log_file, 'w', encoding='utf-8') as f:
            f.write("")
        
        # Update the file handler's last content to prevent duplicate processing
        file_handler.last_log_content = ""
        
        # Send confirmation to all connections
        for connection in app_state.connections:
            try:
                await connection.send_text(json.dumps({
                    "type": "log_cleared",
                    "data": {"message": "Log cleared successfully"}
                }))
            except Exception:
                pass
        
        logger.info("📊 Log cleared successfully")
        
    except Exception as e:
        logger.error(f"Error clearing log: {e}")
        await websocket.send_text(json.dumps({
            "type": "error",
            "data": {"message": f"Error clearing log: {str(e)}"}
        }))

async def handle_file_tree_request(websocket: WebSocket):
    """Handle file tree request"""
    try:
        file_tree = get_workspace_file_tree()
        await websocket.send_text(json.dumps({
            "type": "file_tree",
            "data": file_tree
        }))
    except Exception as e:
        logger.error(f"Error getting file tree: {e}")
        await websocket.send_text(json.dumps({
            "type": "error",
            "data": {"message": f"Error getting file tree: {str(e)}"}
        }))

def get_workspace_file_tree() -> Dict:
    """Get workspace file tree structure"""
    def build_tree(path: Path, max_depth: int = 3, current_depth: int = 0) -> Dict:
        if current_depth >= max_depth:
            return {}
        
        tree = {}
        try:
            for item in sorted(path.iterdir()):
                # Skip hidden files and common ignore patterns
                if item.name.startswith('.') or item.name in ['node_modules', '__pycache__', 'dist', 'build']:
                    continue
                
                if item.is_dir():
                    tree[item.name] = {
                        "type": "directory",
                        "children": build_tree(item, max_depth, current_depth + 1)
                    }
                else:
                    tree[item.name] = {
                        "type": "file",
                        "size": item.stat().st_size,
                        "modified": item.stat().st_mtime
                    }
        except PermissionError:
            pass
        
        return tree
    
    return build_tree(app_state.workspace_path)

# REST API endpoints
@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "connections": len(app_state.connections),
        "session": app_state.session_count,
        "check_count": app_state.check_count
    }

@app.get("/api/files")
async def get_file_tree():
    """Get workspace file tree"""
    return get_workspace_file_tree()

@app.get("/api/tasks")
async def get_current_task():
    """Get current task"""
    return app_state.current_task

@app.get("/api/logs")
async def get_logs(limit: int = 50):
    """Get log entries directly from log.md file"""
    if not app_state.log_file.exists():
        return []
    content = app_state.log_file.read_text()
    lines = content.split('\n')
    entries = []
    for line in lines:
        line = line.strip()
        if line and not line.startswith('#'):
            entries.append({"message": line})
    # Reverse entries to show newest first
    entries.reverse()
    return entries[:limit]

# Serve static files (CSS, JS, and other assets directly from frontend)
frontend_path = Path(__file__).parent.parent / "frontend"

# Mount individual static files at root level for simplified structure
@app.get("/main.css")
async def serve_css():
    """Serve main CSS file"""
    return FileResponse(str(frontend_path / "main.css"), media_type="text/css")

@app.get("/main.js")
async def serve_js():
    """Serve main JavaScript file"""
    return FileResponse(str(frontend_path / "main.js"), media_type="text/javascript")

@app.get("/favicon.ico")
async def serve_favicon():
    """Serve favicon"""
    return FileResponse(str(frontend_path / "favicon.ico"), media_type="image/x-icon")

@app.get("/")
async def serve_index():
    """Serve the main application"""
    return FileResponse(str(frontend_path / "index.html"))

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )