## 华廷前端项目模板

### 目录说明

```bash
├── .eslintrc.js	# eslint 的 配置
├── .gitignore		
├── .husky				# husky 配置目录
│   ├── _
│   ├── commit-msg	# commit 规范校验
│   └── pre-commit	# eslint 校验
├── .prettierignore	# prettier 的忽略配置
├── .prettierrc.js	# prettier 的配置
├── .vscode
│   └── settings.json
├── Dockerfile   # 制作docker镜像
├── README.md		 # 项目说明
├── chart				 # 发布到Helm的项目
│   ├── Chart.yaml
│   ├── helm.md
│   ├── templates
│   └── values.yaml
├── commitlint.config.js # commit 规范配置
├── k8s									 # 发布到k8s的示例配置
│   ├── deployment.yaml
│   ├── ingress.yaml
│   └── service.yaml
├── package.json				 		 
├── packages						 # pnpm 配置monorepo的包列表
│   ├── common					 # @cf/common  
│   ├── components			 # @huatin/components 业务无关的公共组件 
│   └── utils						 # @huatin/utils 通用工具
├── pnpm-lock.yaml
├── pnpm-workspace.yaml	 # pnpm的monorepo配置
├── tsconfig.json				 # typescript配置
├── demo-web						 # 示例项目，里面包含示例的页面实现
│   ├── src
│   └── package.json
└── web									 # 开发项目									
    ├── src
    ├── tailwind.config.js
    ├── tsconfig.json
    └── package.json
```

### 常用命令

`Nodejs >= 18`

```ruby
// 安装
$ pnpm install
// 启动开发
$pnpm start
// 启动示例页面
$pnpm demo
// 打包
$ pnpm build
> node ./scripts/tar.js

打包成功：
执行上传部署：scp -r dist/web deploy@127.0.0.1:/opt/workspace/front
第一次部署需要上传public内容：scp -r dist/public deploy@127.0.0.1:/opt/workspace/front
或上传压缩包解压：scp dist/web_1.0.0_public.tgz deploy@127.0.0.1:/opt/workspace/front

// eslint校验
$pnpm lint
```

> pnpm常用命令
>
> ```
> 
> #全局安装包
> $pnpm add -w react -S
> $pnpm add -w webpack -D
> # 指定项目安装
> $pnpm --filter web add tailwindcss -D
> # 卸载 
> $pnpm uninstall typescript
> 
> ```



### 项目配置

1. 修改package.json 和 web/package.json 中相关的name
2. 复制web/config/config_default.js 大屏`web/config/config.js` 作为本地开发配置

#### 配置说明

```js
const pkg = require('../package.json')

// 可以新建config/config.js 来配置本地的配置项来覆盖

module.exports = {
  projectName: pkg.name,
  version: pkg.version,
  // build情况下打包输出的output.path是`dist/${config.projectName}/${config.version}`
  // 取值 . 一般是使用hash路由, //cdn.xxx.com 是资源上传到cdn的情况
  publicPathHost: '', // 最终build情况下output.publicPath对应的路径为`${config.publicHost}/${config.projectName}/${config.version}`
  port: 3001, // 端口
  analyzerPort: 8888, // 打包分析的端口 npm run analyzer
  // 接口匹配转发 devServer.proxy
  proxy: [
    {
      context: ['/api'],
      target: 'http://localhost:3000',
      // pathRewrite: { '^/api': '' },
      changeOrigin: true, // 支持跨域请求
      secure: true,
    },
  ],
  // webpack.externals 打包忽略配置 要在index.html引入public资源
  externals: {
    // react: 'React',
    // 'react-dom': 'ReactDOM',
  },
  // 多入口情况的重定向
  rewrites: [
    // {
    //   from: /^\/admin/, to: '/admin.html'
    // },
  ],
  // 部署的服务器 在tar时候打印使用
  deployHost: '127.0.0.1',
  // 前端代码配置 动态生成config/conf.json中的数据， 也是index.html模板的数据
  conf: {
    // 开发配置
    dev: {
      title: '项目演示系统',
      pathPrefix: '',
      apiPrefix: '/api',
      debug: true,
      mockAll: true, // 所有有mock数据的接口都使用success的数据
      mock: {
        // index: 'success', // 所有global 使用success的值
        // "global.loginInfo": "success", // success failed  特殊指定loginInfo方法使用的值
      },
      // 指定index.html public资源的域名 是否是cdn的资源
      publicHost: '',
      mockDelay: 1000, // mock数据的延迟时间 单位ms
    },
    // 打包配置
    build: {
      title: '项目演示系统',
      pathPrefix: '',
      apiPrefix: '/api',
      debug: false,
      mock: {},
      // 指定public资源的域名 是否是cdn的资源
      publicHost: '',
      mockDelay: 500, // mock数据的延迟时间 单位ms
    },
  },
}

```

