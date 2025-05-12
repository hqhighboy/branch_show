const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const { spawn } = require('child_process');
let mainWindow;
let serverProcess;

function createWindow() {
  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    icon: path.join(__dirname, 'favicon.ico')
  });

  // 启动后台服务器
  startBackendServer();

  // 加载应用
  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, '../build/index.html'),
    protocol: 'file:',
    slashes: true
  });
  
  mainWindow.loadURL(startUrl);

  // 打开开发者工具，方便调试
  if (process.env.ELECTRON_START_URL) {
    mainWindow.webContents.openDevTools();
  }

  // 当窗口关闭时触发
  mainWindow.on('closed', function () {
    mainWindow = null;
    // 关闭后台服务器
    if (serverProcess) {
      process.platform === 'win32' ? 
        spawn('taskkill', ['/pid', serverProcess.pid, '/f', '/t']) : 
        serverProcess.kill();
    }
  });
}

function startBackendServer() {
  // 启动后台服务器
  let serverPath;
  
  if (process.env.NODE_ENV === 'production') {
    // 生产环境下，服务器文件位于resources目录
    serverPath = process.platform === 'win32' 
      ? path.join(process.resourcesPath, 'server.js')
      : path.join(__dirname, '../server.js');
  } else {
    // 开发环境
    serverPath = path.join(__dirname, '../server.js');
  }
  
  console.log('Starting server from:', serverPath);
  serverProcess = spawn('node', [serverPath]);
  
  serverProcess.stdout.on('data', (data) => {
    console.log(`Server stdout: ${data}`);
  });
  
  serverProcess.stderr.on('data', (data) => {
    console.error(`Server stderr: ${data}`);
  });
  
  serverProcess.on('close', (code) => {
    console.log(`Server process exited with code ${code}`);
  });
}

// 当Electron完成初始化并准备创建浏览器窗口时调用此方法
app.whenReady().then(createWindow);

// 当所有窗口关闭时退出应用
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) createWindow();
});

// 应用退出前关闭服务器
app.on('before-quit', () => {
  if (serverProcess) {
    process.platform === 'win32' ? 
      spawn('taskkill', ['/pid', serverProcess.pid, '/f', '/t']) : 
      serverProcess.kill();
  }
}); 