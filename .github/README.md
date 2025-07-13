# TaskSync for GitHub Copilot (VS Code)

**Maximize your GitHub Copilot premium usage with autonomous AI task monitoring.**

VS Code implementation provides `.github/instructions/` integration with GitHub Copilot for continuous task monitoring and execution - **saving you hundreds of premium requests**.

---

## 📁 What's Included

- **`tasksync.instructions.md`**:  TaskSync protocol rules for copilot
- **`tasks.txt`**: Example task file for REAL-TIME communication (edit anytime)
- **`README.md`**: This setup guide and documentation

## 🛠️ How It Works

### TaskSync Protocol Features

- **Autonomous Task Execution**: AI executes tasks independently while monitoring for new instructions
- **File Monitoring**: Checks `tasks.txt` every 60 seconds during active work
- **State Management**: Three-state operational framework (Active/Monitoring/Terminating)
- **Universal Compatibility**: Works with any AI coding assistant or IDE

### Operational States

1. **Active Task Execution**
   - AI focuses on current task with full attention
   - Monitors `tasks.txt` every 60 seconds
   - Continues work between monitoring intervals

2. **Completion & User Input Monitoring**
   - Provides task completion summary
   - Continuously monitors `tasks.txt` for new instructions
   - 5-minute timeout for session termination

3. **Session Termination**
   - Graceful ending with work summary
   - Clean session closure

## 📝 Using tasks.txt (Real-Time Communication)

Edit the `tasks.txt` file anytime to give new instructions to your AI assistant:

```text
# Add new tasks or corrections here
Create a responsive web application
Implement comprehensive testing
Optimize performance and accessibility
```

Your AI assistant will automatically detect changes and integrate new instructions into its workflow.

## 🔧 Integration Methods

### IDE-Specific Implementations

For optimized experiences, use the dedicated implementations:

- **[Cursor](../cursor/)**: Native `.cursorrules` integration
- **[VS Code Copilot](../copilot/)**: Github Instructions

### Manual Integration

Copy the contents of `global_rules.md` into your IDE's rule system:

#### VS Code Extensions
```markdown
<!-- Copy global_rules.md content into your extension's prompt -->
```

#### GitHub Copilot
```markdown
<!-- Add as system prompt or workspace rules -->
```

#### Other AI Assistants
```markdown
<!-- Adapt the protocol for your specific AI tool -->
```

## 📚 Examples

### Web Application Development

Edit `tasks.txt`:

```text
Create a modern web application:
1. Set up project structure
2. Implement authentication
3. Create responsive UI components
4. Add comprehensive testing
5. Deploy to production
```

### API Development

Edit `tasks.txt`:

```text
Build RESTful API with:
- OpenAPI documentation
- Input validation and security
- Database integration
- Rate limiting and monitoring
- Comprehensive testing
```

### Mobile Development

Edit `tasks.txt`:

```text
Develop mobile application:
- Cross-platform compatibility
- Offline functionality
- Push notifications
- App store optimization
```

## 🆘 Troubleshooting

### AI Not Following Protocol

1. Ensure `global_rules.md` content is properly integrated
2. Check that your AI assistant supports custom rules
3. Verify the `tasks.txt` file is accessible
4. Test with simple instructions first

### Integration Issues

1. Confirm rule syntax matches your IDE's format
2. Check for conflicts with existing rules
3. Verify file permissions and accessibility
4. Restart your development environment

## 🔄 Updates

Keep your TaskSync implementation current:

1. **Check for updates** in the main repository
2. **Backup your customizations** before updating
3. **Merge new features** while preserving your project-specific rules
---

**Ready to start?** Edit the `tasks.txt` file and experience autonomous AI development across any platform!
