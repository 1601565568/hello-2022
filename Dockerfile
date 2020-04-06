FROM nginx:1.16.1
COPY ./dist/ /usr/share/nginx/html
RUN chmod -R 777 /usr/share/nginx/html
RUN rm -rf /etc/nginx/conf.d/default.conf
COPY prepub_nginx.conf /etc/nginx/conf.d/
RUN chmod -R 777 /etc/nginx/conf.d/