### 接口请求

每个页面模块下创建一个io.ts文件

```ts
// src/pages/index/io
import {createIo, IApiConf} from '@common/create-io'

export type TDeployInfoItem = {
  deployId: number
  projectId: number
  codeLinkId: number
  name: string
  template: string
  pathPrefix: string
  createUserId: number
  modifyUserId: number
  ctime: string
  mtime: string
}
const apis: Record<'searchProject' | 'generateProject', IApiConf> = {
  searchProject: {
    name: '搜索项目列表',
    method: 'POST',
    url: 'search/projects/:projectId',
  },
  generateProject: {
    method: 'POST',
    name: '生成前端脚手架',
    url: 'generate',
  },
}

export default createIo(apis, 'index')// 对应有index-mock.josn

```

### Mock实现



`npm run dev/build` 会自动在项目目录下生成`mock.json`, 是根据src目录下所有以`-mock.json`结尾的文件合成

#### mock流程定义

如存在 `login-mock.json` 可以配置一个name属性值作为接口文档生产使用

```json
// src/pages/login/login-mock.json
{
  "name": "登录模块",
  "login": {
		"failed": {
			"success": false,
			"code": "ERROR_PASS_ERROR",
			"content": null,
			"message": "账号或密码错误!"
		},
		"success": {
			"success": true,
			"code": 0,
			"content": {
				"name": "admin",
				"nickname": "超级管理员",
				"permission": 15
			},
			"message": ""
		}
	}
}
```

则生成的`mock.json`内容为

```json
{
	"login": {
		"login": {
			"success": {
				"success": true,
				"code": 0,
				"content": {
					"name": "admin",
					"nickname": "超级管理员",
					"permission": 15
				},
				"message": ""
			}
		}
	}
}
```

```js
// login-store.js
// 这里的第二个参数就是去对应 login-mock.json文件的内容
const io = createIo(apis, 'login')
```

这里`login-mock.json`对应的login有两种情况 `success` 和 `failed` 在配置文件配置使用个数据

```js
// config.js或 config_default.js
module.exports = {
  // 开发配置
  conf: {
    dev: {
			...
      debug: true,
      mockAll: false,
      // 只有配置了mock的才会使用
      mock: {
        "global": "success", // 表示global全部使用success, 下面可以特殊配置使用其他
        "global.loginInfo": "failed", // 特殊指定
        "login.login": "success" // 也可以改为failed模拟请求失败, 会热更新替换mock.json内容
      }
    },
  }
};
```

mockAll 的值 让所有请求使用success的mock值， 如果mock配置里面有指定配置则使用指定值， 如果指定的值不存在json中 则不使用mock处理


> 这是我们最终要实现的效果，这里有一个约定：**项目目录下所有以`-mock.jsom`文件结尾的文件为mock文件，且文件名不能重复**。

如何实现可以查看`script/api-proxy-cache.js`

每个mock需要新建一个xx-mock.json文件, 至少初始化内容为`{}` 或者`{"name": "模块名称"}`

#### 通过请求缓存回流mock文件

根据api-cache缓存的后端接口信息和对应的xx-mock.json文件添加mock数据到xx-mock.json

```bash
# 所有：
npm run build-mock mockAll 
# 单个mock文件：
npm run build-mock login
# 单个mock接口：
npm run build-mock login.logout
# 混合
npm run build-mock login.logout user
```

#### 通过mock配置文件生成API文档

通过mock的json文件来生成接口文档 

```sh
# 默认生产API.md
npm run build-api
# 指定文件名 api-doc.md
npm run build-api api-doc.md
```



### Nginx部署

假设Nginx web目录在`/opt/workspace/front`上传打包的静态文件到该目录下

nginx配置

