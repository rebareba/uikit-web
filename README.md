# uikit-web

## uikit 组件库
### 介绍

基于 React 的 UI 组件库，提供了丰富的基础组件和业务组件，适用于后台管理系统， 作为微前端框架的基础库。 被模块联邦的方式引入

### 使用

- 会打包部署到响应的开发环境


### 开发

```
pnpm install

pnpm start

pnpm build
``` 

### 部署

- 将部署包上传到nexus的raw资源

```
curl -v -u username:password -T uikit-web-1.0.0.tgz  https://nexus.example.com/repository/npm-group/ 
```

- 在k8s中创建deployment 的initContainer 下载资源并解压到指定目录

```
apiVersion: apps/v1
kind: Deployment
```

- 通过Ingress结合service保留remoteEntry.js的访问地址

```
apiVersion: networking.k8s.io/v1
kind: Ingress
``` 
项目

## 组件使用手册

### 说明

在线的组件使用手册，提供组件的使用说明，包括使用示例，属性说明，事件说明等。

### 开发

```
pnpm install

pnpm start

pnpm build
``` 

### 部署

- 将部署包上传到nexus的raw资源

```
curl -v -u username:password --upload-file tgz/uikit-web-1.0.0.tgz  https://nexus.com/repository/raw-hosted/core/front/uikit/uikit-web-1.0.0.tgz

```

- 在k8s中创建deployment 的initContainer 下载资源并解压到指定目录

```yaml

apiVersion: apps/v1
kind: Deployment
metadata:
  name: shared-nginx-deployment
spec:
  progressDeadlineSeconds: 600
  replicas: 1
  revisionHistoryLimit: 10
  selector:
    matchLabels:
      app: shared-nginx
  template:
    metadata:
      labels:
        app: shared-nginx
    spec:
      containers:
        - env:
            - name: TZ
              value: Asia/Shanghai
          image: nginx:1.26.2
          imagePullPolicy: IfNotPresent
          name: shared-nginx
          ports:
            - containerPort: 80
              name: http
              protocol: TCP
          resources: {}
          terminationMessagePath: /dev/termination-log
          terminationMessagePolicy: File
          volumeMounts:
            - mountPath: /etc/nginx/nginx.conf
              name: default-conf-volume
              subPath: nginx.conf
            - mountPath: /opt/workspace/front/html
              name: front-volume
              subPath: html
            - mountPath: /opt/workspace/front/conf
              name: front-volume
              subPath: conf
      dnsPolicy: ClusterFirst
      initContainers:
        - command:
            - /bin/sh
            - '-c'
            - >
              set -e


              # ------------------------------

              # 全局配置

              # ------------------------------

              htmlDir="/opt/workspace/front/html"

              confDir="/opt/workspace/front/conf"

              appDir="$confDir/apps"
                
              # 初始化目录

              mkdir -p "$htmlDir/public" "$appDir"


              echo "基础目录：$htmlDir"

              echo "配置目录：$confDir"
                
              # ------------------------------

              # 功能函数：下载并解压包

              # ------------------------------

              fetch_and_unpack() {
                local pkgPath="$1"
                local repoUrl="http://10.0.0.16:8081/repository/raw-group"
                local appUrl="$repoUrl$pkgPath"
                local fileName="$(basename "$pkgPath")"
                local localPath="/tmp/$fileName"

                echo "---"
                echo "处理包: $fileName"
                echo "完整URL: $appUrl"

                http_code=$(curl -u "${NEXUS_USERNAME}:${NEXUS_PASSWORD}" \
                              -o "$localPath" \
                              -w "%{http_code}" \
                              -s "$appUrl")

                echo "下载状态: $http_code"

                if [ "$http_code" = "200" ] && [ -f "$localPath" ]; then
                  echo "下载成功，大小: $(ls -lh "$localPath" | awk '{print $5}')"
                  echo "解压到 $htmlDir ..."
                  tar -xzvf "$localPath" -C "$htmlDir"
                  rm -f "$localPath"
                  echo "处理完成: $pkgPath"
                else
                  echo "错误: $fileName 下载失败，跳过解压"
                fi
              }


              # ------------------------------

              # 处理所有包

              # ------------------------------

              echo "== 开始处理所有软件包 =="


              # 部署UAC

              fetch_and_unpack "/uac/1.0.0/front/uac-web/uac-web-1.0.1.tgz"

              # 部署数界UV

              fetch_and_unpack "/uv/1.0.0/front/uv-web/uv-web-1.0.0.tgz"

              # 部署管理后台ADMIN

              fetch_and_unpack
              "/admin/1.0.0/front/admin-web/admin-web-1.0.0.tgz"

              fetch_and_unpack "/core/front/uikit/uikit-web-1.0.0.tgz"


              echo "== 所有包处理完成 =="



              # ------------------------------

              # NGINX配置

              # ------------------------------

              ## 1.复制应用的nginx配置

              cp /config/apps/* $appDir


              ## 2.复制应用文件

              cp /config/default/config.js $htmlDir/public/


              # 3.NGINX站点配置文件（可选）

              if [ -f "/config/default/default.conf" ]; then
                cp /config/default/default.conf "$confDir"
              fi

              echo "== NGINX配置完成 =="
          env:
            - name: NEXUS_USERNAME
              valueFrom:
                secretKeyRef:
                  key: username
                  name: dev-nexus-credentials
            - name: NEXUS_PASSWORD
              valueFrom:
                secretKeyRef:
                  key: password
                  name: dev-nexus-credentials
          image: alpine/curl:8.12.1
          imagePullPolicy: IfNotPresent
          name: shared-nginx-init
          resources: {}
          terminationMessagePath: /dev/termination-log
          terminationMessagePolicy: File
          volumeMounts:
            - mountPath: /opt/workspace/front
              name: front-volume
            - mountPath: /config/default/
              name: default-conf-volume
            - mountPath: /config/apps/
              name: apps-config-volume
      restartPolicy: Always
      schedulerName: default-scheduler
      securityContext: {}
      terminationGracePeriodSeconds: 30
      volumes:
        - name: front-volume
          persistentVolumeClaim:
            claimName: shared-nginx-pvc
        - configMap:
            defaultMode: 420
            name: shared-nginx-config
          name: default-conf-volume
        - configMap:
            defaultMode: 420
            name: shared-nginx-apps-configmap
          name: apps-config-volume
```

