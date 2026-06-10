#!/bin/bash
# 打 开发包
# eg sh ./deploy.sh
# 打 提测包
# eg: sh ./deploy.sh tag_name

package_name="uikit"
rm -rf dist
# 打包命令
pnpm build

# 判断是否有tag_name
if [ x$1 != x ]
then
  #...有参数
  tar_name="${package_name}-web-$1.tgz"
  mkdir -p dist/${package_name}/$1
  cp -r uikit/dist/* dist/${package_name}/$1/
  cp -r uikit/dist/* dist/${package_name}/
else
  #...没有参数
  tar_name="${package_name}.tgz"
  mkdir -p dist/${package_name}
  cp -r uikit/dist/* dist/${package_name}/
fi

# 如果文件不存在，则创建文件夹
if [ ! -d "tgz" ]; then
  mkdir -p tgz
fi

# 复制dist文件夹到tgz下
cd dist/

# 压缩
tar -zcvf ../tgz/$tar_name $package_name/

echo "打包完成，文件名：$tar_name"
echo "curl -v -u username:password --upload-file tgz/$tar_name  https://nexus.com/repository/raw-hosted/core/front/uikit/$tar_name"

# node ./auto_deploy/index.js

