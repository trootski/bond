FROM nginx:alpine

# Copy static files
COPY public /usr/share/nginx/html

# Copy nginx config template
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template

EXPOSE 80
