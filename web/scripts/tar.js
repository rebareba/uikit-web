/*
 * @Author: changfeng
 * @LastEditors: changfeng
 * @LastEditTime: 2023-05-05 18:25:58
 * @Description: node 读取dist 中的文件进行压缩打包
 */

const config = require('../config')
const fs = require('fs')
const path = require('path')
const {exec} = require('child_process')
// 部署服务器地址：
const host = config.deployHost || '127.0.0.1'
// 获取环境变量 CI_COMMIT_REF_NAME
const branch = process.env.CI_COMMIT_REF_NAME || ''
if (!branch) {
  console.log('未获取到CI_COMMIT_REF_NAME环境变量，无法获取到分支名称，或tag名称,打包文件名将忽略该信息')
  console.log('可以通过这样执行: export CI_COMMIT_REF_NAME=1.0.0buildx && pnpm build && unset CI_COMMIT_REF_NAME')
}

const fileName = `${config.projectName}${branch? `_${branch}` : ''}_${config.version}.tgz`

console.log(`开始打包：${fileName}`)

;(async () => {
  const dir = path.join(__dirname, `../dist/${config.projectName}/${config.version}/`)

  const list = fs.readdirSync(dir)
  list.forEach((file) => {
    if (/\.html$/.test(file)) {
      fs.copyFileSync(path.join(dir, file), path.join(__dirname, `../dist/${config.projectName}/${file}`))
    }
  })
  if (process.platform !== 'win32') {
    // 打包
    exec(`cd dist && tar czf ${fileName} public ${config.projectName}`, (error) => {
      if (error) {
        console.error(`exec error: ${error}`)
        return
      }
    })
  }
  if (!config.nexusDir) {
    console.log('未配置Nexus上传的路径可以配置文件配置nexusDir: "https://域名/repository/raw-hosted/模块/模块版本/front/项目名/"')
  }
  if (!config.nexusAuth) {
    console.log('未配置Nexus上传的账号密码可以配置文件配置nexusAuth: "username:password"')
  }
  const filePath = path.join(__dirname, `../dist/${fileName}`)


  const nexusAuth = config.nexusAuth || 'username:password'
  const nexusDir = config.nexusDir || `https://域名/repository/raw-hosted/xxx/x.x.x/front/${config.projectName}/`
  const fullUrl = `${nexusDir}${fileName}`

  console.log(`执行上传部署：scp -r dist/${config.projectName} deploy@${host}:/opt/workspace/front`)
  console.log(`第一次部署需要上传public内容：scp -r dist/public deploy@${host}:/opt/workspace/front`)
  console.log(`或上传压缩包解压：scp ${filePath} deploy@${host}:/opt/workspace/front`)
  console.log(`可以通过curl上传到Nexus：curl -v -u ${nexusAuth} --upload-file  ${filePath} ${fullUrl}`)
  console.log(`Nexus下载地址：${fullUrl.replace('raw-hosted', 'raw-group').replace('https://nexus.com', 'http://10.0.0.16:8081')}`)
  console.log('打包成功：'+ filePath)
  console.log('...')
  console.log('..')
  console.log('.')
})()
