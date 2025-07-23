/**
 * TaskSync Monitor - Enhanced WebSocket Implementation
 * Real-time task monitoring with WebSocket integration
 */

class TaskSyncMonitor {
    constructor() {
        this.currentTask = null;
        this.logEntries = [];
        this.websocket = null;
        this.connectionStatus = 'disconnected';
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 1000;
        this.selectedFiles = [];
        this.tempSelectedFiles = []; // For file browser modal
        this.allFileList = []; // For Select All functionality
        this.init();
    }

    /**
     * Initialize the application
     */
    async init() {
        this.setupEventListeners();
        this.renderCurrentTask();
        this.renderLog();
        this.updateConnectionStatus('connecting');
        await this.connectWebSocket();
        console.log('🚀 TaskSync Monitor initialized');
    }

    /**
     * Set up all event listeners
     */
    setupEventListeners() {
        // Task form submission
        const taskForm = document.getElementById('task-form');
        if (taskForm) {
            taskForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleTaskSubmission();
            });
        }

        // Current task modal
        const currentTaskBtn = document.getElementById('current-task-btn');
        const taskModal = document.getElementById('current-task-modal');
        const closeModalBtn = document.getElementById('close-task-modal');
        const modalBackdrop = taskModal?.querySelector('.task-modal-backdrop');

        if (currentTaskBtn && taskModal) {
            // Open modal
            currentTaskBtn.addEventListener('click', () => {
                taskModal.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            });

            // Close modal - close button
            if (closeModalBtn) {
                closeModalBtn.addEventListener('click', () => {
                    taskModal.classList.add('hidden');
                    document.body.style.overflow = '';
                });
            }

            // Close modal - backdrop click
            if (modalBackdrop) {
                modalBackdrop.addEventListener('click', () => {
                    taskModal.classList.add('hidden');
                    document.body.style.overflow = '';
                });
            }

            // Close modal - escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && !taskModal.classList.contains('hidden')) {
                    taskModal.classList.add('hidden');
                    document.body.style.overflow = '';
                }
            });
        }

        // Clear log button
        const clearLogBtn = document.getElementById('clear-log-btn');
        if (clearLogBtn) {
            clearLogBtn.addEventListener('click', () => {
                this.clearLog();
            });
        }

        // Auto-resize textarea
        const textarea = document.getElementById('task-description');
        const submitBtn = document.getElementById('submit-task-btn');
        if (textarea) {
            textarea.addEventListener('input', () => {
                this.autoResizeTextarea(textarea);
                // Update submit button state
                if (submitBtn) {
                    if (textarea.value.trim()) {
                        submitBtn.classList.add('active');
                    } else {
                        submitBtn.classList.remove('active');
                    }
                }
            });
            
            // Add Enter key submission
            textarea.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.handleTaskSubmission();
                }
            });
        }

        // File attachment button
        const addFilesBtn = document.getElementById('add-files-btn');
        if (addFilesBtn) {
            addFilesBtn.addEventListener('click', () => {
                this.showFileBrowser();
            });
        }

        // File browser modal events
        this.setupFileBrowserEvents();
        
        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
        
        // Initialize theme
        this.initializeTheme();
    }

    /**
     * Handle task form submission
     */
    handleTaskSubmission() {
        const textarea = document.getElementById('task-description');
        const categorySelect = document.getElementById('task-category');
        
        if (!textarea || !categorySelect) return;

        const description = textarea.value.trim();
        if (!description) return;

        // Send task via WebSocket if connected
        if (this.websocket && this.connectionStatus === 'connected') {
            this.sendWebSocketMessage({
                type: 'submit_task',
                data: {
                    task: description,
                    category: categorySelect.value,
                    references: this.selectedFiles
                }
            });
        } else {
            // Fallback: create task locally
            this.currentTask = {
                id: `task-${Date.now()}`,
                description: description,
                category: categorySelect.value,
                status: 'active',
                timestamp: new Date()
            };
            
            this.addLogEntry(`New task submitted: "${description}" (offline mode)`);
            this.renderCurrentTask();
            this.updateTaskButton();
        }

        // Clear form
        textarea.value = '';
        this.autoResizeTextarea(textarea);
        this.selectedFiles = [];
        this.renderFileChips();
        
        // Reset submit button state
        const submitBtn = document.getElementById('submit-task-btn');
        if (submitBtn) {
            submitBtn.classList.remove('active');
        }

        console.log('📝 Task submitted:', description);
    }

    /**
     * Add log entry
     */
    addLogEntry(message) {
        const entry = {
            id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            message: message,
            timestamp: new Date()
        };

        // Add to beginning (latest first)
        this.logEntries.unshift(entry);

        // Limit entries
        if (this.logEntries.length > 50) {
            this.logEntries = this.logEntries.slice(0, 50);
        }

        this.renderLog();
    }

    /**
     * Render current task in modal
     */
    renderCurrentTask() {
        console.log('🔍 DEBUG: renderCurrentTask called with currentTask:', this.currentTask);
        const container = document.getElementById('current-task-display');
        if (!container) return;

        if (!this.currentTask) {
            container.innerHTML = `
                <div class="no-task-state">
                    <div class="empty-icon">⚡</div>
                    <h3 class="empty-message">No Active Task</h3>
                    <p class="empty-description">Agent is in monitoring mode. Submit a task above to get started.</p>
                </div>
            `;
        } else {
            let fileReferencesHtml = '';
            // Check all possible field names: references (backend), fileReferences (frontend), file_references (snake_case)
            const fileRefs = this.currentTask.references || this.currentTask.fileReferences || this.currentTask.file_references || [];
            console.log('🔍 DEBUG: File references found:', fileRefs);
            if (fileRefs.length > 0) {
                fileReferencesHtml = `
                    <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border-primary);">
                        <strong style="color: var(--text-secondary); font-size: 0.9rem;">File References:</strong>
                        <ul style="margin: 0.5rem 0 0 1rem; color: var(--text-secondary);">
                            ${fileRefs.map(ref => 
                                `<li style="margin: 0.25rem 0;">${this.escapeHtml(ref)}</li>`
                            ).join('')}
                        </ul>
                    </div>
                `;
                console.log('🔍 DEBUG: Generated file references HTML:', fileReferencesHtml);
            }
            
            const finalHtml = `
                <div class="active-task" style="padding:1.5rem 1rem; background:var(--modal-bg); border-radius:1rem; box-shadow:0 2px 8px rgba(0,0,0,0.04);">
                    <h2 style="margin:0 0 0.5rem 0; font-size:1.25rem; color:var(--accent-color); font-weight:600; letter-spacing:0.01em;">${this.escapeHtml(this.currentTask.category)}</h2>
                    <p style="margin:0 0 0.5rem 0; font-size:1.05rem; color:var(--text-primary); line-height:1.6;">${this.escapeHtml(this.currentTask.description)}</p>
                    ${fileReferencesHtml}
                </div>
            `;
            console.log('🔍 DEBUG: Final HTML being set:', finalHtml);
            container.innerHTML = finalHtml;
        }
    }

    /**
     * Update task button state
     */
    updateTaskButton() {
        const currentTaskBtn = document.getElementById('current-task-btn');
        if (!currentTaskBtn) return;

        currentTaskBtn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4"/>
                <path d="M12 8h.01"/>
            </svg>
        `;
    }

    /**
     * Render log entries
     */
    renderLog() {
        const container = document.getElementById('monitoring-log');
        if (!container) return;

        if (this.logEntries.length === 0) {
            container.innerHTML = `
                <div class="log-empty-state">
                    <div class="empty-icon">📊</div>
                    <div class="empty-message">No logs yet</div>
                    <div class="empty-description">TaskSync monitoring logs will appear here</div>
                </div>
            `;
            return;
        }

        const entriesHtml = this.logEntries.map(entry => `
            <div class="log-entry">
                <div class="log-entry-header">
                    <span class="log-entry-icon">•</span>
                    <span class="log-entry-message">${this.escapeHtml(entry.message)}</span>
                </div>
            </div>
        `).join('');

        container.innerHTML = `<div class="log-entries">${entriesHtml}</div>`;
    }

    /**
     * Clear all log entries
     */
    clearLog() {
        this.logEntries = [];
        this.renderLog();
        
        // Send clear request to backend via WebSocket
        if (this.websocket && this.connectionStatus === 'connected') {
            this.sendWebSocketMessage({
                type: 'clear_log',
                data: {}
            });
        }
        
        console.log('📊 Log cleared');
    }

    /**
     * Auto-resize textarea
     */
    autoResizeTextarea(textarea) {
        textarea.style.height = 'auto';
        const scrollHeight = textarea.scrollHeight;
        const maxHeight = 200;
        const minHeight = 20;
        const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);
        textarea.style.height = newHeight + 'px';
        textarea.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden';
    }

    /**
     * WebSocket Connection Management
     */
    async connectWebSocket() {
        try {
            const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            const wsUrl = `${protocol}//${window.location.host}/ws`;
            
            this.websocket = new WebSocket(wsUrl);
            
            this.websocket.onopen = () => {
                console.log('🔌 WebSocket connected');
                this.connectionStatus = 'connected';
                this.reconnectAttempts = 0;
                this.updateConnectionStatus('connected');
                this.addLogEntry('🟢 Connected to TaskSync Monitor');
            };
            
            this.websocket.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);
                    this.handleWebSocketMessage(message);
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            };
            
            this.websocket.onclose = () => {
                console.log('🔌 WebSocket disconnected');
                this.connectionStatus = 'disconnected';
                this.updateConnectionStatus('disconnected');
                this.addLogEntry('🔴 Disconnected from TaskSync Monitor');
                this.scheduleReconnect();
            };
            
            this.websocket.onerror = (error) => {
                console.error('WebSocket error:', error);
                this.connectionStatus = 'error';
                this.updateConnectionStatus('error');
            };
            
        } catch (error) {
            console.error('Failed to connect WebSocket:', error);
            this.connectionStatus = 'error';
            this.updateConnectionStatus('error');
            this.scheduleReconnect();
        }
    }
    
    /**
     * Handle incoming WebSocket messages
     */
    handleWebSocketMessage(message) {
        switch (message.type) {
            case 'initial_state':
                this.handleInitialState(message.data);
                break;
            case 'task_submitted':
                this.handleTaskSubmitted(message.data);
                break;
            case 'task_update':
                this.handleTaskUpdate(message.data);
                break;
            case 'log_entry':
                this.handleLogEntry(message.data);
                break;
            case 'log_cleared':
                this.handleLogCleared(message.data);
                break;
            case 'log_file_update':
                this.handleLogFileUpdate(message.data);
                break;
            case 'task_file_update':
                this.handleTaskFileUpdate(message.data);
                break;
            case 'file_tree':
                this.handleFileTree(message.data);
                break;
            case 'error':
                this.handleError(message.data);
                break;
            case 'pong':
                // Heartbeat response
                break;
            default:
                console.log('Unknown message type:', message.type);
        }
    }
    /**
     * Handle task_file_update: always display full tasks.md in modal
     */
    handleTaskFileUpdate(data) {
        const container = document.getElementById('current-task-display');
        if (!container) return;
        
        const lines = data.content.split('\n');
        let html = '';
        
        if (lines.length > 0) {
            html += `<h2>${this.escapeHtml(lines[0].replace(/^#\s*/, ''))}</h2>`;
        }
        if (lines.length > 1) {
            html += `<div>${this.escapeHtml(lines[1])}</div>`;
        }
        
        // Find 'File Reference:' and render the rest as a list
        const fileRefIdx = lines.findIndex(l => l.trim().startsWith('File Reference:'));
        if (fileRefIdx !== -1) {
            html += '<br><strong>File Reference:</strong><ul>';
            for (let i = fileRefIdx + 1; i < lines.length; i++) {
                const ref = lines[i].replace(/^[-*]\s*/, '').trim();
                if (ref) html += `<li>${this.escapeHtml(ref)}</li>`;
            }
            html += '</ul>';
        }
        
        container.innerHTML = html;
        
        // Parse file references for storing in task object
        const fileReferences = [];
        const taskFileRefIdx = lines.findIndex(l => l.trim().startsWith('File Reference:'));
        if (taskFileRefIdx !== -1) {
            for (let i = taskFileRefIdx + 1; i < lines.length; i++) {
                const ref = lines[i].replace(/^[-*]\s*/, '').trim();
                if (ref) fileReferences.push(ref);
            }
        }
        
        // Also update the current task state
        this.currentTask = {
            id: `task-${Date.now()}`,
            description: lines.slice(1).filter(line => 
                !line.trim().startsWith('File Reference:') && 
                !line.trim().match(/^[-*]\s+/) &&
                line.trim()
            ).join(' ').trim(),
            category: lines[0] ? lines[0].replace(/^#\s*/, '') : 'Task',
            status: 'active',
            timestamp: new Date().toISOString(),
            references: fileReferences
        };
        this.updateTaskButton();
    }
    /**
     * Handle log_file_update: always display only log.md contents
     */
    handleLogFileUpdate(entries) {
        // Entries are already in newest-first order from backend
        this.logEntries = entries;
        this.renderLog();
    }
    
    /**
     * Handle initial state from server
     */
    handleInitialState(data) {
        console.log('🔍 DEBUG: handleInitialState called with:', data);
        if (data.current_task) {
            console.log('🔍 DEBUG: Setting currentTask to:', data.current_task);
            this.currentTask = data.current_task;
            this.renderCurrentTask();
            this.updateTaskButton();
        }
        
        if (data.log_entries && data.log_entries.length > 0) {
            // Log entries are already in newest-first order from backend
            this.logEntries = data.log_entries;
            this.renderLog();
        }
        
        console.log('📊 Initial state loaded:', data);
    }
    
    /**
     * Handle task submission confirmation
     */
    handleTaskSubmitted(data) {
        this.currentTask = data;
        this.renderCurrentTask();
        this.updateTaskButton();
        this.addLogEntry(`✅ Task submitted: "${data.description}"`);
        console.log('📝 Task confirmed:', data);
    }
    
    /**
     * Handle task updates
     */
    handleTaskUpdate(data) {
        this.currentTask = data;
        this.renderCurrentTask();
        this.updateTaskButton();
        console.log('🔄 Task updated:', data);
    }
    
    /**
     * Handle new log entries
     */
    handleLogEntry(data) {
        // Check if entry already exists
        if (!this.logEntries.find(entry => entry.id === data.id)) {
            this.logEntries.unshift(data);
            
            // Limit entries
            if (this.logEntries.length > 50) {
                this.logEntries = this.logEntries.slice(0, 50);
            }
            
            this.renderLog();
        }
    }
    
    /**
     * Handle log cleared confirmation
     */
    handleLogCleared(data) {
        this.logEntries = [];
        this.renderLog();
        this.addLogEntry('📊 Log cleared successfully');
        console.log('📊 Log cleared:', data.message);
    }
    
    /**
     * Handle file tree data
     */
    handleFileTree(data) {
        // Store file tree for future use
        this.fileTree = data;
        console.log('📁 File tree loaded');
        
        // Render the file tree if the modal is open
        const modal = document.getElementById('file-browser-modal');
        if (modal && modal.style.display === 'flex') {
            this.renderFileTree(data);
        }
    }
    
    /**
     * Handle errors
     */
    handleError(data) {
        console.error('Server error:', data.message);
        this.addLogEntry(`❌ Error: ${data.message}`);
        this.showNotification(data.message, 'error');
    }
    
    /**
     * Send WebSocket message
     */
    sendWebSocketMessage(message) {
        if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
            this.websocket.send(JSON.stringify(message));
        } else {
            console.warn('WebSocket not connected, cannot send message');
            this.showNotification('Not connected to server', 'warning');
        }
    }
    
    /**
     * Schedule WebSocket reconnection
     */
    scheduleReconnect() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.log('Max reconnection attempts reached');
            this.addLogEntry('🔴 Connection failed - max attempts reached');
            return;
        }
        
        this.reconnectAttempts++;
        const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
        
        console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
        this.updateConnectionStatus('reconnecting');
        
        setTimeout(() => {
            this.connectWebSocket();
        }, delay);
    }
    
    /**
     * Update connection status indicator
     */
    updateConnectionStatus(status) {
        this.connectionStatus = status;
        
        // Update header if status indicator exists
        const statusIndicator = document.getElementById('connection-status');
        if (statusIndicator) {
            const statusConfig = {
                'connected': { text: '🟢 LIVE', class: 'connected' },
                'connecting': { text: '🔵 CONNECTING', class: 'connecting' },
                'reconnecting': { text: '🟡 RECONNECTING', class: 'reconnecting' },
                'disconnected': { text: '🔴 DISCONNECTED', class: 'disconnected' },
                'error': { text: '🔴 ERROR', class: 'error' }
            };
            
            const config = statusConfig[status] || statusConfig['disconnected'];
            statusIndicator.textContent = config.text;
            statusIndicator.className = `connection-status ${config.class}`;
        }
    }
    
    /**
     * Setup file browser modal events
     */
    setupFileBrowserEvents() {
        const modal = document.getElementById('file-browser-modal');
        const closeBtn = document.getElementById('close-file-browser');
        const backdrop = modal?.querySelector('.task-modal-backdrop');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeFileBrowser();
            });
        }

        if (backdrop) {
            backdrop.addEventListener('click', () => {
                this.closeFileBrowser();
            });
        }

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal && modal.style.display === 'flex') {
                this.closeFileBrowser();
            }
        });
    }

    /**
     * Show file browser modal
     */
    async showFileBrowser() {
        const modal = document.getElementById('file-browser-modal');
        if (!modal) return;

        // Show modal
        modal.style.display = 'flex';
        
        // Reset state
        this.tempSelectedFiles = [];
        this.allFileList = []; // Track all available files for Select All
        this.updateSelectedFilesPreview();
        this.updateSelectionCounter();
        
        // Load file tree
        await this.loadFileTree();
        
        // Setup Select All button
        this.setupSelectAllButton();
    }

    /**
     * Setup Select All button functionality
     */
    setupSelectAllButton() {
        const selectAllBtn = document.getElementById('select-all-btn');
        if (selectAllBtn) {
            selectAllBtn.onclick = () => this.toggleSelectAll();
        }
    }

    /**
     * Toggle Select All functionality
     */
    toggleSelectAll() {
        const allSelected = this.tempSelectedFiles.length === this.allFileList.length;
        
        if (allSelected) {
            // Deselect all
            this.tempSelectedFiles = [];
            // Remove selected class from all items
            document.querySelectorAll('.file-tree-item.selected').forEach(item => {
                item.classList.remove('selected');
            });
        } else {
            // Select all
            this.tempSelectedFiles = [...this.allFileList];
            // Add selected class to all items
            document.querySelectorAll('.file-tree-item').forEach(item => {
                const path = item.getAttribute('data-path');
                if (path && this.allFileList.includes(path)) {
                    item.classList.add('selected');
                }
            });
        }
        
        this.updateSelectedFilesPreview();
        this.updateSelectionCounter();
        this.updateSelectAllButton();
        
        // Update select button
        const selectBtn = document.getElementById('select-files-btn');
        if (selectBtn) {
            selectBtn.disabled = this.tempSelectedFiles.length === 0;
        }
    }

    /**
     * Update Select All button text and state
     */
    updateSelectAllButton() {
        const selectAllBtn = document.getElementById('select-all-btn');
        const counter = document.getElementById('selection-counter');
        
        if (!selectAllBtn) return;
        
        const allSelected = this.tempSelectedFiles.length === this.allFileList.length;
        const hasSelection = this.tempSelectedFiles.length > 0;
        
        if (allSelected && hasSelection) {
            selectAllBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="20 6L9 17l-5-5"/>
                </svg>
                Deselect All
                <span class="selection-counter">${this.tempSelectedFiles.length}</span>
            `;
        } else {
            selectAllBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="9 11l3 3l8-8"/>
                    <path d="21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9s4.03-9 9-9c1.59 0 3.07.41 4.36 1.14"/>
                </svg>
                Select All
                ${hasSelection ? `<span class="selection-counter">${this.tempSelectedFiles.length}</span>` : ''}
            `;
        }
    }

    /**
     * Update selection counter displays
     */
    updateSelectionCounter() {
        const selectedCount = document.getElementById('selected-count');
        
        if (selectedCount) {
            if (this.tempSelectedFiles.length > 0) {
                selectedCount.textContent = this.tempSelectedFiles.length;
                selectedCount.style.display = 'inline';
            } else {
                selectedCount.style.display = 'none';
            }
        }
        
        this.updateSelectAllButton();
    }

    /**
     * Hide file browser modal
     */
    hideFileBrowser() {
        const modal = document.getElementById('file-browser-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    /**
     * Close file browser (alias for hideFileBrowser)
     */
    closeFileBrowser() {
        // Save the temporary selections before closing
        if (this.tempSelectedFiles.length > 0) {
            this.selectedFiles = [...this.tempSelectedFiles];
            this.renderFileChips();
        }
        this.hideFileBrowser();
    }

    /**
     * Load workspace file tree
     */
    async loadFileTree() {
        const container = document.getElementById('file-tree');
        if (!container) return;

        try {
            // Show loading state
            container.innerHTML = `
                <div class="loading-state">
                    <div class="spinner"></div>
                    <div>Loading workspace files...</div>
                </div>
            `;

            // Always use REST API fallback for reliability
            console.log('🔍 Loading file tree via REST API');
            const response = await fetch('/api/files');
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            const fileTree = await response.json();
            console.log('📁 File tree loaded:', Object.keys(fileTree).length, 'items');
            this.renderFileTree(fileTree);
            
            // Also try WebSocket as secondary method
            if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
                console.log('📤 Also requesting via WebSocket');
                this.websocket.send(JSON.stringify({
                    type: 'get_file_tree'
                }));
            }
        } catch (error) {
            console.error('Error loading file tree:', error);
            container.innerHTML = `
                <div class="loading-state">
                    <div style="color: #ff6b6b;">Error loading files</div>
                    <div style="font-size: 12px; color: #666;">${error.message}</div>
                </div>
            `;
        }
    }

    /**
     * 🎯 MINIMALIST FILE BROWSER - Clean & Simple
     */
    
    /**
     * Render file tree structure - Clean version
     */
    renderFileTree(fileTree, container = null, path = '') {
        if (!container) {
            container = document.getElementById('file-tree');
            container.innerHTML = '';
            this.allFileList = [];
            this.collectAllFiles(fileTree);
        }

        for (const [name, item] of Object.entries(fileTree)) {
            const fullPath = path ? `${path}/${name}` : name;
            const element = this.createFileTreeItem(name, item, fullPath);
            container.appendChild(element);
        }
    }

    /**
     * Collect all files for Select All functionality
     */
    collectAllFiles(fileTree, path = '') {
        for (const [name, item] of Object.entries(fileTree)) {
            const fullPath = path ? `${path}/${name}` : name;
            this.allFileList.push(fullPath);
            
            if (item.type === 'directory' && item.children) {
                this.collectAllFiles(item.children, fullPath);
            }
        }
    }

    /**
     * Create clean file tree item element
     */
    createFileTreeItem(name, item, fullPath) {
        const div = document.createElement('div');
        div.setAttribute('data-path', fullPath);
        div.className = `file-tree-item ${item.type}`;
        
        if (item.type === 'directory') {
            div.innerHTML = `
                <span class="icon">📁</span>
                <span class="name">${this.escapeHtml(name)}</span>
            `;
            
            div.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleSelection(fullPath, div, item);
            });
            
            if (item.children && Object.keys(item.children).length > 0) {
                const childrenContainer = document.createElement('div');
                childrenContainer.className = 'file-tree-children';
                this.renderFileTree(item.children, childrenContainer, fullPath);
                div.appendChild(childrenContainer);
            }
        } else {
            div.innerHTML = `
                <span class="icon">📄</span>
                <span class="name">${this.escapeHtml(name)}</span>
                <span class="size">${this.formatFileSize(item.size)}</span>
            `;
            
            div.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleSelection(fullPath, div);
            });
        }
        
        return div;
    }

    /**
     * Simple toggle selection for both files and folders
     */
    toggleSelection(path, element, item = null) {
        const index = this.tempSelectedFiles.indexOf(path);
        
        if (index === -1) {
            this.tempSelectedFiles.push(path);
            element.classList.add('selected');
            
            // If it's a directory, add all its children
            if (item && item.type === 'directory' && item.children) {
                this.addDirectoryChildren(item.children, path);
            }
        } else {
            this.tempSelectedFiles.splice(index, 1);
            element.classList.remove('selected');
            
            // If it's a directory, remove all its children
            if (item && item.type === 'directory' && item.children) {
                this.removeDirectoryChildren(item.children, path);
            }
        }
        
        this.updateSelectedFilesPreview();
        this.updateSelectionCounter();
    }

    /**
     * Add directory children to selection
     */
    addDirectoryChildren(children, parentPath) {
        for (const [name, item] of Object.entries(children)) {
            const childPath = `${parentPath}/${name}`;
            if (!this.tempSelectedFiles.includes(childPath)) {
                this.tempSelectedFiles.push(childPath);
            }
            
            if (item.type === 'directory' && item.children) {
                this.addDirectoryChildren(item.children, childPath);
            }
        }
    }

    /**
     * Remove directory children from selection
     */
    removeDirectoryChildren(children, parentPath) {
        for (const [name, item] of Object.entries(children)) {
            const childPath = `${parentPath}/${name}`;
            const index = this.tempSelectedFiles.indexOf(childPath);
            if (index !== -1) {
                this.tempSelectedFiles.splice(index, 1);
            }
            
            if (item.type === 'directory' && item.children) {
                this.removeDirectoryChildren(item.children, childPath);
            }
        }
    }
        
            /**
     * Update selection counter
     */
    updateSelectionCounter() {
        const counter = document.getElementById('selection-counter');
        if (counter) {
            counter.textContent = this.tempSelectedFiles.length;
        }
        
        // Enable/disable select button
        const selectBtn = document.getElementById('select-files-btn');
        if (selectBtn) {
            selectBtn.disabled = this.tempSelectedFiles.length === 0;
        }
    }

    /**
     * Update selected files preview - Clean version
     */
    updateSelectedFilesPreview() {
        const listContainer = document.getElementById('selected-files-list');
        if (!listContainer) return;

        if (this.tempSelectedFiles.length === 0) {
            listContainer.innerHTML = '<div class="no-selection">No files selected</div>';
            return;
        }

        listContainer.innerHTML = this.tempSelectedFiles.map((filePath, index) => `
            <div class="selected-file-item">
                <span class="file-path">${this.escapeHtml(filePath)}</span>
                <button class="remove-btn" onclick="taskMonitor.removeFileFromSelection(${index})" title="Remove">×</button>
            </div>
        `).join('');
    }

    /**
     * Remove file from selection
     */
    removeFileFromSelection(index) {
        if (index >= 0 && index < this.tempSelectedFiles.length) {
            this.tempSelectedFiles.splice(index, 1);
            this.updateSelectedFilesPreview();
            this.updateSelectionCounter();
            
            // Update UI to reflect removal
            const elements = document.querySelectorAll('.file-tree-item.selected');
            elements.forEach(el => {
                const path = el.getAttribute('data-path');
                if (!this.tempSelectedFiles.includes(path)) {
                    el.classList.remove('selected');
                }
            });
        }
    }

    /**
     * Confirm file selection 
     */
    confirmFileSelection() {
        if (this.tempSelectedFiles.length > 0) {
            this.selectedFiles = [...this.tempSelectedFiles];
            this.renderFileChips();
            this.closeFileBrowser();
        }
    }

    /**
     * Format file size for display
     */
    formatFileSize(bytes) {
        if (!bytes) return '';
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i)) + sizes[i];
    }

    /**
     * Render file chips in the main UI
     */
    renderFileChips() {
        const container = document.querySelector('.file-chips');
        if (!container) return;

        if (this.selectedFiles.length === 0) {
            container.innerHTML = '';
            return;
        }

        container.innerHTML = this.selectedFiles.map((file, index) => `
            <div class="file-chip">
                <span class="file-name">${this.escapeHtml(file)}</span>
                <button class="remove-chip" data-index="${index}" title="Remove">×</button>
            </div>
        `).join('');
        
        // Add event listeners to remove buttons
        container.querySelectorAll('.remove-chip').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.getAttribute('data-index'));
                this.removeFile(index);
            });
        });
    }

    /**
     * Remove file from main selection
     */
    removeFile(index) {
        if (index >= 0 && index < this.selectedFiles.length) {
            this.selectedFiles.splice(index, 1);
            this.renderFileChips();
        }
    }

    /**
     * Show notification message
     */
    showNotification(message, type = 'info') {
        console.log(`${type.toUpperCase()}: ${message}`);
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed; top: 20px; right: 20px; z-index: 10000;
            padding: 12px 16px; border-radius: 6px; color: white;
            background: ${type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#3b82f6'};
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    /**
     * Cleanup function
     */
    cleanup() {
        if (this.websocket) {
            this.websocket.close();
        }
    }

    /**
     * Escape HTML for safe display
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Recursively add directory contents
     */
    addDirectoryContents(children, basePath) {
        for (const [name, child] of Object.entries(children)) {
            const childPath = `${basePath}/${name}`;
            
            if (!this.tempSelectedFiles.includes(childPath)) {
                this.tempSelectedFiles.push(childPath);
            }
            
            if (child.type === 'directory' && child.children) {
                this.addDirectoryContents(child.children, childPath);
            }
        }
    }

    /**
     * Recursively remove directory contents
     */
    removeDirectoryContents(children, basePath) {
        for (const [name, child] of Object.entries(children)) {
            const childPath = `${basePath}/${name}`;
            
            const index = this.tempSelectedFiles.indexOf(childPath);
            if (index !== -1) {
                this.tempSelectedFiles.splice(index, 1);
            }
            
            if (child.type === 'directory' && child.children) {
                this.removeDirectoryContents(child.children, childPath);
            }
        }
    }

    /**
     * Update selection UI for all elements
     */
    updateSelectionUI() {
        document.querySelectorAll('.file-tree-item').forEach(item => {
            const path = item.getAttribute('data-path');
            if (path) {
                if (this.tempSelectedFiles.includes(path)) {
                    item.classList.add('selected');
                } else {
                    item.classList.remove('selected');
                }
            }
        });
    }

    /**
     * Update selected files preview
     */
    updateSelectedFilesPreview() {
        const container = document.getElementById('selected-files-list');
        if (!container) return;

        if (this.tempSelectedFiles.length === 0) {
            container.innerHTML = '<div class="no-selection">🔍 Click files and folders to select them for your task</div>';
            return;
        }

        const html = this.tempSelectedFiles.map((filePath, index) => {
            const isDirectory = this.isDirectoryPath(filePath);
            const icon = isDirectory ? '📁' : '📄';
            return `
                <div class="selected-file-item">
                    <span class="file-path">${icon} ${this.escapeHtml(filePath)}</span>
                    <button class="remove-btn" onclick="taskMonitor.removeFileFromSelection(${index})" title="Remove">
                        ×
                    </button>
                </div>
            `;
        }).join('');

        container.innerHTML = html;
    }

    /**
     * Check if a path is a directory based on file tree data
     */
    isDirectoryPath(path) {
        // Simple heuristic: if it doesn't have an extension, it's likely a directory
        const pathParts = path.split('/');
        const fileName = pathParts[pathParts.length - 1];
        return !fileName.includes('.') || path === 'venv' || path === 'backend' || path === 'frontend' || path === 'tasksync';
    }

    /**
     * Remove file from temporary selection
     */
    removeFileFromSelection(index) {
        const filePath = this.tempSelectedFiles[index];
        this.tempSelectedFiles.splice(index, 1);
        
        // Update UI
        const fileElement = document.querySelector(`[data-path="${filePath}"]`);
        if (fileElement) {
            fileElement.classList.remove('selected');
        }
        
        this.updateSelectedFilesPreview();
        this.updateSelectionCounter();
        
        // Update select button
        const selectBtn = document.getElementById('select-files-btn');
        if (selectBtn) {
            selectBtn.disabled = this.tempSelectedFiles.length === 0;
        }
    }

    /**
     * Confirm file selection and auto-add to tasks.md
     */
    confirmFileSelection() {
        // Add selected files to the main list
        for (const filePath of this.tempSelectedFiles) {
            if (!this.selectedFiles.includes(filePath)) {
                this.selectedFiles.push(filePath);
            }
        }
        
        // Update the main UI
        this.renderFileChips();
        
        // Close modal
        this.hideFileBrowser();
        
        // Clear temporary selection
        this.tempSelectedFiles = [];
    }

    /**
     * Auto-add selected files to tasks.md
     */
    /**
     * Format file size for display
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }
    
    /**
     * File selection handling (legacy method - now unused)
     */
    handleFileSelection() {
        // Simple file reference input for now
        const fileInput = prompt('Enter file path (relative to workspace):');
        if (fileInput && fileInput.trim()) {
            this.selectedFiles.push(fileInput.trim());
            this.renderFileChips();
        }
    }
    
    /**
     * Render file chips
     */
    renderFileChips() {
        const container = document.getElementById('file-chips');
        if (!container) return;
        
        if (this.selectedFiles.length === 0) {
            container.innerHTML = '';
            return;
        }
        
        const chipsHtml = this.selectedFiles.map((file, index) => `
            <div class="file-chip">
                <span>${this.escapeHtml(file)}</span>
                <button class="file-chip-remove" data-index="${index}" title="Remove file">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
            </div>
        `).join('');
        
        container.innerHTML = chipsHtml;
        
        // Add event listeners to remove buttons
        container.querySelectorAll('.file-chip-remove').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.getAttribute('data-index'));
                this.removeFile(index);
            });
        });
    }
    
    /**
     * Remove file from selection
     */
    removeFile(index) {
        this.selectedFiles.splice(index, 1);
        this.renderFileChips();
    }
    
    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        // Simple notification - could be enhanced with a proper notification system
        console.log(`[${type.toUpperCase()}] ${message}`);
        
        // Add to log as well
        const icon = {
            'info': 'ℹ️',
            'success': '✅',
            'warning': '⚠️',
            'error': '❌'
        }[type] || 'ℹ️';
        
        this.addLogEntry(`${icon} ${message}`);
    }
    
    /**
     * Initialize theme on page load
     */
    initializeTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        this.setTheme(savedTheme);
    }
    
    /**
     * Toggle between light and dark theme
     */
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }
    
    /**
     * Set theme and update UI
     */
    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Update theme toggle icon
        const darkIcon = document.querySelector('.theme-icon-dark');
        const lightIcon = document.querySelector('.theme-icon-light');
        
        if (darkIcon && lightIcon) {
            if (theme === 'light') {
                darkIcon.style.display = 'none';
                lightIcon.style.display = 'block';
            } else {
                darkIcon.style.display = 'block';
                lightIcon.style.display = 'none';
            }
        }
    }
    
    /**
     * Cleanup resources
     */
    cleanup() {
        if (this.websocket) {
            this.websocket.close();
        }
    }
    
    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Global reference for event handlers
let taskMonitor;

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    taskMonitor = new TaskSyncMonitor();
    taskMonitor.initializeTheme(); // Initialize theme on page load
    taskMonitor.start();
});