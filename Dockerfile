# 使用 nginx 作为生产环境服务器
FROM nginx:alpine AS production


COPY /operation/dist/operation /usr/share/nginx/html/dts-web/operation
COPY /operation/dist/public /usr/share/nginx/html/dts-web/operation/public

COPY /client/dist/client /usr/share/nginx/html/dts-web/client
COPY /client/dist/public /usr/share/nginx/html/dts-web/client/public



# 暴露端口
EXPOSE 80


# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]