```nginx
root@server01:~# cat /opt/third/nginx/conf/vhosts/demo.conf
#upstream api {
#    server 192.168.90.24:8886 max_fails=3 fail_timeout=5;
#}

server {
    listen  80 default_server;
    access_log /data/nginx/logs/access.log;
    keepalive_timeout 600;
    client_header_timeout 600;
    client_body_timeout 600;
    large_client_header_buffers 4 16k;
    client_max_body_size 1000m;
    client_body_buffer_size 128k;
    fastcgi_connect_timeout 300;
    fastcgi_read_timeout 300;
    fastcgi_send_timeout 300;
    fastcgi_buffer_size 64k;
    fastcgi_buffers   4 32k;
    fastcgi_busy_buffers_size 64k;
    fastcgi_temp_file_write_size 64k;

    location = / {
        return 301 /web;  # 强制跳转，浏览器地址栏变为 `/ui-new`
    }
    location /web {
    	root /opt/workspace/front;
    	index index.html;
    }
   # location /api{
   #     proxy_read_timeout 600;
   #     proxy_connect_timeout 600;
   #     proxy_send_timeout 600;
   #     proxy_http_version 1.1;
   #     proxy_set_header Connection "";
   #     proxy_set_header X-Real-IP $remote_addr;
   #     proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
   #     proxy_pass http://api;###新网关的端口gateway-bootstrap
   # }
}
```

### Commit 规范

> 如何关联任务或需求 commit 信息 里面 #任务ID 即可 多个,隔开比如 #HOTW-38,#HOTW-37

```js
<type>(<scope>): <subject>
```

格式说明：
`<type>`(必须)：代表某次提交的类型，所有的type类型如下

- `build`：修改项目构建系统(例如 glup，webpack，rollup 的配置等)的提交
- `ci`：修改项目继续集成流程(例如 Travis，Jenkins，GitLab CI，Circle等)的提交
- `docs`：文档更新，如README, CHANGELOG等
- `feat`：新增功能
- `fix`：修复bug
- `perf`：优化相关，如提升性能、体验等
- `refactor`：重构代码，既没有新增功能，也没有修复 bug
- `style`：不影响程序逻辑的代码修改(修改空白字符，格式缩进、补全缺失的分号等)
- `test`：新增测试用例或是更新现有测试
- `revert`：回滚某个更早之前的提交
- `chore`：其他类型，如改变构建流程、或者增加依赖库、工具等

`<description>`(必须)： 描述简要描述本次改动，概述就好了

示例

```ruby
# 增加一个的导出功能
git commit -m "feat: 增加预测用户列表导出功能 #HOTW-38,#HOTW-3"
git commit -m "feat(login): 添加验证码登录功能"

# 修改了翻页bug
git commit -m "fix: 修改了预测用户翻页bug"

# 优化某某功能
git commit -m "perf: 优化了预测用户接口响应太慢"

# 修改了xx处缺少分号问题
git commit -m "style: 修改xx处缺少分号问题"
```


### UI&UE设计规范

[产品设计规范](https://jhsj-dt.yuque.com/xgkphu/cl68yg/yxavmnyxwe1igmaq)

- 通过8px、16px、24px、32px、40px、48px、56px等七种规格间距来划分信息层次； 
- 间距 xs = 8px,  sm = 16px,  md = 24px,  lg = 32px,  xl = 40px,  xxl = 48px,  xxxl = 56px
- 容器外边距 16px 容器内边距 24px
- 大标题  Medium 26pt 34H 500
- 中标题  Medium 20pt 28H 500
- 小标题  Medium 18pt 24H 500
- 标准标题 Medium 16pt 22H 400
- 正文1 大部分正文文字+导航栏的文字 Regular 14pt 20H 400
- 正文3信息牧多且需要多呈现时的正文使用+对主观进行释意的文字＋协议条款文字等 Regular 12pt 16H 400

```css
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Segoe UI,Arial, Roboto, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft Yahei", sans-serif
}
// packages/common/tokens.css 定义了token参数
```


##  问题
### husky不生效

```
 chmod -R +x .husky
 pnpm exec husky init
 ```

```bash
# 执行下看下文件权限是否有x 没有就执行chmod -R +x .husky  如果还不行看执行下 pnmp prepare
$ ls -la .husky     
total 16
drwxr-xr-x@  5 cf  staff  160  4 16 18:27 .
drwxr-xr-x  20 cf  staff  640  4 24 16:42 ..
drwxr-xr-x@ 19 cf  staff  608  4 24 16:44 _
-rwxr-xr-x@  1 cf  staff   33  4 16 18:27 commit-msg
-rwxr-xr-x@  1 cf  staff   10  4 16 18:27 pre-commit
```
### VSCode 报错不自修复

可能vscode得进程问题， 重启下ESlint 在vscode 最上方的输入框输入

```
CMD + SHIFT + P
>ESLint: Restart ESLint Server
如果还不行就找个文件验证下
>ESLint: Show Output

```