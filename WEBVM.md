# eBPF Low-Code Builder on WebVM.io

This guide explains how to run the eBPF Low-Code Builder on [WebVM.io](https://webvm.io/), a free Linux environment that runs entirely in your browser.

## 🌐 What is WebVM?

WebVM.io is a virtual Linux system that runs in your browser using JavaScript. It allows you to:
- Run Node.js applications
- Access npm packages
- Clone Git repositories
- No installation or configuration needed

## 🚀 Quick Start

### Step 1: Open WebVM
Visit [https://webvm.io/](https://webvm.io/) in your browser.

### Step 2: Clone the Repository
```bash
git clone https://github.com/qweralfredo/ebpf-design.git
cd ebpf-design
```

### Step 3: Install Dependencies
```bash
npm install
```

This will install all required packages:
- React 18.3.1
- @xyflow/react (ReactFlow)
- Vite
- Tailwind CSS
- And other dependencies

### Step 4: Start the Development Server
```bash
npm run dev
```

You'll see output similar to:
```
  VITE v5.4.10  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### Step 5: Access the Application
Click on the local URL or copy it into WebVM's browser. The application will open in the WebVM browser interface.

## 📝 Usage in WebVM

Once the application is running, you can:

1. **Create eBPF Programs**: Drag and drop nodes to build your eBPF programs
2. **Generate Code**: Click the "Generate eBPF Code" button to create C code
3. **Download Files**: Export your program and configuration files
4. **Use Templates**: Load predefined eBPF program templates
5. **AI-Powered Building**: Use the AI builder for guided program creation

## ⚙️ Build for Production in WebVM

To create an optimized production build:

```bash
npm run build
```

The optimized files will be in the `dist/` folder.

## 🔧 Troubleshooting

### Port Already in Use
If port 5173 is already in use, Vite will automatically try the next available port. Check the output for the correct URL.

### Memory Issues
WebVM has limited memory. If you experience issues:
- Clear browser cache
- Close other browser tabs
- Restart WebVM

### Git Clone Fails
Ensure you have internet connection and the repository URL is correct.

## 💾 Saving Your Work

### Option 1: Download Your Files
```bash
npm run build
# Download the entire dist/ folder or individual files
```

### Option 2: Save to GitHub
Create a fork and commit your changes:
```bash
git config user.email "your-email@example.com"
git config user.name "Your Name"
git add .
git commit -m "My custom eBPF programs"
git push
```

### Option 3: Export as Docker
Build and push a Docker image:
```bash
docker build -t your-username/ebpf-design .
docker push your-username/ebpf-design
```

## 🌟 Advantages of Using WebVM

✅ **Zero Setup** - No Docker, no Node.js installation needed  
✅ **Fast Access** - Start working immediately in your browser  
✅ **Accessible** - Works on any device with a modern browser  
✅ **Educational** - Perfect for learning and experimentation  
✅ **Safe** - Everything runs in an isolated environment  
✅ **Persistent** - Save your work between sessions  

## 🔗 Useful Links

- [WebVM.io Official Site](https://webvm.io/)
- [eBPF Low-Code Builder Repository](https://github.com/qweralfredo/ebpf-design)
- [eBPF Documentation](https://ebpf.io/)
- [ReactFlow Documentation](https://reactflow.dev/)

## 📞 Support

If you encounter issues:
1. Check the browser console for error messages
2. Try refreshing the page
3. Restart WebVM if needed
4. Open an issue on [GitHub](https://github.com/qweralfredo/ebpf-design/issues)

---

**Happy eBPF programming with WebVM! 🎉**
