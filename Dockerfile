#step1 创建dockerfile
FROM swr.cn-north-1.myhuaweicloud.com/nascent/nginx:1.16.1
ENV TZ Asia/Shanghai
ADD ./dist/ /usr/share/nginx/html
RUN chmod -R a+r /usr/share/nginx/html
EXPOSE 80
