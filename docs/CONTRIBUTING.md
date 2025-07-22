# Contributing to TaskSync V3

Thank you for your interest in contributing to TaskSync V3! This guide will help you get started with development, coding standards, and submission guidelines for the enhanced autonomous agent protocol with dual-mode operation.

---

## 🚀 Quick Start for Contributors

### Development Setup

1. **Fork and clone the repository:**

   ```bash
   git clone https://github.com/your-username/TaskSync.git
   cd TaskSync
   ```

2. **Create a development branch:**

   ```bash
   git checkout -b feature/your-contribution
   ```

3. **Test both modes:**

   **File-Based Mode:**
   - Copy the appropriate protocol file to your AI assistant
   - Create a test `tasks.md` file
   - Verify infinite monitoring and status logging functionality

   **TaskSyncUI Mode:**
   - Run `python TaskSyncUI/start.py`
   - Test the web interface at `http://localhost:8000`
   - Verify WebSocket real-time updates
   - Test cross-platform terminal integration

### Project Structure

```text
TaskSync/
├── .cursor/          # Cursor IDE implementation files
├── .github/          # GitHub Copilot implementation files  
├── .global/          # Universal implementation files
├── TaskSyncUI/       # Web interface for TaskSync V3
│   ├── backend/      # FastAPI server with WebSocket support
│   ├── frontend/     # Modern web interface
│   └── start.py      # Launch script
├── docs/             # Complete protocol documentation
│   ├── PROTOCOL.md   # Core protocol specification
│   ├── USAGE.md      # Implementation guide
│   ├── EXAMPLES.md   # Workflow examples
│   └── CHANGELOG.md  # Version history
├── LICENSE           # MIT License
└── README.md         # Project overview
```

---

## 🔧 Development Guidelines

### Protocol Standards

- **Dual-Mode Operation**: All implementations must support both file-based and TaskSyncUI modes
- **Infinite Monitoring**: Continuous operation without automatic termination
- **Cross-Platform Compatibility**: Windows, macOS, Linux support
- **WebSocket Integration**: Real-time updates for UI mode
- **Dual File System**: Mandatory separation between `tasks.md` (instructions) and `log.md` (monitoring)
- **Enhanced Session Persistence**: Maintain state across IDE restarts
- **Complete File Reading**: Minimum 1000 lines per read operation
- **Error Handling**: Robust error recovery with continuous operation
- **Manual Termination**: Only explicit user termination commands allowed

### Documentation Requirements

- **Protocol Compliance**: All changes must align with V3 specifications
- **Dual-Mode Examples**: Include working examples for both file-based and TaskSyncUI modes
- **Usage Documentation**: Update USAGE.md for new features and TaskSyncUI integration
- **TaskSyncUI Documentation**: Document web interface features and WebSocket functionality
- **Changelog Entries**: Document all changes with version numbers
- **Cross-Platform Notes**: Include OS-specific instructions where applicable

---

## 🐛 Bug Reports

### Required Information

1. **Protocol Version**: TaskSync V3 mode (file-based or TaskSyncUI)
2. **AI Assistant**: Which coding IDE/assistant (Copilot, Cursor, Kiro, etc.)
3. **Operating System**: Windows, macOS, Linux (with version details)
4. **Mode Used**: File-based or TaskSyncUI web interface
5. **Reproduction Steps**: Exact steps to reproduce the issue
6. **Expected Behavior**: What should happen according to V3 protocol
7. **Actual Behavior**: What actually happened
8. **Status Logs**: Include relevant log entries from tasks.md and TaskSyncUI console
9. **WebSocket Errors**: If using TaskSyncUI, include browser console errors
10. **Check Counts**: Report last check number if monitoring failed

---

## 🌟 Feature Requests

### Enhancement Guidelines

- **Dual-Mode Compatibility**: Must work with both file-based and TaskSyncUI modes
- **Cross-Platform Support**: Should work across Windows, macOS, Linux
- **WebSocket Integration**: Consider real-time update implications
- **Backward Compatibility**: Maintain compatibility with V1/V2 protocols
- **Documentation Impact**: Consider documentation update requirements
- **UI/UX Considerations**: How feature affects TaskSyncUI interface

### Request Template

1. **Feature Description**: Clear explanation of proposed feature
2. **Use Case**: Real-world scenario where feature is needed
3. **Mode Compatibility**: How it works with file-based and TaskSyncUI modes
4. **Protocol Integration**: How it fits with current V3 protocol
5. **Implementation Ideas**: Suggested approach or solution
6. **TaskSyncUI Impact**: How feature affects web interface
7. **Cross-Platform Considerations**: OS-specific requirements
8. **Documentation Changes**: Which docs need updates
---

## 📄 License

By contributing to TaskSync, you agree that your contributions will be licensed under the MIT License.

---

## 🤝 Community Guidelines

- **Respectful Communication**: Be kind and professional
- **Collaborative Spirit**: Help others understand the protocol
- **Quality Focus**: Prioritize protocol reliability and accuracy
- **Documentation First**: Always update docs with code changes

Thank you for helping make TaskSync better! 🚀
